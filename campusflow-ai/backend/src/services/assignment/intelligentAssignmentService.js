const db = require('../../database/db');

/**
 * Intelligent Assignment Engine
 * Evaluates candidate employees within the target department using multi-factor scoring:
 * - Skill Match: 35%
 * - Current Workload (Inverse): 25%
 * - Availability Status: 20%
 * - Performance Rating & Track Record: 10%
 * - Proximity / Facility Familiarity: 10%
 */

async function findBestAssignee({ departmentId, departmentName, category, subcategory, priority, location, entities = {} }) {
  // Load department employees
  const allEmployees = await db.employees.find();
  const allUsers = await db.users.find();
  const allDepts = await db.departments.find();

  // Find target department
  let targetDept = null;
  if (departmentId) {
    targetDept = allDepts.find(d => d.id === departmentId);
  } else if (departmentName) {
    targetDept = allDepts.find(d => d.name.toLowerCase() === departmentName.toLowerCase());
  }

  // Filter department employees
  let candidates = allEmployees.filter(emp => {
    if (!targetDept) return true;
    return emp.department_id === targetDept.id;
  });

  if (candidates.length === 0) {
    candidates = allEmployees; // fallback to any available staff if dept has none
  }

  const scoredCandidates = candidates.map(emp => {
    const user = allUsers.find(u => u.id === emp.user_id) || { full_name: 'Campus Staff', email: 'staff@campus.edu' };
    const skills = (emp.skills || []).map(s => s.toLowerCase());

    // 1. Skill Match Score (0 - 100)
    let skillScore = 60; // baseline
    const targetKeywords = [
      (subcategory || '').toLowerCase(),
      (category || '').toLowerCase(),
      (entities.equipment || '').toLowerCase()
    ].filter(Boolean);

    for (const kw of targetKeywords) {
      for (const skill of skills) {
        if (skill.includes(kw) || kw.includes(skill)) {
          skillScore = Math.min(100, skillScore + 25);
        }
      }
    }

    // Specific matching heuristics
    if (entities.equipment === 'projector' || subcategory === 'Audio/Visual') {
      if (skills.some(s => s.includes('projector') || s.includes('av') || s.includes('audio'))) {
        skillScore = 96;
      }
    } else if (entities.equipment === 'ac' || subcategory === 'HVAC / Cooling') {
      if (skills.some(s => s.includes('ac') || s.includes('hvac') || s.includes('cooling'))) {
        skillScore = 95;
      }
    } else if (subcategory === 'Electrical') {
      if (skills.some(s => s.includes('electric') || s.includes('wiring'))) {
        skillScore = 94;
      }
    }

    // 2. Workload Score (Inverse of current load, 0 - 100)
    const currentLoad = emp.workload_score || 35;
    const workloadScore = Math.max(0, 100 - currentLoad);

    // 3. Availability Score
    const availabilityScore = emp.is_available ? 100 : 20;

    // 4. Rating Score (0 - 100)
    const ratingScore = ((emp.rating || 4.5) / 5.0) * 100;

    // 5. Proximity / Priority Responsiveness
    let proximityScore = 80;
    if (priority === 'CRITICAL' && emp.is_available) {
      proximityScore = 100;
    }

    // Weighted Total Score
    const totalScore = Math.round(
      (skillScore * 0.35) +
      (workloadScore * 0.25) +
      (availabilityScore * 0.20) +
      (ratingScore * 0.10) +
      (proximityScore * 0.10)
    );

    return {
      employeeId: emp.id,
      userId: emp.user_id,
      name: user.full_name,
      jobTitle: emp.job_title || 'Operations Specialist',
      email: user.email,
      skills: emp.skills || [],
      matchScore: totalScore,
      skillMatchPct: skillScore,
      workloadPct: currentLoad,
      isAvailable: emp.is_available,
      rating: emp.rating || 4.8,
      breakdown: {
        skillScore,
        workloadScore,
        availabilityScore,
        ratingScore,
        proximityScore
      }
    };
  });

  // Sort descending by matchScore
  scoredCandidates.sort((a, b) => b.matchScore - a.matchScore);

  const best = scoredCandidates[0] || null;

  return {
    recommendedAssignee: best,
    candidates: scoredCandidates.slice(0, 5),
    algorithm: 'Multi-Factor Operations Dispatcher (Skills, Workload, Proximity)'
  };
}

module.exports = {
  findBestAssignee
};
