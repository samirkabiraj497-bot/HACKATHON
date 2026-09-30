const db = require('../database/db');
const { createNotification } = require('../services/notification/notificationService');
const { successResponse, errorResponse } = require('../utils/response');

async function ensureDefaultApprovals(force = false) {
  if (!force) {
    const existing = await db.approvals.find();
    if (existing && existing.length > 0) return existing;
  }

  const users = await db.users.find();
  const facultyUser = users.find(u => u.role === 'faculty') || users[3] || { id: 'u0000000-0000-0000-0000-000000000004', full_name: 'Prof. Rajesh Nair' };
  const hodUser = users.find(u => u.role === 'department_head') || users[1] || { id: 'u0000000-0000-0000-0000-000000000002', full_name: 'Dr. Sunita Rao' };

  const defaultApprovals = [
    {
      id: 'app-0000-0000-0000-000000000001',
      request_id: 'r0000000-0000-0000-0000-000000000064',
      requestTitle: 'On-Duty (OD) Leave Approval: National Smart Automation Hackathon (4 Days)',
      requestNumber: 'REQ-1064',
      departmentName: 'Academics',
      studentName: 'Aarav Mehta (CS-3rd Year)',
      reasonDetails: 'Selected as national finalist for Smart Automation Challenge. Requires attendance regularization for 4 lecture days.',
      aiPreScreen: 'AI Pre-Screen: PASS (Attendance 89% > 75% required, No pending disciplinary flags)',
      approver_id: facultyUser.id,
      approver_role: 'faculty_advisor',
      approverRole: 'faculty_advisor',
      approverName: facultyUser.full_name,
      status: 'pending',
      created_at: new Date(Date.now() - 3600 * 1000 * 2).toISOString()
    },
    {
      id: 'app-0000-0000-0000-000000000002',
      request_id: 'r0000000-0000-0000-0000-000000000071',
      requestTitle: 'Main Auditorium & AV System Reservation for Annual Tech Showcase',
      requestNumber: 'REQ-1071',
      departmentName: 'Student Affairs',
      studentName: 'Ananya Sen (Student Council President)',
      reasonDetails: 'Booking main auditorium, 4 wireless mics, and high-lumen projector for Saturday university tech fest.',
      aiPreScreen: 'AI Pre-Screen: PASS (Auditorium calendar slot vacant, AV technician scheduled)',
      approver_id: hodUser.id,
      approver_role: 'department_head',
      approverRole: 'department_head',
      approverName: hodUser.full_name,
      status: 'pending',
      created_at: new Date(Date.now() - 3600 * 1000 * 5).toISOString()
    },
    {
      id: 'app-0000-0000-0000-000000000003',
      request_id: 'r0000000-0000-0000-0000-000000000078',
      requestTitle: 'Elective Course Substitution & Lab Timetable Regularization',
      departmentName: 'Academics',
      studentName: 'Rohan Deshmukh (IT-4th Year)',
      reasonDetails: 'Timetable conflict between Advanced Distributed Systems and Honors AI Lab. Dean clearance requested.',
      aiPreScreen: 'AI Pre-Screen: PASS (Credit requirements satisfied, faculty capacity available)',
      approver_id: facultyUser.id,
      approver_role: 'faculty_advisor',
      approverRole: 'faculty_advisor',
      approverName: facultyUser.full_name,
      status: 'pending',
      created_at: new Date(Date.now() - 3600 * 1000 * 8).toISOString()
    }
  ];

  await db.approvals.setAll(defaultApprovals);
  return defaultApprovals;
}

async function getApprovals(req, res, next) {
  try {
    let list = await db.approvals.find();
    if (!list || list.length === 0) {
      list = await ensureDefaultApprovals();
    }

    const requests = await db.requests.find();
    const users = await db.users.find();

    const enriched = list.map(app => {
      const r = requests.find(req => req.id === app.request_id) || {};
      const u = users.find(user => user.id === app.approver_id) || {};
      return {
        ...app,
        requestTitle: app.requestTitle || r.title || 'Campus Operational Request',
        requestNumber: app.requestNumber || r.request_number || 'REQ-1064',
        departmentName: app.departmentName || r.department_name || 'Academics',
        studentName: app.studentName || 'Student (Campus Operations)',
        reasonDetails: app.reasonDetails || r.description || 'Request submitted for administrative sign-off.',
        approverName: app.approverName || u.full_name || 'Prof. Rajesh Nair',
        approverRole: app.approverRole || app.approver_role || 'faculty_advisor',
        approver_role: app.approver_role || app.approverRole || 'faculty_advisor',
        aiPreScreen: app.aiPreScreen || 'AI Pre-Screen: PASS (Verified with academic and policy registry)'
      };
    });

    enriched.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    return successResponse(res, enriched, 'Approvals retrieved successfully');
  } catch (err) {
    next(err);
  }
}

async function resetApprovals(req, res, next) {
  try {
    const list = await ensureDefaultApprovals(true);
    return successResponse(res, list, 'Approvals reset successfully');
  } catch (err) {
    next(err);
  }
}

async function approveRequest(req, res, next) {
  try {
    const { id } = req.params;
    const { comments = 'Approved' } = req.body;
    const actor = req.user || { id: 'u0000000-0000-0000-0000-000000000004', full_name: 'Prof. Rajesh Nair' };

    const approval = await db.approvals.findById(id);
    if (!approval) {
      return errorResponse(res, 'Approval record not found', 404, 'NOT_FOUND');
    }

    const updated = await db.approvals.update(id, {
      status: 'approved',
      comments,
      decided_at: new Date().toISOString()
    });

    // Update parent request status if found
    if (approval.request_id) {
      const parentReq = await db.requests.findById(approval.request_id);
      if (parentReq) {
        await db.requests.update(parentReq.id, {
          status: 'IN_PROGRESS'
        });

        if (parentReq.submitted_by) {
          await createNotification({
            userId: parentReq.submitted_by,
            title: `✅ Request Approved: ${parentReq.request_number}`,
            message: `Your request "${parentReq.title}" was approved by ${actor.full_name}. Next operational workflow is active.`,
            type: 'approval_decision',
            referenceId: parentReq.id,
            referenceType: 'request'
          });
        }
      }
    }

    // Audit log
    await db.auditLogs.create({
      actor_name: actor.full_name,
      actor_type: 'HUMAN',
      action: 'APPROVE_REQUEST',
      entity_type: 'approval',
      entity_id: id,
      details: `Approved by ${actor.full_name}: "${comments}"`
    });

    return successResponse(res, updated, 'Approval granted successfully');
  } catch (err) {
    next(err);
  }
}

async function rejectRequest(req, res, next) {
  try {
    const { id } = req.params;
    const { comments } = req.body;
    const actor = req.user || { id: 'u0000000-0000-0000-0000-000000000004', full_name: 'Prof. Rajesh Nair' };

    if (!comments) {
      return errorResponse(res, 'Rejection reason is required', 400, 'VALIDATION_ERROR');
    }

    const approval = await db.approvals.findById(id);
    if (!approval) {
      return errorResponse(res, 'Approval record not found', 404, 'NOT_FOUND');
    }

    const updated = await db.approvals.update(id, {
      status: 'rejected',
      comments,
      decided_at: new Date().toISOString()
    });

    if (approval.request_id) {
      const parentReq = await db.requests.findById(approval.request_id);
      if (parentReq) {
        await db.requests.update(parentReq.id, {
          status: 'REJECTED'
        });

        if (parentReq.submitted_by) {
          await createNotification({
            userId: parentReq.submitted_by,
            title: `❌ Request Rejected: ${parentReq.request_number}`,
            message: `Your request "${parentReq.title}" was rejected by ${actor.full_name}. Reason: ${comments}.`,
            type: 'approval_decision',
            referenceId: parentReq.id,
            referenceType: 'request'
          });
        }
      }
    }

    // Audit log
    await db.auditLogs.create({
      actor_name: actor.full_name,
      actor_type: 'HUMAN',
      action: 'REJECT_REQUEST',
      entity_type: 'approval',
      entity_id: id,
      details: `Rejected by ${actor.full_name}. Reason: "${comments}"`
    });

    return successResponse(res, updated, 'Request rejected with reason');
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getApprovals,
  approveRequest,
  rejectRequest,
  ensureDefaultApprovals,
  resetApprovals
};
