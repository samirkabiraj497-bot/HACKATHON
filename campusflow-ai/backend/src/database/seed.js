const bcrypt = require('bcryptjs');
const db = require('./db');

async function seedDatabase() {
  console.log('🌱 Starting comprehensive CampusFlow AI database seed...');

  const passwordHash = await bcrypt.hash('Password@123', 10);

  // 1. Roles
  const roles = [
    { id: 'student', name: 'Student', description: 'Campus student submitting and tracking operational requests' },
    { id: 'faculty', name: 'Faculty', description: 'Faculty member submitting requests and approving student workflows' },
    { id: 'staff', name: 'Operational Staff', description: 'Technician/worker executing assigned campus operational tasks' },
    { id: 'department_head', name: 'Department Head', description: 'Supervising department operations, staff allocation and escalations' },
    { id: 'admin', name: 'Campus Administrator', description: 'Full system administration, SLA policies, and cross-campus analytics' }
  ];
  await db.roles.setAll(roles);

  // 2. Departments (10 campus operational departments)
  const departments = [
    { id: 'd0000000-0000-0000-0000-000000000001', name: 'IT Support', code: 'IT', description: 'Audio-visual systems, campus Wi-Fi, computer labs, server infrastructure', email: 'it-support@campus.edu' },
    { id: 'd0000000-0000-0000-0000-000000000002', name: 'Maintenance', code: 'MAINT', description: 'HVAC systems, electrical, plumbing, civil infrastructure and carpentry', email: 'facilities@campus.edu' },
    { id: 'd0000000-0000-0000-0000-000000000003', name: 'Hostel', code: 'HOSTEL', description: 'Residential halls, room fixtures, water supply, dining and warden affairs', email: 'hostel-admin@campus.edu' },
    { id: 'd0000000-0000-0000-0000-000000000004', name: 'Academics', code: 'ACAD', description: 'Curriculum scheduling, timetable coordination, attendance regularizations', email: 'academic-dean@campus.edu' },
    { id: 'd0000000-0000-0000-0000-000000000005', name: 'Administration', code: 'ADMIN', description: 'Student certificates, fees, identity cards, admissions, clearance letters', email: 'registrar@campus.edu' },
    { id: 'd0000000-0000-0000-0000-000000000006', name: 'Examination', code: 'EXAM', description: 'Exam hall tickets, revaluation, grade sheets, invigilation coordination', email: 'coe@campus.edu' },
    { id: 'd0000000-0000-0000-0000-000000000007', name: 'Library', code: 'LIB', description: 'Central library book issues, digital research databases, reading halls', email: 'library@campus.edu' },
    { id: 'd0000000-0000-0000-0000-000000000008', name: 'Student Affairs', code: 'SA', description: 'Clubs, fests, grievance redressal, sports facilities and student council', email: 'student-affairs@campus.edu' },
    { id: 'd0000000-0000-0000-0000-000000000009', name: 'Security', code: 'SEC', description: 'Campus access control, perimeter security, CCTV, lost & found', email: 'security@campus.edu' },
    { id: 'd0000000-0000-0000-0000-000000000010', name: 'Transport', code: 'TRANS', description: 'Campus bus shuttles, student transport passes, vehicle logistics', email: 'transport@campus.edu' }
  ];
  await db.departments.setAll(departments);

  // 3. Users (Covering all roles)
  const users = [
    // Admin
    { id: 'u0000000-0000-0000-0000-000000000001', email: 'admin@campusflow.ai', password_hash: passwordHash, full_name: 'Dr. Vikram Patel', role: 'admin', phone: '+91 98765 00001', avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', status: 'active' },
    
    // Department Heads
    { id: 'u0000000-0000-0000-0000-000000000002', email: 'hod.it@campusflow.ai', password_hash: passwordHash, full_name: 'Dr. Sunita Rao', role: 'department_head', department_id: departments[0].id, phone: '+91 98765 00002', avatar_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150', status: 'active' },
    { id: 'u0000000-0000-0000-0000-000000000003', email: 'hod.maint@campusflow.ai', password_hash: passwordHash, full_name: 'Er. Rajesh Kulkarni', role: 'department_head', department_id: departments[1].id, phone: '+91 98765 00003', avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', status: 'active' },
    
    // Faculty
    { id: 'u0000000-0000-0000-0000-000000000004', email: 'faculty@campusflow.ai', password_hash: passwordHash, full_name: 'Prof. Rajesh Nair', role: 'faculty', department_id: departments[3].id, phone: '+91 98765 00004', avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', status: 'active' },
    
    // Operational Staff / Technicians (10+ Staff)
    { id: 'u0000000-0000-0000-0000-000000000010', email: 'rahul.it@campusflow.ai', password_hash: passwordHash, full_name: 'Rahul Sharma', role: 'staff', department_id: departments[0].id, phone: '+91 98765 10001', avatar_url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150', status: 'active' },
    { id: 'u0000000-0000-0000-0000-000000000011', email: 'amit.network@campusflow.ai', password_hash: passwordHash, full_name: 'Amit Verma', role: 'staff', department_id: departments[0].id, phone: '+91 98765 10002', avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150', status: 'active' },
    { id: 'u0000000-0000-0000-0000-000000000012', email: 'priya.hvac@campusflow.ai', password_hash: passwordHash, full_name: 'Priya Singh', role: 'staff', department_id: departments[1].id, phone: '+91 98765 10003', avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150', status: 'active' },
    { id: 'u0000000-0000-0000-0000-000000000013', email: 'manoj.electric@campusflow.ai', password_hash: passwordHash, full_name: 'Manoj Kumar', role: 'staff', department_id: departments[1].id, phone: '+91 98765 10004', avatar_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150', status: 'active' },
    { id: 'u0000000-0000-0000-0000-000000000014', email: 'dinesh.plumber@campusflow.ai', password_hash: passwordHash, full_name: 'Dinesh Yadav', role: 'staff', department_id: departments[1].id, phone: '+91 98765 10005', avatar_url: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150', status: 'active' },
    { id: 'u0000000-0000-0000-0000-000000000015', email: 'suresh.hostel@campusflow.ai', password_hash: passwordHash, full_name: 'Suresh Menon', role: 'staff', department_id: departments[2].id, phone: '+91 98765 10006', avatar_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150', status: 'active' },
    { id: 'u0000000-0000-0000-0000-000000000016', email: 'kavita.acad@campusflow.ai', password_hash: passwordHash, full_name: 'Kavita Joshi', role: 'staff', department_id: departments[3].id, phone: '+91 98765 10007', avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150', status: 'active' },
    { id: 'u0000000-0000-0000-0000-000000000017', email: 'anil.admin@campusflow.ai', password_hash: passwordHash, full_name: 'Anil Saxena', role: 'staff', department_id: departments[4].id, phone: '+91 98765 10008', avatar_url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150', status: 'active' },
    { id: 'u0000000-0000-0000-0000-000000000018', email: 'neha.lib@campusflow.ai', password_hash: passwordHash, full_name: 'Neha Roy', role: 'staff', department_id: departments[6].id, phone: '+91 98765 10009', avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', status: 'active' },
    { id: 'u0000000-0000-0000-0000-000000000019', email: 'harish.sec@campusflow.ai', password_hash: passwordHash, full_name: 'Harish Chandra', role: 'staff', department_id: departments[8].id, phone: '+91 98765 10010', avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', status: 'active' },

    // Students
    { id: 'u0000000-0000-0000-0000-000000000020', email: 'student@campusflow.ai', password_hash: passwordHash, full_name: 'Aarav Mehta', role: 'student', phone: '+91 98765 20001', avatar_url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150', status: 'active' },
    { id: 'u0000000-0000-0000-0000-000000000021', email: 'ananya.sen@campusflow.ai', password_hash: passwordHash, full_name: 'Ananya Sen', role: 'student', phone: '+91 98765 20002', avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', status: 'active' },
    { id: 'u0000000-0000-0000-0000-000000000022', email: 'rohan.deshmukh@campusflow.ai', password_hash: passwordHash, full_name: 'Rohan Deshmukh', role: 'student', phone: '+91 98765 20003', avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', status: 'active' }
  ];
  await db.users.setAll(users);

  // Update Dept Head IDs
  departments[0].head_id = users[1].id;
  departments[1].head_id = users[2].id;
  await db.departments.setAll(departments);

  // 4. Employees (With Skill Profiles & Workload Scores)
  const employees = [
    {
      id: 'e0000000-0000-0000-0000-000000000001',
      user_id: users[4].id, // Rahul Sharma
      department_id: departments[0].id,
      job_title: 'Audio/Visual Specialist',
      skills: ['projector', 'audio', 'mic', 'hdmi', 'screen', 'display', 'av', 'presentation'],
      workload_score: 42,
      is_available: true,
      rating: 4.9,
      max_concurrent_tasks: 5
    },
    {
      id: 'e0000000-0000-0000-0000-000000000002',
      user_id: users[5].id, // Amit Verma
      department_id: departments[0].id,
      job_title: 'Senior Network Engineer',
      skills: ['wifi', 'network', 'router', 'switch', 'firewall', 'lan', 'internet'],
      workload_score: 65,
      is_available: true,
      rating: 4.8,
      max_concurrent_tasks: 5
    },
    {
      id: 'e0000000-0000-0000-0000-000000000003',
      user_id: users[6].id, // Priya Singh
      department_id: departments[1].id,
      job_title: 'Senior HVAC & Refrigeration Technician',
      skills: ['ac', 'air conditioner', 'cooling', 'chiller', 'compressor', 'ventilation', 'thermostat'],
      workload_score: 55,
      is_available: true,
      rating: 4.9,
      max_concurrent_tasks: 6
    },
    {
      id: 'e0000000-0000-0000-0000-000000000004',
      user_id: users[7].id, // Manoj Kumar
      department_id: departments[1].id,
      job_title: 'Lead Electrician',
      skills: ['electricity', 'wiring', 'socket', 'switch', 'generator', 'ups', 'lighting', 'power'],
      workload_score: 70,
      is_available: true,
      rating: 4.7,
      max_concurrent_tasks: 5
    },
    {
      id: 'e0000000-0000-0000-0000-000000000005',
      user_id: users[8].id, // Dinesh Yadav
      department_id: departments[1].id,
      job_title: 'Master Plumber & Pipefitter',
      skills: ['plumbing', 'pipe', 'leak', 'drain', 'water tank', 'pump', 'flush', 'toilet'],
      workload_score: 85,
      is_available: false,
      rating: 4.6,
      max_concurrent_tasks: 5
    },
    {
      id: 'e0000000-0000-0000-0000-000000000006',
      user_id: users[9].id, // Suresh Menon
      department_id: departments[2].id,
      job_title: 'Hostel Maintenance Supervisor',
      skills: ['hostel', 'room maintenance', 'furniture', 'almirah', 'geyser', 'dormitory'],
      workload_score: 60,
      is_available: true,
      rating: 4.5,
      max_concurrent_tasks: 8
    },
    {
      id: 'e0000000-0000-0000-0000-000000000007',
      user_id: users[10].id, // Kavita Joshi
      department_id: departments[3].id,
      job_title: 'Academic Coordinator',
      skills: ['attendance', 'timetable', 'curriculum', 'advisor approval', 'leaves'],
      workload_score: 30,
      is_available: true,
      rating: 4.8,
      max_concurrent_tasks: 10
    },
    {
      id: 'e0000000-0000-0000-0000-000000000008',
      user_id: users[11].id, // Anil Saxena
      department_id: departments[4].id,
      job_title: 'Administrative Officer',
      skills: ['bonafide', 'certificate', 'fees', 'scholarship', 'clearance', 'id card'],
      workload_score: 45,
      is_available: true,
      rating: 4.7,
      max_concurrent_tasks: 10
    },
    {
      id: 'e0000000-0000-0000-0000-000000000009',
      user_id: users[12].id, // Neha Roy
      department_id: departments[6].id,
      job_title: 'Librarian & Cataloguer',
      skills: ['library', 'books', 'journals', 'digital archive', 'fine waiver'],
      workload_score: 25,
      is_available: true,
      rating: 4.9,
      max_concurrent_tasks: 12
    },
    {
      id: 'e0000000-0000-0000-0000-000000000010',
      user_id: users[13].id, // Harish Chandra
      department_id: departments[8].id,
      job_title: 'Security Watch Officer',
      skills: ['security', 'cctv', 'parking', 'lost and found', 'gate pass'],
      workload_score: 35,
      is_available: true,
      rating: 4.6,
      max_concurrent_tasks: 6
    }
  ];
  await db.employees.setAll(employees);

  // 5. SLA Rules (Configurable, Section 22)
  const slaRules = [
    { id: 's0000000-0000-0000-0000-000000000001', priority: 'CRITICAL', response_time_minutes: 30, resolution_time_minutes: 120, warning_threshold_pct: 80, escalation_level_1_minutes: 30, escalation_level_2_minutes: 60, is_active: true },
    { id: 's0000000-0000-0000-0000-000000000002', priority: 'HIGH', response_time_minutes: 120, resolution_time_minutes: 480, warning_threshold_pct: 80, escalation_level_1_minutes: 60, escalation_level_2_minutes: 180, is_active: true },
    { id: 's0000000-0000-0000-0000-000000000003', priority: 'MEDIUM', response_time_minutes: 480, resolution_time_minutes: 1440, warning_threshold_pct: 80, escalation_level_1_minutes: 240, escalation_level_2_minutes: 720, is_active: true },
    { id: 's0000000-0000-0000-0000-000000000004', priority: 'LOW', response_time_minutes: 1440, resolution_time_minutes: 4320, warning_threshold_pct: 80, escalation_level_1_minutes: 720, escalation_level_2_minutes: 1440, is_active: true }
  ];
  await db.slaRules.setAll(slaRules);

  // 6. Seed Requests (55+ realistic operational requests across departments & states)
  const requests = [];
  const studentUser = users[14]; // Aarav Mehta

  // Scenario 1: The flagship Projector in B204 (Section 5 & 45)
  requests.push({
    id: 'r0000000-0000-0000-0000-000000000001',
    request_number: 'REQ-1042',
    title: 'Projector in classroom B204 is not working and we have an important presentation tomorrow morning',
    description: 'The projector in classroom B204 isn\'t turning on and emits a red lamp error. We have our final semester capstone presentation tomorrow at 9:00 AM.',
    raw_description: 'The projector in classroom B204 isn\'t working and we have an important presentation tomorrow morning.',
    category_name: 'IT & Digital Infrastructure',
    subcategory: 'Audio/Visual',
    department_id: departments[0].id,
    department_name: 'IT Support',
    priority: 'HIGH',
    status: 'ASSIGNED',
    submitted_by: studentUser.id,
    assigned_to: employees[0].id, // Rahul Sharma
    location: 'Classroom B204',
    deadline: new Date(Date.now() + 20 * 3600 * 1000).toISOString(),
    sla_deadline: new Date(Date.now() + 6 * 3600 * 1000).toISOString(),
    sla_status: 'on_track',
    ai_confidence: 0.96,
    ai_summary: 'Ceiling projector lamp failure in B204 impacting upcoming capstone presentation deadline.',
    entities: { location: 'Classroom B204', equipment: 'projector', deadline: 'tomorrow morning' },
    is_duplicate: false,
    created_at: new Date(Date.now() - 35 * 60 * 1000).toISOString()
  });

  // Scenario 2: Duplicate cluster for Lab 3 AC leak (8 requests, Section 24 & 45)
  const masterIncidentId = 'inc0000-0000-0000-0000-000000000001';
  await db.incidents.setAll([
    {
      id: masterIncidentId,
      title: 'Master Incident: AC Breakdown & Water Leakage in Lab 3',
      category: 'Facilities & Infrastructure',
      location: 'Lab 3',
      status: 'INVESTIGATING',
      root_cause: 'Chilled water pipe insulation condensation leak causing electrical trip on Unit 2',
      merged_request_count: 8,
      primary_request_id: 'r0000000-0000-0000-0000-000000000010',
      created_at: new Date(Date.now() - 2 * 3600 * 1000).toISOString()
    }
  ]);

  const duplicateTexts = [
    { reqNum: 'REQ-1050', text: 'The AC in Lab 3 has been leaking for two days and students cannot use the room.', isMaster: true },
    { reqNum: 'REQ-1051', text: 'Lab 3 AC is broken and dripping water onto desk 4.', isMaster: false },
    { reqNum: 'REQ-1052', text: 'AC problem in Lab 3, room is completely warm and damp.', isMaster: false },
    { reqNum: 'REQ-1053', text: 'Water dripping from ceiling air conditioner in Lab 3.', isMaster: false },
    { reqNum: 'REQ-1054', text: 'Air conditioning not working in Lab 3, please fix immediately.', isMaster: false },
    { reqNum: 'REQ-1055', text: 'Lab 3 AC leaking puddles near server rack.', isMaster: false },
    { reqNum: 'REQ-1056', text: 'Cannot conduct practical in Lab 3 because AC is shut down.', isMaster: false },
    { reqNum: 'REQ-1057', text: 'Heavy water condensation leak from AC Unit 2 in Lab 3.', isMaster: false }
  ];

  duplicateTexts.forEach((d, idx) => {
    requests.push({
      id: `r0000000-0000-0000-0000-00000000001${idx}`,
      request_number: d.reqNum,
      title: d.text,
      description: d.text,
      raw_description: d.text,
      category_name: 'Facilities & Infrastructure',
      subcategory: 'HVAC / Cooling',
      department_id: departments[1].id,
      department_name: 'Maintenance',
      priority: 'CRITICAL',
      status: d.isMaster ? 'IN_PROGRESS' : 'MERGED',
      submitted_by: users[14 + (idx % 3)].id,
      assigned_to: employees[2].id, // Priya Singh
      location: 'Lab 3',
      sla_deadline: new Date(Date.now() + 1.5 * 3600 * 1000).toISOString(),
      sla_status: 'on_track',
      ai_confidence: 0.97,
      ai_summary: 'Persistent AC condensation leakage causing lab room closure and equipment hazard.',
      entities: { location: 'Lab 3', equipment: 'ac' },
      master_incident_id: masterIncidentId,
      is_duplicate: !d.isMaster,
      created_at: new Date(Date.now() - (120 - idx * 10) * 60 * 1000).toISOString()
    });
  });

  // Scenario 3: SLA Escalated Ticket (Section 23 & 45)
  requests.push({
    id: 'r0000000-0000-0000-0000-000000000020',
    request_number: 'REQ-1015',
    title: 'Wi-Fi gateway crash affecting entire Hostel Block B (3rd floor)',
    description: 'The access point AP-B301 rebooted multiple times and has been completely unresponsive for over 3 hours during evening study period.',
    raw_description: 'Hostel Block B 3rd floor internet is totally down.',
    category_name: 'IT & Digital Infrastructure',
    subcategory: 'Network & Connectivity',
    department_id: departments[0].id,
    department_name: 'IT Support',
    priority: 'HIGH',
    status: 'ESCALATED',
    submitted_by: users[15].id,
    assigned_to: employees[1].id,
    location: 'Hostel Block B',
    sla_deadline: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // Breached!
    sla_status: 'breached',
    ai_confidence: 0.95,
    ai_summary: 'Hostel network blackout exceeding SLA threshold. Autonomously escalated to Dr. Sunita Rao (HOD IT).',
    entities: { location: 'Hostel Block B', equipment: 'wifi' },
    is_duplicate: false,
    created_at: new Date(Date.now() - 5 * 3600 * 1000).toISOString()
  });

  // 45 additional realistic operational requests (Total 55+)
  const sampleScenarios = [
    { title: 'Broken water tap flooding 2nd floor restroom', loc: 'Restroom 2F Main Block', deptIdx: 1, prio: 'CRITICAL', cat: 'Facilities & Infrastructure', sub: 'Plumbing & Water', status: 'IN_PROGRESS' },
    { title: 'Fluorescent tube flickering violently in Room 302', loc: 'Room 302', deptIdx: 1, prio: 'MEDIUM', cat: 'Facilities & Infrastructure', sub: 'Electrical', status: 'RESOLVED' },
    { title: 'Request for Bonafide Certificate for passport application', loc: 'Admin Counter', deptIdx: 4, prio: 'LOW', cat: 'Administrative Services', sub: 'Certificates & Bonafide', status: 'RESOLVED' },
    { title: 'Attendance discrepancy in Operating Systems (CS401)', loc: 'CS Dept', deptIdx: 3, prio: 'MEDIUM', cat: 'Academic Operations', sub: 'Attendance Regularization', status: 'ASSIGNED' },
    { title: 'Library fine dispute due to medical leave during book return', loc: 'Central Library', deptIdx: 6, prio: 'LOW', cat: 'Library Services', sub: 'Fine Inquiries', status: 'RESOLVED' },
    { title: 'Damaged wooden study bench in Seminar Hall A', loc: 'Seminar Hall A', deptIdx: 1, prio: 'LOW', cat: 'Facilities & Infrastructure', sub: 'Civil & Carpentry', status: 'RESOLVED' },
    { title: 'Broken geyser in Hostel Room 114 dispensing freezing water', loc: 'Hostel Block A', deptIdx: 2, prio: 'HIGH', cat: 'Hostel Operations', sub: 'Hostel Amenities', status: 'IN_PROGRESS' },
    { title: 'Microphone feedback and screeching in Main Auditorium', loc: 'Auditorium', deptIdx: 0, prio: 'HIGH', cat: 'IT & Digital Infrastructure', sub: 'Audio/Visual', status: 'RESOLVED' },
    { title: 'Lost student ID card near sports ground', loc: 'Sports Complex', deptIdx: 8, prio: 'LOW', cat: 'Campus Safety & Security', sub: 'Lost & Found', status: 'RESOLVED' },
    { title: 'Campus shuttle bus #4 delayed by 45 minutes on route North', loc: 'Main Gate', deptIdx: 9, prio: 'MEDIUM', cat: 'Campus Transportation', sub: 'Bus Route Scheduling', status: 'RESOLVED' },
    { title: 'Hall ticket subject code mismatch for Advanced Algorithms', loc: 'Exam Cell', deptIdx: 5, prio: 'HIGH', cat: 'Examinations', sub: 'Hall Ticket Issues', status: 'RESOLVED' },
    { title: 'Permission for Tech Club annual hackathon venue booking', loc: 'Student Affairs Office', deptIdx: 7, prio: 'MEDIUM', cat: 'Student Welfare & Activities', sub: 'Event Approval', status: 'ASSIGNED' },
    { title: 'Mess water cooler emitting burning wire smell', loc: 'Hostel Mess', deptIdx: 2, prio: 'CRITICAL', cat: 'Hostel Operations', sub: 'Hostel Amenities', status: 'RESOLVED' },
    { title: 'CCTV camera blind spot near North Parking entrance', loc: 'North Parking', deptIdx: 8, prio: 'MEDIUM', cat: 'Campus Safety & Security', sub: 'Access Control', status: 'ASSIGNED' },
    { title: 'Lab 5 workstation #12 hard drive clicking and freezing', loc: 'Computer Lab 5', deptIdx: 0, prio: 'MEDIUM', cat: 'IT & Digital Infrastructure', sub: 'Hardware Malfunction', status: 'RESOLVED' },
    { title: 'Classroom C105 door lock jammed, students waiting outside', loc: 'Classroom C105', deptIdx: 1, prio: 'HIGH', cat: 'Facilities & Infrastructure', sub: 'Civil & Carpentry', status: 'RESOLVED' },
    { title: 'Semester fee installment payment portal deduction failed', loc: 'Accounts Branch', deptIdx: 4, prio: 'MEDIUM', cat: 'Administrative Services', sub: 'Fee & Billing', status: 'ASSIGNED' },
    { title: 'On-Duty leave approval for inter-college debate tournament', loc: 'Humanities Dept', deptIdx: 3, prio: 'MEDIUM', cat: 'Academic Operations', sub: 'Attendance Regularization', status: 'ASSIGNED' },
    { title: 'Overhead water tank overflow washing down hostel exterior', loc: 'Hostel Block C', deptIdx: 1, prio: 'HIGH', cat: 'Facilities & Infrastructure', sub: 'Plumbing & Water', status: 'RESOLVED' },
    { title: 'Request for IEEE digital library off-campus VPN credentials', loc: 'Digital Library', deptIdx: 6, prio: 'LOW', cat: 'Library Services', sub: 'Digital Resources Access', status: 'RESOLVED' }
  ];

  sampleScenarios.forEach((s, i) => {
    const isResolved = s.status === 'RESOLVED';
    requests.push({
      id: `r0000000-0000-0000-0000-00000000003${i}`,
      request_number: `REQ-${1060 + i}`,
      title: s.title,
      description: `Automated intake record for: ${s.title}. Generated under campus operations log.`,
      raw_description: s.title,
      category_name: s.cat,
      subcategory: s.sub,
      department_id: departments[s.deptIdx].id,
      department_name: departments[s.deptIdx].name,
      priority: s.prio,
      status: s.status,
      submitted_by: users[14 + (i % 3)].id,
      assigned_to: employees[i % employees.length].id,
      location: s.loc,
      sla_deadline: new Date(Date.now() + (isResolved ? -24 : 12) * 3600 * 1000).toISOString(),
      sla_status: isResolved ? 'completed' : 'on_track',
      ai_confidence: 0.92 + (i % 6) * 0.01,
      ai_summary: `AI classified under ${s.cat} - ${s.sub}. Handled via standard smart automation workflow.`,
      entities: { location: s.loc },
      is_duplicate: false,
      resolved_at: isResolved ? new Date(Date.now() - (48 - i) * 3600 * 1000).toISOString() : null,
      created_at: new Date(Date.now() - (72 - i * 2) * 3600 * 1000).toISOString()
    });
  });

  // Additional 20 historical requests to reach 55+
  for (let k = 1; k <= 20; k++) {
    requests.push({
      id: `r0000000-0000-0000-0000-00000000008${k}`,
      request_number: `REQ-${1080 + k}`,
      title: `Routine operational ticket #${k}: Facility inspection & filter cleaning`,
      description: `Scheduled operational audit for academic zone ${k}.`,
      raw_description: `Routine inspection ticket ${k}.`,
      category_name: 'Facilities & Infrastructure',
      subcategory: 'Preventive Check',
      department_id: departments[k % departments.length].id,
      department_name: departments[k % departments.length].name,
      priority: k % 4 === 0 ? 'HIGH' : 'MEDIUM',
      status: 'RESOLVED',
      submitted_by: users[14].id,
      assigned_to: employees[k % employees.length].id,
      location: `Zone ${k}`,
      sla_status: 'completed',
      ai_confidence: 0.94,
      ai_summary: 'Automated maintenance cycle completed on schedule.',
      is_duplicate: false,
      resolved_at: new Date(Date.now() - (100 - k * 3) * 3600 * 1000).toISOString(),
      created_at: new Date(Date.now() - (110 - k * 3) * 3600 * 1000).toISOString()
    });
  }

  await db.requests.setAll(requests);

  // 7. Tasks & Assignments for key requests
  const tasks = [
    {
      id: 't0000000-0000-0000-0000-000000000001',
      request_id: requests[0].id, // REQ-1042
      title: 'Inspect & Replace Projector Lamp in B204',
      description: 'Test HDMI input, check lamp runtime hours and replace with spare bulb if runtime > 2000 hours.',
      assigned_to: employees[0].id,
      status: 'IN_PROGRESS',
      priority: 'HIGH',
      sla_deadline: requests[0].sla_deadline,
      created_at: requests[0].created_at
    },
    {
      id: 't0000000-0000-0000-0000-000000000002',
      request_id: requests[1].id, // REQ-1050 (Lab 3 AC)
      title: 'Lab 3 Master HVAC Diagnostic & Condensate Drain Flush',
      description: 'Clear drain pan, inspect refrigerant pressure on Unit 2, fix insulated sleeve.',
      assigned_to: employees[2].id,
      status: 'IN_PROGRESS',
      priority: 'CRITICAL',
      sla_deadline: requests[1].sla_deadline,
      created_at: requests[1].created_at
    }
  ];
  await db.tasks.setAll(tasks);

  // 8. Workflows
  const workflows = [
    {
      id: 'w0000000-0000-0000-0000-000000000001',
      name: 'Classroom & Academic Equipment Rapid Resolution',
      description: 'Autonomous triaging, immediate technician dispatch, and 2-hour SLA tracking for teaching venues.',
      trigger_event: 'EQUIPMENT_DEFECT_REPORTED',
      is_active: true,
      definition: {
        steps: ['AI_CLASSIFY', 'ASSIGN_TECHNICIAN', 'NOTIFY_STAFF', 'MONITOR_SLA_80', 'ESCALATE_IF_BREACHED']
      }
    },
    {
      id: 'w0000000-0000-0000-0000-000000000002',
      name: 'Student Leave & On-Duty Advisor Approval Flow',
      description: 'When leave duration > 3 days, route to Faculty Advisor. If unreviewed after 24h, escalate to HOD.',
      trigger_event: 'LEAVE_REQUEST_SUBMITTED',
      is_active: true,
      definition: {
        steps: ['AI_VALIDATE', 'ADVISOR_APPROVAL', 'ATTENDANCE_UPDATE', 'STUDENT_NOTIFY']
      }
    }
  ];
  await db.workflows.setAll(workflows);

  // 9. Initial Notifications
  const notifs = [
    {
      id: 'n0000000-0000-0000-0000-000000000001',
      user_id: users[4].id, // Rahul Sharma
      title: '🎯 New Task Assigned: Projector in B204',
      message: 'AI assigned high-priority ticket REQ-1042 to you based on 96% AV skill match and current availability.',
      type: 'task_assigned',
      reference_id: requests[0].id,
      reference_type: 'request',
      is_read: false,
      created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString()
    },
    {
      id: 'n0000000-0000-0000-0000-000000000002',
      user_id: users[1].id, // Dr. Sunita Rao (HOD IT)
      title: '🚨 SLA Escalation: Hostel Block B Wi-Fi Outage',
      message: 'REQ-1015 has exceeded SLA threshold (3 hours). AI autonomously escalated this ticket to you for supervisory intervention.',
      type: 'escalation_alert',
      reference_id: requests[9].id,
      reference_type: 'request',
      is_read: false,
      created_at: new Date(Date.now() - 25 * 60 * 1000).toISOString()
    },
    {
      id: 'n0000000-0000-0000-0000-000000000003',
      user_id: users[0].id, // Admin
      title: '🔍 AI Pattern Alert: Lab 3 HVAC Anomaly',
      message: 'AI detected 8 concurrent reports for Lab 3 AC failure. Clustered into Master Incident #inc0000.',
      type: 'duplicate_detected',
      reference_id: masterIncidentId,
      reference_type: 'incident',
      is_read: false,
      created_at: new Date(Date.now() - 40 * 60 * 1000).toISOString()
    }
  ];
  await db.notifications.setAll(notifs);

  // 10. Approvals (Multi-Tier OD Pass, Auditorium, Course Substitution)
  const defaultApprovals = [
    {
      id: 'app-0000-0000-0000-000000000001',
      request_id: 'r0000000-0000-0000-0000-000000000064',
      requestNumber: 'REQ-1064',
      requestTitle: 'On-Duty (OD) Leave Approval: National Smart Automation Hackathon (4 Days)',
      departmentName: 'Academics',
      studentName: 'Aarav Mehta (CS-3rd Year)',
      reasonDetails: 'Selected as national finalist for Smart Automation Challenge. Requires attendance regularization for 4 lecture days.',
      aiPreScreen: 'AI Pre-Screen: PASS (Attendance 89% > 75% required, No pending disciplinary flags)',
      approver_id: users[3].id, // Prof. Rajesh Nair
      approver_role: 'faculty_advisor',
      approverRole: 'faculty_advisor',
      approverName: users[3].full_name,
      status: 'pending',
      created_at: new Date(Date.now() - 3600 * 1000 * 2).toISOString()
    },
    {
      id: 'app-0000-0000-0000-000000000002',
      request_id: 'r0000000-0000-0000-0000-000000000071',
      requestNumber: 'REQ-1071',
      requestTitle: 'Main Auditorium & AV System Reservation for Annual Tech Showcase',
      departmentName: 'Student Affairs',
      studentName: 'Ananya Sen (Student Council President)',
      reasonDetails: 'Booking main auditorium, 4 wireless mics, and high-lumen projector for Saturday university tech fest.',
      aiPreScreen: 'AI Pre-Screen: PASS (Auditorium calendar slot vacant, AV technician scheduled)',
      approver_id: users[1].id, // Dr. Sunita Rao
      approver_role: 'department_head',
      approverRole: 'department_head',
      approverName: users[1].full_name,
      status: 'pending',
      created_at: new Date(Date.now() - 3600 * 1000 * 5).toISOString()
    },
    {
      id: 'app-0000-0000-0000-000000000003',
      request_id: 'r0000000-0000-0000-0000-000000000078',
      requestNumber: 'REQ-1078',
      requestTitle: 'Elective Course Substitution & Lab Timetable Regularization',
      departmentName: 'Academics',
      studentName: 'Rohan Deshmukh (IT-4th Year)',
      reasonDetails: 'Timetable conflict between Advanced Distributed Systems and Honors AI Lab. Dean clearance requested.',
      aiPreScreen: 'AI Pre-Screen: PASS (Credit requirements satisfied, faculty capacity available)',
      approver_id: users[3].id, // Prof. Rajesh Nair
      approver_role: 'faculty_advisor',
      approverRole: 'faculty_advisor',
      approverName: users[3].full_name,
      status: 'pending',
      created_at: new Date(Date.now() - 3600 * 1000 * 8).toISOString()
    }
  ];
  await db.approvals.setAll(defaultApprovals);

  // 11. Audit Logs
  const auditLogs = [
    {
      id: 'a0000000-0000-0000-0000-000000000001',
      timestamp: new Date(Date.now() - 34 * 60 * 1000).toISOString(),
      actor_name: 'CampusFlow AI Agent',
      actor_type: 'AI_AGENT',
      action: 'AI_CLASSIFIED_REQUEST',
      entity_type: 'request',
      entity_id: requests[0].id,
      details: 'Classified REQ-1042 as HIGH Priority under IT Support (Audio/Visual) with 96% confidence.'
    },
    {
      id: 'a0000000-0000-0000-0000-000000000002',
      timestamp: new Date(Date.now() - 33 * 60 * 1000).toISOString(),
      actor_name: 'CampusFlow Dispatcher Engine',
      actor_type: 'AI_AGENT',
      action: 'ASSIGNED_EMPLOYEE',
      entity_type: 'request',
      entity_id: requests[0].id,
      details: 'Assigned Rahul Sharma (96% match score, 42% workload score).'
    },
    {
      id: 'a0000000-0000-0000-0000-000000000003',
      timestamp: new Date(Date.now() - 28 * 60 * 1000).toISOString(),
      actor_name: 'CampusFlow SLA Watchdog',
      actor_type: 'AI_AGENT',
      action: 'ESCALATED_SLA_BREACH',
      entity_type: 'request',
      entity_id: requests[9].id,
      details: 'REQ-1015 exceeded resolution SLA limit. Autonomously escalated to Dr. Sunita Rao.'
    },
    {
      id: 'a0000000-0000-0000-0000-000000000004',
      timestamp: new Date(Date.now() - 42 * 60 * 1000).toISOString(),
      actor_name: 'CampusFlow Cluster Engine',
      actor_type: 'AI_AGENT',
      action: 'MERGED_DUPLICATE_INCIDENTS',
      entity_type: 'incident',
      entity_id: masterIncidentId,
      details: 'Consolidated 8 concurrent student reports for Lab 3 AC breakdown into single Master Incident.'
    }
  ];
  await db.auditLogs.setAll(auditLogs);

  console.log(`✅ Seed completed successfully:
  - 10 Departments
  - 5 Roles
  - ${users.length} Users (Admin, HODs, Faculty, Technicians, Students)
  - ${employees.length} Staff specialists with skills & workloads
  - ${requests.length} Requests seeded across all categories
  - 4 SLA Rules configured
  - 2 Workflows & Master Incidents initialized`);
}

if (require.main === module) {
  seedDatabase().then(() => {
    console.log('Seed execution finished.');
    process.exit(0);
  }).catch(err => {
    console.error('Seed execution error:', err);
    process.exit(1);
  });
}

module.exports = seedDatabase;
