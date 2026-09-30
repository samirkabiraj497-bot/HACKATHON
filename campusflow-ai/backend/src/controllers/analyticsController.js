const { getAnalyticsOverview } = require('../services/analytics/analyticsService');
const { generateDailyReport } = require('../services/reporting/reportingService');
const { successResponse } = require('../utils/response');

async function getAnalytics(req, res, next) {
  try {
    const data = await getAnalyticsOverview();
    return successResponse(res, data, 'Analytics data retrieved');
  } catch (err) {
    next(err);
  }
}

async function getDailyReport(req, res, next) {
  try {
    const report = await generateDailyReport();
    return successResponse(res, report, 'Daily AI Operations report generated');
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAnalytics,
  getDailyReport
};
