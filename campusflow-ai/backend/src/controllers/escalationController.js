const db = require('../database/db');
const { checkAndProcessSLAs, escalateRequest } = require('../services/escalation/escalationService');
const { successResponse, errorResponse } = require('../utils/response');

async function triggerEscalation(req, res, next) {
  try {
    const { id } = req.params;
    const { reason, targetRole } = req.body;
    const actorName = req.user ? req.user.full_name : 'AI Supervisor';

    const result = await escalateRequest({
      requestId: id,
      reason,
      escalatedBy: actorName,
      targetRole
    });

    return successResponse(res, result, 'Request escalated successfully');
  } catch (err) {
    next(err);
  }
}

async function getSLARules(req, res, next) {
  try {
    const rules = await db.slaRules.find();
    return successResponse(res, rules, 'SLA rules retrieved');
  } catch (err) {
    next(err);
  }
}

async function runSLASweep(req, res, next) {
  try {
    const sweepResults = await checkAndProcessSLAs();
    return successResponse(res, sweepResults, 'Autonomous SLA watchdog sweep completed');
  } catch (err) {
    next(err);
  }
}

module.exports = {
  triggerEscalation,
  getSLARules,
  runSLASweep
};
