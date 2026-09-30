const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const requestController = require('../controllers/requestController');
const aiController = require('../controllers/aiController');
const workflowController = require('../controllers/workflowController');
const assignmentController = require('../controllers/assignmentController');
const approvalController = require('../controllers/approvalController');
const escalationController = require('../controllers/escalationController');
const analyticsController = require('../controllers/analyticsController');
const notificationController = require('../controllers/notificationController');
const demoController = require('../controllers/demoController');
const { authenticate } = require('../middleware/auth');

// Express-Validator Rule Sets
const { registerValidationRules, loginValidationRules } = require('../validators/authValidator');
const { createRequestValidationRules, commentValidationRules } = require('../validators/requestValidator');
const { generateWorkflowValidationRules } = require('../validators/workflowValidator');

// Public & Auth Endpoints
router.post('/auth/register', registerValidationRules, authController.register);
router.post('/auth/login', loginValidationRules, authController.login);
router.post('/auth/switch-role', authController.switchDemoRole);
router.get('/auth/me', authenticate, authController.getCurrentUser);

// Requests Endpoints
router.get('/requests', requestController.getRequests);
router.post('/requests', createRequestValidationRules, requestController.createRequest);
router.get('/requests/:id', requestController.getRequestById);
router.patch('/requests/:id', requestController.updateRequest);
router.post('/requests/:id/comments', commentValidationRules, requestController.addComment);

// AI Automation Endpoints
router.post('/ai/classify', aiController.classify);
router.post('/ai/analyze', aiController.analyzePriority);
router.post('/ai/duplicates', aiController.checkDuplicates);
router.post('/ai/merge-duplicates', aiController.mergeDuplicates);
router.get('/ai/recurring', aiController.getRecurringIssues);
router.post('/ai/copilot/query', aiController.copilotQuery);
router.post('/ai/copilot/action', aiController.copilotAction);

// Assignments & Staff
router.get('/employees', assignmentController.getEmployees);
router.post('/requests/:id/assign', assignmentController.assignRequest);

// Workflows
router.get('/workflows', workflowController.getWorkflows);
router.post('/workflows', workflowController.createWorkflow);
router.post('/workflows/generate', generateWorkflowValidationRules, workflowController.generateWorkflowFromNaturalLanguage);
router.post('/workflows/:id/run', workflowController.runWorkflow);

// Approvals
router.get('/approvals', approvalController.getApprovals);
router.post('/approvals/:id/approve', approvalController.approveRequest);
router.post('/approvals/:id/reject', approvalController.rejectRequest);

// Escalation & SLA
router.get('/escalation/rules', escalationController.getSLARules);
router.post('/escalation/sweep', escalationController.runSLASweep);
router.post('/requests/:id/escalate', escalationController.triggerEscalation);

// Analytics & Daily Report
router.get('/analytics', analyticsController.getAnalytics);
router.get('/reports/daily', analyticsController.getDailyReport);

// Notifications
router.get('/notifications', notificationController.getNotifications);
router.patch('/notifications/:id/read', notificationController.readNotification);
router.post('/notifications/mark-all-read', notificationController.markAllNotificationsRead);

// Demo & System Audit
router.post('/demo/run-scenario', demoController.runDemoScenario);
router.post('/demo/reset', demoController.resetDemoData);
router.get('/audit-logs', demoController.getAuditLogs);

module.exports = router;
