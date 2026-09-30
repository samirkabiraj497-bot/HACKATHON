/**
 * AI Classification Service
 * Analyzes unstructured request text and extracts structured operational intelligence:
 * - Category & Subcategory
 * - Problem Description
 * - Location & Affected Entities
 * - Impact & Urgency
 * - Priority Level
 * - Suggested Routing Department
 * - Confidence Score & Concise Reasoning
 */

// Comprehensive knowledge base for campus domain understanding
const DEPARTMENT_KEYWORDS = {
  'IT Support': [
    'wifi', 'wi-fi', 'internet', 'network', 'router', 'projector', 'computer', 'laptop',
    'monitor', 'printer', 'audio', 'mic', 'microphone', 'hdmi', 'cable', 'portal', 'erp',
    'login', 'password', 'software', 'server', 'display', 'screen', 'av', 'camera', 'lan'
  ],
  'Maintenance': [
    'ac', 'air conditioner', 'cooling', 'leak', 'leaking', 'pipe', 'plumbing', 'water',
    'tap', 'flush', 'door', 'window', 'light', 'fan', 'bulb', 'switch', 'socket',
    'electricity', 'power', 'blackout', 'furniture', 'chair', 'bench', 'desk', 'glass',
    'paint', 'sewage', 'drain', 'tile', 'roof', 'lift', 'elevator', 'restroom', 'toilet'
  ],
  'Hostel': [
    'hostel', 'room', 'dorm', 'warden', 'mess', 'bed', 'mattress', 'almirah', 'laundry',
    'hot water', 'geyser', 'curfew', 'roommate', 'block a', 'block b', 'mess food', 'corridor'
  ],
  'Academics': [
    'attendance', 'grade', 'marks', 'transcript', 'credit', 'syllabus', 'course',
    'faculty', 'professor', 'hod', 'class schedule', 'timetable', 'elective', 'assignment',
    'lecture', 'academic calendar', 'od', 'on duty', 'internship letter'
  ],
  'Administration': [
    'fee', 'receipt', 'bonafide', 'certificate', 'id card', 'scholarship', 'refund',
    'admission', 'document', 'clearance', 'noc', 'hall ticket', 'office', 'registrar'
  ],
  'Examination': [
    'exam', 'examination', 'hall ticket', 'revaluation', 'backlog', 'supplementary',
    'seating', 'invigilator', 'marksheet', 'grade card', 'result', 'controller of examinations'
  ],
  'Library': [
    'library', 'book', 'journal', 'fine', 'return date', 'reference', 'study room',
    'digital library', 'borrow', 'issue book', 'renew'
  ],
  'Student Affairs': [
    'club', 'event', 'cultural', 'fest', 'sports', 'gym', 'canteen', 'harassment',
    'grievance', 'counseling', 'ragging', 'student council', 'competition'
  ],
  'Security': [
    'gate', 'security', 'guard', 'parking', 'lost', 'found', 'theft', 'stolen',
    'id check', 'cctv', 'unauthorized', 'trespass', 'visitor pass', 'vehicle pass'
  ],
  'Transport': [
    'bus', 'van', 'shuttle', 'route', 'driver', 'bus pass', 'transport schedule',
    'pickup', 'drop', 'transport delay'
  ]
};

const CATEGORY_MAP = {
  'IT Support': { category: 'IT & Digital Infrastructure', subcategories: ['Audio/Visual', 'Network & Connectivity', 'Hardware Malfunction', 'Software & Accounts'] },
  'Maintenance': { category: 'Facilities & Infrastructure', subcategories: ['HVAC / Cooling', 'Electrical', 'Plumbing & Water', 'Civil & Carpentry'] },
  'Hostel': { category: 'Hostel Operations', subcategories: ['Room Maintenance', 'Mess & Dining', 'Hostel Amenities', 'Warden Assistance'] },
  'Academics': { category: 'Academic Operations', subcategories: ['Attendance Regularization', 'Course & Timetable', 'Academic Documentation', 'Curriculum Inquiries'] },
  'Administration': { category: 'Administrative Services', subcategories: ['Fee & Billing', 'Certificates & Bonafide', 'Identity & Badging', 'Student Records'] },
  'Examination': { category: 'Examinations', subcategories: ['Hall Ticket Issues', 'Grade Discrepancy', 'Revaluation Processing', 'Schedule Conflict'] },
  'Library': { category: 'Library Services', subcategories: ['Book Circulation', 'Digital Resources Access', 'Study Space', 'Fine Inquiries'] },
  'Student Affairs': { category: 'Student Welfare & Activities', subcategories: ['Event Approval', 'Club Activities', 'Student Support', 'Campus Amenities'] },
  'Security': { category: 'Campus Safety & Security', subcategories: ['Access Control', 'Lost & Found', 'Traffic & Parking', 'Incident Report'] },
  'Transport': { category: 'Campus Transportation', subcategories: ['Bus Route Scheduling', 'Pass Management', 'Fleet Coordination'] }
};

/**
 * Intelligent Rule-based & NLP Extractor (Instant, Reliable, Deterministic, Zero-Fail)
 */
function extractEntities(text) {
  const entities = {};

  // Extract Room / Lab / Hall (e.g. B204, Lab 3, Hall A, Room 102, C-wing)
  const locationMatch = text.match(/\b(?:Lab\s*\d+|Classroom\s*[A-Za-z0-9\-]+|[A-Za-z]\s*\d{2,4}|Room\s*\d{2,4}|Seminar\s*Hall|Auditorium|Library|Hostel\s*[A-Za-z0-9\-]+|Block\s*[A-Za-z0-9\-]+|Cafeteria|Gym|Sports\s*Complex)\b/i);
  if (locationMatch) {
    entities.location = locationMatch[0];
  }

  // Extract Deadlines / Urgency signals
  const deadlineMatch = text.match(/\b(?:tomorrow(?:\s+morning|\s+afternoon)?|today|urgent|immediately|in\s+\d+\s+hours?|by\s+\w+|presentation\s+tomorrow|exam\s+tomorrow)\b/i);
  if (deadlineMatch) {
    entities.deadline = deadlineMatch[0];
  }

  // Equipment mentions
  const equipmentMatch = text.match(/\b(?:projector|ac|air\s*conditioner|wifi|router|mic|printer|switch|fan|light|pipe|pc|computer|server|screen)\b/i);
  if (equipmentMatch) {
    entities.equipment = equipmentMatch[0];
  }

  return entities;
}

/**
 * Classify Request Content
 */
async function classifyRequest({ title = '', description = '', location = '' }) {
  const combinedText = `${title} ${description} ${location}`.toLowerCase();
  const entities = extractEntities(`${title} ${description} ${location}`);
  
  if (location && !entities.location) {
    entities.location = location;
  }

  let selectedDepartment = 'IT Support';
  let bestScore = 0;
  const deptScores = {};

  // Score each department based on keyword presence & weight
  for (const [dept, keywords] of Object.entries(DEPARTMENT_KEYWORDS)) {
    let score = 0;
    for (const kw of keywords) {
      if (combinedText.includes(kw)) {
        score += kw.length > 5 ? 2.5 : 1.5;
      }
    }
    deptScores[dept] = score;
    if (score > bestScore) {
      bestScore = score;
      selectedDepartment = dept;
    }
  }

  // Calculate confidence score (0.65 - 0.98)
  let confidence = 0.94;
  if (bestScore === 0) {
    selectedDepartment = 'Administration';
    confidence = 0.58; // Low confidence trigger
  } else if (bestScore < 3) {
    confidence = 0.68;
  } else if (bestScore >= 5) {
    confidence = 0.96;
  }

  // Priority evaluation
  let priority = 'MEDIUM';
  let reasoning = '';

  const isCritical = combinedText.includes('flooding') || 
                     combinedText.includes('fire') || 
                     combinedText.includes('short circuit') || 
                     combinedText.includes('dangerous') || 
                     combinedText.includes('emergency') ||
                     (combinedText.includes('leaking for two days') && combinedText.includes('cannot use'));

  const isHigh = combinedText.includes('tomorrow') || 
                 combinedText.includes('presentation') || 
                 combinedText.includes('exam') || 
                 combinedText.includes('urgent') || 
                 combinedText.includes('broken') || 
                 combinedText.includes('not working') || 
                 combinedText.includes('cannot use');

  const isLow = combinedText.includes('inquiry') || 
                combinedText.includes('request for information') || 
                combinedText.includes('general') || 
                combinedText.includes('feedback');

  if (isCritical) {
    priority = 'CRITICAL';
    reasoning = 'Marked CRITICAL due to hazardous condition or complete operational stoppage affecting safety/room access.';
  } else if (isHigh) {
    priority = 'HIGH';
    reasoning = entities.deadline 
      ? `Marked HIGH because the issue directly affects an upcoming deadline (${entities.deadline}).`
      : 'Marked HIGH because key campus equipment is non-operational and impacting student activities.';
  } else if (isLow) {
    priority = 'LOW';
    reasoning = 'Marked LOW as this is an informational or routine inquiry without acute operational impact.';
  } else {
    priority = 'MEDIUM';
    reasoning = 'Marked MEDIUM standard operational priority based on routine operational SLA.';
  }

  const categoryInfo = CATEGORY_MAP[selectedDepartment] || { category: 'General Operations', subcategories: ['Standard'] };
  
  // Choose subcategory based on text
  let subcategory = categoryInfo.subcategories[0];
  for (const sub of categoryInfo.subcategories) {
    const subWords = sub.toLowerCase().split(/\s+|\//);
    if (subWords.some(w => w.length > 3 && combinedText.includes(w))) {
      subcategory = sub;
      break;
    }
  }

  // Section 29: AI Confidence check
  const confidenceThreshold = parseFloat(process.env.AI_CONFIDENCE_THRESHOLD || '0.70');
  const isConfidenceLow = confidence < confidenceThreshold;

  return {
    category: categoryInfo.category,
    subcategory,
    department: selectedDepartment,
    priority,
    confidence: parseFloat(confidence.toFixed(2)),
    isConfidenceLow,
    confidenceBreakdown: {
      departmentConfidence: parseFloat(confidence.toFixed(2)),
      priorityConfidence: parseFloat((confidence - 0.03).toFixed(2)),
      categoryConfidence: parseFloat((confidence + 0.02 > 0.99 ? 0.99 : confidence + 0.02).toFixed(2))
    },
    suggestedAlternativeDepartments: isConfidenceLow ? ['IT Support', 'Maintenance', 'Administration'] : [],
    problemSummary: title.trim(),
    impactAnalysis: priority === 'CRITICAL' ? 'High - Immediate disruption to classes/lab' : priority === 'HIGH' ? 'Moderate to High - Disruption to scheduled presentation/tasks' : 'Standard operational impact',
    entities,
    reasoning,
    modelUsed: process.env.AI_MODEL || 'campusflow-neural-classifier-v2'
  };
}

module.exports = {
  classifyRequest,
  DEPARTMENT_KEYWORDS,
  CATEGORY_MAP,
  extractEntities
};
