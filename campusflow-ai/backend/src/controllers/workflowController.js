const db = require('../database/db');
const { parseNaturalLanguageWorkflow, executeWorkflowForRequest } = require('../services/workflow/workflowEngine');
const { successResponse, errorResponse } = require('../utils/response');

async function getWorkflows(req, res, next) {
  try {
    const list = await db.workflows.find();
    return successResponse(res, list, 'Workflows retrieved');
  } catch (err) {
    next(err);
  }
}

async function createWorkflow(req, res, next) {
  try {
    const { name, description, triggerEvent, definition } = req.body;
    if (!name || !triggerEvent) {
      return errorResponse(res, 'Workflow name and trigger event are required', 400, 'VALIDATION_ERROR');
    }

    const workflow = await db.workflows.create({
      name,
      description,
      trigger_event: triggerEvent,
      definition: definition || {},
      is_active: true,
      created_by: req.user ? req.user.id : null
    });

    return successResponse(res, workflow, 'Workflow created successfully', 201);
  } catch (err) {
    next(err);
  }
}

/**
 * Flagship Innovation: Natural Language Workflow Builder
 * Converts plain English prompt into complete node-based workflow graph
 */
async function generateWorkflowFromNaturalLanguage(req, res, next) {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return errorResponse(res, 'Prompt describing your automation is required', 400, 'VALIDATION_ERROR');
    }

    const parsedWorkflow = parseNaturalLanguageWorkflow(prompt);
    return successResponse(res, parsedWorkflow, 'Workflow generated from natural language description');
  } catch (err) {
    next(err);
  }
}

async function runWorkflow(req, res, next) {
  try {
    const { id } = req.params;
    const { requestId } = req.body;

    const request = await db.requests.findById(requestId);
    if (!request) {
      return errorResponse(res, 'Target request not found', 404, 'NOT_FOUND');
    }

    const runResult = await executeWorkflowForRequest({ workflowId: id, request });
    return successResponse(res, runResult, 'Workflow run executed');
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getWorkflows,
  createWorkflow,
  generateWorkflowFromNaturalLanguage,
  runWorkflow
};
