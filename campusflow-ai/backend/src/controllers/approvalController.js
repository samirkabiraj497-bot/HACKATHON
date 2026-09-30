const db = require('../database/db');
const { createNotification } = require('../services/notification/notificationService');
const { successResponse, errorResponse } = require('../utils/response');

async function getApprovals(req, res, next) {
  try {
    const list = await db.approvals.find();
    const requests = await db.requests.find();
    const users = await db.users.find();

    const enriched = list.map(app => {
      const r = requests.find(req => req.id === app.request_id) || {};
      const u = users.find(user => user.id === app.approver_id) || {};
      return {
        ...app,
        requestTitle: r.title || 'Campus Request',
        requestNumber: r.request_number || 'REQ-UNKNOWN',
        departmentName: r.department_name,
        approverName: u.full_name || 'Designated Approver'
      };
    });

    enriched.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    return successResponse(res, enriched, 'Approvals retrieved successfully');
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

    // Update parent request status
    const parentReq = await db.requests.findById(approval.request_id);
    if (parentReq) {
      await db.requests.update(parentReq.id, {
        status: 'IN_PROGRESS'
      });

      // Notify submitter
      if (parentReq.submitted_by) {
        await createNotification({
          userId: parentReq.submitted_by,
          title: `✅ Request Approved: ${parentReq.request_number}`,
          message: `Your request "${parentReq.title}" was approved by ${actor.full_name}. Progress is now underway.`,
          type: 'approval_decision',
          referenceId: parentReq.id,
          referenceType: 'request'
        });
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

    const parentReq = await db.requests.findById(approval.request_id);
    if (parentReq) {
      await db.requests.update(parentReq.id, {
        status: 'REJECTED'
      });

      // Notify submitter with reason
      if (parentReq.submitted_by) {
        await createNotification({
          userId: parentReq.submitted_by,
          title: `❌ Request Rejected: ${parentReq.request_number}`,
          message: `Your request "${parentReq.title}" was not approved by ${actor.full_name}. Reason: ${comments}.`,
          type: 'approval_decision',
          referenceId: parentReq.id,
          referenceType: 'request'
        });
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
  rejectRequest
};
