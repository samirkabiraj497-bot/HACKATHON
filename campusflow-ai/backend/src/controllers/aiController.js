const { classifyRequest } = require('../services/ai/aiClassificationService');
const { calculatePriority } = require('../services/ai/aiPriorityEngine');
const { findDuplicateIncidents, mergeRequestsIntoMasterIncident } = require('../services/ai/aiDuplicateDetector');
const { analyzeRecurringIssues } = require('../services/ai/aiRecurringDetector');
const { processCopilotQuery, executeCopilotAction } = require('../services/ai/aiCopilotService');
const { successResponse, errorResponse } = require('../utils/response');

async function classify(req, res, next) {
  try {
    const { title, description, location } = req.body;
    if (!title && !description) {
      return errorResponse(res, 'Title or description required for AI analysis', 400, 'VALIDATION_ERROR');
    }

    const result = await classifyRequest({ title, description, location });
    return successResponse(res, result, 'AI classification complete');
  } catch (err) {
    next(err);
  }
}

async function analyzePriority(req, res, next) {
  try {
    const { title, description, category, location, affectedCount, deadline } = req.body;
    const result = calculatePriority({ title, description, category, location, affectedCount, deadline });
    return successResponse(res, result, 'Priority analysis complete');
  } catch (err) {
    next(err);
  }
}

async function checkDuplicates(req, res, next) {
  try {
    const { title, description, location, categoryId, departmentId, currentRequestId } = req.body;
    const result = await findDuplicateIncidents({ title, description, location, categoryId, departmentId, currentRequestId });
    return successResponse(res, result, 'Duplicate incident check complete');
  } catch (err) {
    next(err);
  }
}

async function mergeDuplicates(req, res, next) {
  try {
    const { masterRequestId, duplicateRequestIds } = req.body;
    if (!masterRequestId || !Array.isArray(duplicateRequestIds) || duplicateRequestIds.length === 0) {
      return errorResponse(res, 'masterRequestId and non-empty duplicateRequestIds array are required', 400, 'VALIDATION_ERROR');
    }

    const actor = req.user ? req.user.full_name : 'AI_AGENT';
    const result = await mergeRequestsIntoMasterIncident({
      masterRequestId,
      duplicateRequestIds,
      mergedBy: actor
    });

    return successResponse(res, result, 'Requests merged into Master Incident successfully');
  } catch (err) {
    next(err);
  }
}

async function getRecurringIssues(req, res, next) {
  try {
    const result = await analyzeRecurringIssues();
    return successResponse(res, result, 'Recurring patterns and hotspots analyzed');
  } catch (err) {
    next(err);
  }
}

async function copilotQuery(req, res, next) {
  try {
    const { query } = req.body;
    if (!query) {
      return errorResponse(res, 'Query string is required', 400, 'VALIDATION_ERROR');
    }

    const user = req.user || { full_name: 'Administrator', role: 'admin' };
    const result = await processCopilotQuery({ query, user });
    return successResponse(res, result, 'Copilot response generated');
  } catch (err) {
    next(err);
  }
}

async function copilotAction(req, res, next) {
  try {
    const { actionId, params } = req.body;
    if (!actionId) {
      return errorResponse(res, 'actionId is required', 400, 'VALIDATION_ERROR');
    }

    const executedBy = req.user ? req.user.full_name : 'Administrator';
    const result = await executeCopilotAction({ actionId, params, executedBy });
    return successResponse(res, result, 'Copilot action executed successfully');
  } catch (err) {
    next(err);
  }
}

module.exports = {
  classify,
  analyzePriority,
  checkDuplicates,
  mergeDuplicates,
  getRecurringIssues,
  copilotQuery,
  copilotAction
};
