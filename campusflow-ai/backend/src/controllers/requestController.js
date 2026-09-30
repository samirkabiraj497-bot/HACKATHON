const db = require('../database/db');
const { classifyRequest } = require('../services/ai/aiClassificationService');
const { calculatePriority } = require('../services/ai/aiPriorityEngine');
const { findBestAssignee } = require('../services/assignment/intelligentAssignmentService');
const { findDuplicateIncidents } = require('../services/ai/aiDuplicateDetector');
const { executeWorkflowForRequest } = require('../services/workflow/workflowEngine');
const { createNotification } = require('../services/notification/notificationService');
const { successResponse, errorResponse } = require('../utils/response');

async function getRequests(req, res, next) {
  try {
    const { department, priority, status, search, limit = 100 } = req.query;
    let list = await db.requests.find();

    // Role-based visibility
    if (req.user && req.user.role === 'student') {
      list = list.filter(r => r.submitted_by === req.user.id);
    } else if (req.user && req.user.role === 'guest') {
      list = list.filter(r => r.submitted_by === req.user.id || r.is_guest || !r.submitted_by);
    } else if (req.user && req.user.role === 'staff') {
      const emp = await db.employees.findOne({ user_id: req.user.id });
      if (emp) {
        list = list.filter(r => r.assigned_to === emp.id || r.department_id === emp.department_id);
      }
    } else if (req.user && req.user.role === 'department_head') {
      if (req.user.department_id) {
        list = list.filter(r => r.department_id === req.user.department_id);
      }
    }

    // Filters
    if (department) {
      list = list.filter(r => (r.department_name || '').toLowerCase() === department.toLowerCase());
    }
    if (priority) {
      list = list.filter(r => (r.priority || '').toUpperCase() === priority.toUpperCase());
    }
    if (status) {
      list = list.filter(r => (r.status || '').toUpperCase() === status.toUpperCase());
    }
    if (search) {
      const s = search.toLowerCase();
      list = list.filter(r => 
        (r.title && r.title.toLowerCase().includes(s)) ||
        (r.request_number && r.request_number.toLowerCase().includes(s)) ||
        (r.location && r.location.toLowerCase().includes(s))
      );
    }

    // Sort newest first
    list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    return successResponse(res, list.slice(0, parseInt(limit)), 'Requests retrieved successfully');
  } catch (err) {
    next(err);
  }
}

async function getRequestById(req, res, next) {
  try {
    const { id } = req.params;
    const request = await db.requests.findById(id);
    if (!request) {
      return errorResponse(res, 'Request not found', 404, 'NOT_FOUND');
    }

    // Load related comments, tasks, attachments, and audit trail
    const comments = await db.requestComments.find({ request_id: id });
    const tasks = await db.tasks.find({ request_id: id });
    const attachments = await db.requestAttachments.find({ request_id: id });
    const auditTrail = await db.auditLogs.find({ entity_id: id });
    const assignee = request.assigned_to ? await db.employees.findById(request.assigned_to) : null;
    let assigneeUser = null;
    if (assignee) {
      assigneeUser = await db.users.findById(assignee.user_id);
    }

    return successResponse(res, {
      ...request,
      comments,
      tasks,
      attachments,
      auditTrail,
      assigneeDetails: assignee ? {
        id: assignee.id,
        name: assigneeUser ? assigneeUser.full_name : 'Staff Technician',
        jobTitle: assignee.job_title,
        skills: assignee.skills,
        rating: assignee.rating
      } : null
    }, 'Request details retrieved');
  } catch (err) {
    next(err);
  }
}

/**
 * Flagship Autonomous Request Intake:
 * Natural language text -> AI Classify -> AI Prioritize -> Route -> Assign -> Notify -> Workflow
 */
async function createRequest(req, res, next) {
  try {
    const { title, description, location, deadline, manualOverride, guestName, guestEmail } = req.body;
    const submitter = req.user || { 
      id: 'u0000000-0000-0000-0000-000000000099', 
      full_name: guestName || 'Campus Guest', 
      role: 'guest',
      email: guestEmail || 'guest@campus.edu' 
    };

    if (!title || !description) {
      return errorResponse(res, 'Title and description are required', 400, 'VALIDATION_ERROR');
    }

    // 1. AI Classification & Intent Extraction
    const aiClassification = await classifyRequest({
      title,
      description,
      location
    });

    // 2. AI Priority Engine
    const priorityResult = calculatePriority({
      title,
      description,
      location: location || (aiClassification.entities && aiClassification.entities.location) || '',
      category: aiClassification.category,
      deadline
    });

    const finalPriority = manualOverride && manualOverride.priority ? manualOverride.priority : (priorityResult.priority || aiClassification.priority);
    const finalDeptName = manualOverride && manualOverride.department ? manualOverride.department : aiClassification.department;

    // Resolve Department ID
    const departments = await db.departments.find();
    const dept = departments.find(d => d.name.toLowerCase() === finalDeptName.toLowerCase()) || departments[0];

    // Compute SLA Deadline
    const slaHours = finalPriority === 'CRITICAL' ? 2 : finalPriority === 'HIGH' ? 8 : finalPriority === 'MEDIUM' ? 24 : 72;
    const slaDeadline = new Date(Date.now() + slaHours * 3600 * 1000).toISOString();

    // 3. Intelligent Assignment Engine
    const assignmentResult = await findBestAssignee({
      departmentId: dept.id,
      departmentName: dept.name,
      category: aiClassification.category,
      subcategory: aiClassification.subcategory,
      priority: finalPriority,
      location: location || (aiClassification.entities && aiClassification.entities.location),
      entities: aiClassification.entities
    });

    const recommended = assignmentResult.recommendedAssignee;

    // 4. Duplicate Incident Detection Check
    const dupCheck = await findDuplicateIncidents({
      title,
      description,
      location: location || (aiClassification.entities && aiClassification.entities.location),
      departmentId: dept.id
    });

    // 5. Generate Unique Request Number
    const count = await db.requests.count();
    const requestNumber = `REQ-${1040 + count + 1}`;

    // 6. Create Request Record
    const newRequest = await db.requests.create({
      request_number: requestNumber,
      title,
      description,
      raw_description: description,
      category_name: aiClassification.category,
      subcategory: aiClassification.subcategory,
      department_id: dept.id,
      department_name: dept.name,
      priority: finalPriority,
      status: recommended ? 'ASSIGNED' : 'NEW',
      submitted_by: submitter.id,
      submitted_by_name: guestName || submitter.full_name,
      submitted_by_email: guestEmail || submitter.email,
      is_guest: submitter.role === 'guest' || !req.user,
      assigned_to: recommended ? recommended.employeeId : null,
      location: location || (aiClassification.entities && aiClassification.entities.location) || 'Campus',
      deadline: deadline ? new Date(deadline).toISOString() : null,
      sla_deadline: slaDeadline,
      sla_status: 'on_track',
      ai_confidence: aiClassification.confidence,
      ai_summary: `${aiClassification.subcategory || aiClassification.category} issue detected at ${location || 'Campus'}. ${aiClassification.reasoning}`,
      entities: aiClassification.entities,
      is_duplicate: dupCheck.isDuplicate,
      master_incident_id: dupCheck.primaryIncidentRecommendation ? dupCheck.primaryIncidentRecommendation.masterRequestId : null
    });

    // 7. Create Operational Task
    let createdTask = null;
    if (recommended) {
      createdTask = await db.tasks.create({
        request_id: newRequest.id,
        title: `Resolution for ${requestNumber}: ${title.slice(0, 60)}`,
        description: description,
        assigned_to: recommended.employeeId,
        status: 'PENDING',
        priority: finalPriority,
        sla_deadline: slaDeadline
      });

      // Task assignment log
      await db.taskAssignments.create({
        task_id: createdTask.id,
        employee_id: recommended.employeeId,
        assigned_by: 'CAMPUSFLOW_AI_AGENT',
        match_score: recommended.matchScore,
        criteria_breakdown: recommended.breakdown
      });

      // 8. Send Notification to Assigned Technician
      await createNotification({
        userId: recommended.userId,
        title: `🎯 New Task Assigned: ${requestNumber}`,
        message: `AI dispatched ${requestNumber} (${finalPriority}) to you based on ${recommended.skillMatchPct}% skill match. Location: ${newRequest.location}.`,
        type: 'task_assigned',
        referenceId: newRequest.id,
        referenceType: 'request'
      });
    }

    // 9. Send Confirmation Notification to Submitter
    await createNotification({
      userId: submitter.id,
      title: `✅ Request Received & Autonomous Workflow Active: ${requestNumber}`,
      message: `Your request "${title}" was analyzed and routed to ${dept.name} with ${finalPriority} priority. SLA target: ${slaHours} hours.`,
      type: 'request_created',
      referenceId: newRequest.id,
      referenceType: 'request'
    });

    // 10. Record AI Decision
    await db.aiDecisions.create({
      request_id: newRequest.id,
      decision_type: 'INTAKE_TRIAGE_AND_DISPATCH',
      input_payload: { title, description, location },
      output_payload: {
        category: aiClassification.category,
        department: dept.name,
        priority: finalPriority,
        assignee: recommended ? recommended.name : 'Unallocated'
      },
      confidence: aiClassification.confidence,
      reasoning: aiClassification.reasoning,
      model_used: aiClassification.modelUsed
    });

    // 11. Audit Trail
    await db.auditLogs.create({
      actor_name: 'CampusFlow AI Agent',
      actor_type: 'AI_AGENT',
      action: 'AI_CLASSIFIED_AND_ROUTED',
      entity_type: 'request',
      entity_id: newRequest.id,
      details: `Classified as ${finalPriority} Priority for ${dept.name}. Assigned to ${recommended ? recommended.name : 'Queue'} (Score: ${recommended ? recommended.matchScore : 'N/A'}%).`
    });

    // 12. Trigger Autonomous Workflow Instance
    const workflowRun = await executeWorkflowForRequest({
      request: newRequest
    });

    return successResponse(res, {
      request: newRequest,
      aiAnalysis: aiClassification,
      assignment: recommended,
      duplicateWarning: dupCheck.isDuplicate ? dupCheck : null,
      workflowRun
    }, 'Request analyzed, prioritized and dispatched autonomously', 201);
  } catch (err) {
    next(err);
  }
}

async function updateRequest(req, res, next) {
  try {
    const { id } = req.params;
    const updates = req.body;
    const actorName = req.user ? req.user.full_name : 'Staff Technician';

    const existing = await db.requests.findById(id);
    if (!existing) {
      return errorResponse(res, 'Request not found', 404, 'NOT_FOUND');
    }

    const updated = await db.requests.update(id, updates);

    // If marked resolved
    if (updates.status === 'RESOLVED' && existing.status !== 'RESOLVED') {
      await db.requests.update(id, {
        resolved_at: new Date().toISOString(),
        sla_status: 'completed'
      });

      // Notify submitter
      if (existing.submitted_by) {
        await createNotification({
          userId: existing.submitted_by,
          title: `🎉 Request Resolved: ${existing.request_number}`,
          message: `Your request "${existing.title}" has been marked as resolved by campus operations. Thank you for your feedback!`,
          type: 'request_resolved',
          referenceId: id,
          referenceType: 'request'
        });
      }
    }

    // Log audit
    await db.auditLogs.create({
      actor_name: actorName,
      actor_type: req.user ? 'HUMAN' : 'SYSTEM',
      action: 'UPDATE_REQUEST_STATUS',
      entity_type: 'request',
      entity_id: id,
      old_values: { status: existing.status },
      new_values: { status: updates.status || existing.status },
      details: `Updated request ${existing.request_number} to ${updates.status || 'modified state'}`
    });

    return successResponse(res, updated, 'Request updated successfully');
  } catch (err) {
    next(err);
  }
}

async function addComment(req, res, next) {
  try {
    const { id } = req.params;
    const { comment, isInternal = false } = req.body;
    const user = req.user || { id: 'u0000000-0000-0000-0000-000000000001', full_name: 'Campus User' };

    if (!comment) {
      return errorResponse(res, 'Comment text is required', 400, 'VALIDATION_ERROR');
    }

    const newComment = await db.requestComments.create({
      request_id: id,
      user_id: user.id,
      comment,
      is_internal: isInternal
    });

    return successResponse(res, newComment, 'Comment added successfully', 201);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getRequests,
  getRequestById,
  createRequest,
  updateRequest,
  addComment
};
