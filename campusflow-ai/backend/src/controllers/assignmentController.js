const db = require('../database/db');
const { findBestAssignee } = require('../services/assignment/intelligentAssignmentService');
const { createNotification } = require('../services/notification/notificationService');
const { successResponse, errorResponse } = require('../utils/response');

async function getEmployees(req, res, next) {
  try {
    const { departmentId, availableOnly } = req.query;
    let list = await db.employees.find();
    const users = await db.users.find();
    const depts = await db.departments.find();

    if (departmentId) {
      list = list.filter(e => e.department_id === departmentId);
    }
    if (availableOnly === 'true') {
      list = list.filter(e => e.is_available);
    }

    const detailedList = list.map(emp => {
      const u = users.find(user => user.id === emp.user_id) || {};
      const d = depts.find(dept => dept.id === emp.department_id) || {};
      return {
        id: emp.id,
        userId: emp.user_id,
        name: u.full_name || 'Staff Specialist',
        email: u.email,
        phone: u.phone,
        avatar: u.avatar_url,
        jobTitle: emp.job_title,
        departmentName: d.name || 'Operations',
        departmentId: emp.department_id,
        skills: emp.skills || [],
        workloadScore: emp.workload_score || 0,
        isAvailable: emp.is_available,
        rating: emp.rating || 5.0,
        maxConcurrentTasks: emp.max_concurrent_tasks || 5
      };
    });

    return successResponse(res, detailedList, 'Employees retrieved successfully');
  } catch (err) {
    next(err);
  }
}

async function assignRequest(req, res, next) {
  try {
    const { id } = req.params;
    const { employeeId, autoSelect = false } = req.body;

    const request = await db.requests.findById(id);
    if (!request) {
      return errorResponse(res, 'Request not found', 404, 'NOT_FOUND');
    }

    let targetEmployee = null;
    let matchScore = 95;

    if (autoSelect || !employeeId) {
      const assignmentResult = await findBestAssignee({
        departmentId: request.department_id,
        departmentName: request.department_name,
        category: request.category_name,
        subcategory: request.subcategory,
        priority: request.priority,
        location: request.location,
        entities: request.entities
      });

      if (!assignmentResult.recommendedAssignee) {
        return errorResponse(res, 'No eligible technicians available for this department', 400, 'NO_AVAILABLE_STAFF');
      }

      targetEmployee = assignmentResult.recommendedAssignee;
      matchScore = targetEmployee.matchScore;
    } else {
      const emp = await db.employees.findById(employeeId);
      if (!emp) {
        return errorResponse(res, 'Employee not found', 404, 'EMPLOYEE_NOT_FOUND');
      }
      const u = await db.users.findById(emp.user_id);
      targetEmployee = {
        employeeId: emp.id,
        userId: emp.user_id,
        name: u ? u.full_name : 'Staff Specialist'
      };
    }

    // Update Request
    await db.requests.update(id, {
      assigned_to: targetEmployee.employeeId,
      status: request.status === 'NEW' ? 'ASSIGNED' : request.status
    });

    // Create / Update task
    await db.tasks.create({
      request_id: id,
      title: `Assignment for ${request.request_number}: ${request.title.slice(0, 60)}`,
      description: request.description,
      assigned_to: targetEmployee.employeeId,
      status: 'PENDING',
      priority: request.priority,
      sla_deadline: request.sla_deadline
    });

    // Notify technician
    await createNotification({
      userId: targetEmployee.userId,
      title: `🎯 Assigned to Ticket: ${request.request_number}`,
      message: `You were assigned to ${request.request_number} (${request.title.slice(0, 50)}). Priority: ${request.priority}.`,
      type: 'task_assigned',
      referenceId: request.id,
      referenceType: 'request'
    });

    // Audit log
    await db.auditLogs.create({
      actor_name: req.user ? req.user.full_name : 'AI Dispatcher',
      actor_type: req.user ? 'HUMAN' : 'AI_AGENT',
      action: 'ASSIGN_TECHNICIAN',
      entity_type: 'request',
      entity_id: id,
      details: `Assigned ${targetEmployee.name} to ${request.request_number}.`
    });

    return successResponse(res, {
      requestId: id,
      assignedTo: targetEmployee.name,
      matchScore
    }, 'Employee assigned successfully');
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getEmployees,
  assignRequest
};
