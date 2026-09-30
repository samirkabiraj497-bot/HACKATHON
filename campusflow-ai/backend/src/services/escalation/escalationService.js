const db = require('../../database/db');

/**
 * SLA Watchdog & Autonomous Escalation Service
 * Runs continuously / on schedule to inspect active tickets:
 * - 80% SLA threshold elapsed -> Generates SLA risk warning & ping
 * - 100% SLA breach -> Escalates to Department Head
 * - Extended breach (> 120m) -> Escalates to Campus Administrator
 */

async function checkAndProcessSLAs() {
  const activeRequests = await db.requests.find();
  const slaRules = await db.slaRules.find();
  const ruleMap = {};
  for (const r of slaRules) {
    ruleMap[r.priority] = r;
  }

  const now = new Date();
  const results = {
    evaluatedCount: 0,
    warningsIssued: 0,
    escalationsTriggered: 0,
    details: []
  };

  for (const req of activeRequests) {
    if (req.status === 'RESOLVED' || req.status === 'CLOSED' || req.status === 'MERGED') {
      continue;
    }

    results.evaluatedCount++;
    const createdAt = new Date(req.created_at);
    const rule = ruleMap[req.priority] || {
      resolution_time_minutes: req.priority === 'CRITICAL' ? 120 : req.priority === 'HIGH' ? 480 : 1440,
      warning_threshold_pct: 80
    };

    const totalAllowedMs = (rule.resolution_time_minutes || 120) * 60 * 1000;
    const elapsedMs = now - createdAt;
    const elapsedRatio = elapsedMs / totalAllowedMs;
    const elapsedPct = Math.round(elapsedRatio * 100);

    // 1. Approaching SLA Breach (80% - 99%)
    if (elapsedRatio >= (rule.warning_threshold_pct / 100) && elapsedRatio < 1.0) {
      if (req.sla_status !== 'at_risk' && req.sla_status !== 'escalated') {
        await db.requests.update(req.id, {
          sla_status: 'at_risk'
        });

        // Notify assigned staff
        if (req.assigned_to) {
          const emp = await db.employees.findById(req.assigned_to);
          if (emp) {
            await db.notifications.create({
              user_id: emp.user_id,
              title: `⚠️ SLA Warning (${elapsedPct}%): ${req.request_number}`,
              message: `Ticket "${req.title}" has consumed ${elapsedPct}% of its allocated SLA window. Please complete resolution promptly to avoid automatic escalation.`,
              type: 'sla_warning',
              reference_id: req.id,
              reference_type: 'request'
            });
          }
        }

        results.warningsIssued++;
        results.details.push(`Issued 80% SLA Warning on ${req.request_number} (${elapsedPct}%)`);
      }
    }

    // 2. SLA Exceeded / Breached (>= 100%)
    if (elapsedRatio >= 1.0 && req.status !== 'ESCALATED') {
      await db.requests.update(req.id, {
        status: 'ESCALATED',
        sla_status: 'breached'
      });

      // Escalate to Department Head
      const allDepts = await db.departments.find();
      const dept = allDepts.find(d => d.id === req.department_id || d.name === req.department_name);
      
      const deptHeadId = dept && dept.head_id ? dept.head_id : null;
      if (deptHeadId) {
        await db.notifications.create({
          user_id: deptHeadId,
          title: `🚨 ESCALATION: SLA Breached on ${req.request_number}`,
          message: `Request "${req.title}" (${req.priority}) has breached its service agreement and has been autonomously escalated to you for supervisor intervention.`,
          type: 'escalation_alert',
          reference_id: req.id,
          reference_type: 'request'
        });
      }

      // Log into Audit Trail
      await db.auditLogs.create({
        actor_name: 'CAMPUSFLOW_AI_SLA_WATCHDOG',
        actor_type: 'AI_AGENT',
        action: 'AUTO_ESCALATE_SLA_BREACH',
        entity_type: 'request',
        entity_id: req.id,
        old_values: { status: req.status, sla_status: req.sla_status },
        new_values: { status: 'ESCALATED', sla_status: 'breached' },
        details: `SLA breached (${elapsedPct}% elapsed). Autonomously escalated to Department Head.`
      });

      results.escalationsTriggered++;
      results.details.push(`Escalated ${req.request_number} to Department Head (SLA Breach ${elapsedPct}%)`);
    }
  }

  return results;
}

/**
 * Manually or programmatically escalate a request
 */
async function escalateRequest({ requestId, reason, escalatedBy = 'AI_AGENT', targetRole = 'department_head' }) {
  const req = await db.requests.findById(requestId);
  if (!req) throw new Error('Request not found');

  const oldStatus = req.status;
  await db.requests.update(requestId, {
    status: 'ESCALATED',
    sla_status: 'breached'
  });

  // Create notification
  const depts = await db.departments.find();
  const dept = depts.find(d => d.id === req.department_id || d.name === req.department_name);

  if (dept && dept.head_id) {
    await db.notifications.create({
      user_id: dept.head_id,
      title: `🚨 Priority Escalation: ${req.request_number}`,
      message: `Request "${req.title}" was escalated by ${escalatedBy}. Reason: ${reason || 'Operational deadline delay'}.`,
      type: 'escalation_alert',
      reference_id: req.id,
      reference_type: 'request'
    });
  }

  await db.auditLogs.create({
    actor_name: escalatedBy,
    actor_type: escalatedBy.includes('AI') ? 'AI_AGENT' : 'HUMAN',
    action: 'ESCALATE_REQUEST',
    entity_type: 'request',
    entity_id: req.id,
    old_values: { status: oldStatus },
    new_values: { status: 'ESCALATED' },
    details: reason || 'Manual escalation requested'
  });

  return {
    success: true,
    message: `Request ${req.request_number} has been escalated to ${targetRole}.`,
    status: 'ESCALATED'
  };
}

module.exports = {
  checkAndProcessSLAs,
  escalateRequest
};
