/**
 * AI Priority Engine
 * Computes deterministic multi-factor priority score based on:
 * - Urgency signals (deadline, exam, presentation)
 * - Operational impact (classroom, lab, server room, whole hostel)
 * - Number of affected people
 * - Hazard / Safety risks
 */

function calculatePriority({ title = '', description = '', category = '', location = '', affectedCount = 1, deadline = null }) {
  const text = `${title} ${description} ${location}`.toLowerCase();
  let score = 50; // default baseline (Medium)
  const factors = [];

  // Hazard / High Risk / Flooding
  if (text.includes('flood') || text.includes('fire') || text.includes('spark') || text.includes('shock') || text.includes('short circuit') || text.includes('gas')) {
    score += 45;
    factors.push('Life-safety / severe property damage risk identified (+45)');
  }

  // Stoppage / Inaccessible Room / Entire batch blocked
  if (text.includes('cannot use') || text.includes('unable to conduct') || text.includes('all students') || text.includes('whole lab') || text.includes('blackout')) {
    score += 25;
    factors.push('Total facility inaccessibility or session stoppage (+25)');
  }

  // Upcoming Presentation / Exam / Tomorrow morning
  if (text.includes('presentation') || text.includes('exam') || text.includes('tomorrow morning') || text.includes('viva') || text.includes('submission')) {
    score += 25;
    factors.push('Critical academic milestone deadline impending (+25)');
  } else if (text.includes('tomorrow') || text.includes('today') || text.includes('urgent')) {
    score += 15;
    factors.push('Short-term operational urgency (+15)');
  }

  // Equipment criticality
  if (text.includes('server') || text.includes('main router') || text.includes('water tank') || text.includes('projector') || text.includes('ac')) {
    score += 10;
    factors.push('Core infrastructure equipment involved (+10)');
  }

  // Affected count
  if (affectedCount >= 50) {
    score += 20;
    factors.push(`Mass user impact: estimated ${affectedCount}+ students/faculty (+20)`);
  } else if (affectedCount >= 10) {
    score += 10;
    factors.push(`Medium group impact: ${affectedCount}+ individuals (+10)`);
  }

  // Low urgency down-weighting
  if (text.includes('inquiry') || text.includes('how to') || text.includes('general question') || text.includes('feedback') || text.includes('curious')) {
    score -= 30;
    factors.push('Routine non-blocking inquiry (-30)');
  }

  // Determine final tier
  let priority = 'MEDIUM';
  if (score >= 85) {
    priority = 'CRITICAL';
  } else if (score >= 65) {
    priority = 'HIGH';
  } else if (score <= 35) {
    priority = 'LOW';
  }

  return {
    priority,
    score: Math.min(100, Math.max(10, score)),
    factors,
    recommendedSLAResolutionHours: priority === 'CRITICAL' ? 2 : priority === 'HIGH' ? 8 : priority === 'MEDIUM' ? 24 : 72
  };
}

module.exports = {
  calculatePriority
};
