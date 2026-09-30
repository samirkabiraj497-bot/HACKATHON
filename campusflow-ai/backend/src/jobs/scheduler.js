const cron = require('node-cron');
const { checkAndProcessSLAs } = require('../services/escalation/escalationService');
const { analyzeRecurringIssues } = require('../services/ai/aiRecurringDetector');
const { generateDailyReport } = require('../services/reporting/reportingService');

/**
 * CampusFlow Autonomous Operational Scheduler
 * Runs periodic background cycles for SLA monitoring, escalation sweeps, and pattern detection
 */
function initScheduler() {
  console.log('⏰ Initializing CampusFlow AI Autonomous Cron Scheduler...');

  // 1. SLA Watchdog & Overdue Sweep: Runs every 2 minutes
  cron.schedule('*/2 * * * *', async () => {
    try {
      const results = await checkAndProcessSLAs();
      if (results.warningsIssued > 0 || results.escalationsTriggered > 0) {
        console.log(`[Cron SLA Watchdog] Evaluated ${results.evaluatedCount} tickets | ${results.warningsIssued} warnings | ${results.escalationsTriggered} escalations`);
      }
    } catch (err) {
      console.error('[Cron SLA Watchdog Error]:', err.message);
    }
  });

  // 2. Pattern & Recurring Defect Detection: Runs every 15 minutes
  cron.schedule('*/15 * * * *', async () => {
    try {
      const report = await analyzeRecurringIssues();
      console.log(`[Cron Pattern Analyzer] Detected ${report.totalInsights} recurring anomalies across facilities.`);
    } catch (err) {
      console.error('[Cron Pattern Analyzer Error]:', err.message);
    }
  });

  // 3. Daily Executive Operations Report: Runs at 23:59 daily
  cron.schedule('59 23 * * *', async () => {
    try {
      const daily = await generateDailyReport();
      console.log(`[Cron Daily Synthesis] Daily Operations Report compiled: ${daily.metrics.totalRequests} total requests.`);
    } catch (err) {
      console.error('[Cron Daily Report Error]:', err.message);
    }
  });

  console.log('✅ Cron scheduler active (SLA Watchdog: 2m, Anomaly Detector: 15m, Daily Report: 24h).');
}

module.exports = {
  initScheduler
};
