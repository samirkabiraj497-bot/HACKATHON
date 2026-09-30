# 🏆 SMART AUTOMATION CHALLENGE — OFFICIAL SUBMISSION

## Project Title: **CAMPUSFLOW AI — AI College Operations Agent**
### Tagline: *"Turn every campus request into an intelligent workflow."*

---

## 1. Problem Statement

Educational institutions and university campuses spend excessive administrative hours on repetitive manual operational workflows. Every week, hundreds of requests from students, faculty, and administrative staff arrive across fragmented, disconnected channels (paper complaint forms, scattered emails, WhatsApp groups, and verbal notices).

### Key Friction Points:
- **Manual Reading & Triage:** Administrative staff waste hours manually deciphering unstructured text to determine the target department and urgency.
- **Arbitrary Task Assignment:** Work is dispatched randomly or based on personal familiarity, causing severe technician overload and uneven distribution.
- **Delayed Approvals & Bottlenecks:** On-Duty (OD) passes, event bookings, and leave requests stall in advisor inboxes, leading to missed student opportunities.
- **Redundant Labor from Duplicate Reports:** When campus infrastructure fails (such as an AC unit leaking in a lab or a lecture hall projector dying), multiple students file separate tickets, leading to redundant technician dispatches.
- **Lack of Visibility & Broken SLAs:** Tickets languish without automated follow-up; escalations only happen when angry stakeholders follow up manually.

---

## 2. Solution Description

**CampusFlow AI** is not a passive ticketing system or a simple chatbot. It is a **Digital College Operations Employee** that autonomously orchestrates end-to-end operational workflows through intelligent decision-making.

### How AI is Integrated:
1. **Natural Language Understanding & Entity Extraction:** Students write complaints in plain English (e.g., *"The projector in classroom B204 isn't working and we have an important presentation tomorrow morning"*). The AI extracts the category, problem, location, equipment, deadline, and impact with confidence metrics.
2. **AI Priority Engine:** Computes an objective urgency score based on upcoming academic deadlines, life-safety hazards, and number of affected individuals (`CRITICAL`, `HIGH`, `MEDIUM`, `LOW`).
3. **Multi-Factor Dispatch Algorithm:** Evaluates candidate technicians within the responsible department using a scoring formula: **Verified Skills (35%) + Current Workload Inverse (25%) + Availability (20%) + Rating (10%) + Proximity (10%)**.
4. **Autonomous SLA Watchdog & Escalation:** Continuous background cron monitors active tickets. At **80% SLA elapsed**, it issues an automated urgency reminder; at **100% SLA breach**, it autonomously escalates the ticket to the Department Head.
5. **Semantic Duplicate Incident Clustering:** Automatically detects concurrent complaints for the same physical asset (e.g., 8 students reporting a Lab 3 AC leak) and consolidates them into a single **Master Incident** while maintaining status broadcasts to all submitters.
6. **Recurring Defect Radar:** Mines 30-day historical ticket telemetry to detect chronic equipment fatigue (e.g., *"17 AC complaints in Lab 3 in 30 days"*) and dispatches preventive maintenance work orders.
7. **Natural Language Workflow Builder ("Describe Your Automation"):** Administrators type policies in English (e.g., *"When a student submits a leave request >3 days, send to advisor; if unreviewed in 24 hours, remind advisor"*), which the AI compiles into an executable visual node flowchart.
8. **Grounded AI Copilot with Action-Based AI:** An operational decision assistant connected to live database records that answers administrative queries and proposes concrete backend actions (e.g., *"Remind all assigned technicians"*) with human-in-the-loop authorization.

---

## 3. GitHub Repository & Architecture

### Repository Structure
```text
campusflow-ai/
├── frontend/             # React 19 + Vite + Tailwind CSS + React Router v7 + Recharts + Lucide
│   ├── src/
│   │   ├── components/   # Navbar, Sidebar, LiveActivityFeed, AIUnderstandingCard, TimelineModal, DemoModal
│   │   ├── context/      # AuthContext (Role switching, JWT), NotificationContext
│   │   ├── pages/        # Dashboard, Intake, Requests, Duplicates, Recurring, Workflows, Approvals, Copilot, Reports, Analytics, Admin
│   │   ├── services/     # Axios API Client
│   │   └── index.css     # Cyber dark glassmorphism design system
│   ├── vercel.json       # Production SPA routing configuration
│   └── package.json
│
├── backend/              # Node.js + Express.js + REST Architecture + Node-Cron
│   ├── src/
│   │   ├── config/       # Supabase PostgreSQL connection
│   │   ├── controllers/  # Auth, Requests, AI, Workflows, Assignments, Approvals, Escalations, Analytics, Demo
│   │   ├── database/     # 23 Supabase tables + Resilient Zero-Downtime hybrid store + Seed script
│   │   ├── jobs/         # Scheduled Cron jobs (SLA watchdog, Anomaly sweeps, Daily reports)
│   │   ├── middleware/   # JWT authentication, RBAC authorization, Centralized error handling
│   │   ├── routes/       # REST API endpoint router
│   │   ├── services/     # AI Classifier, Priority Engine, Duplicate Detector, Recurring Radar, Copilot, Workflow Engine
│   │   ├── validators/   # Express-Validator schemas for auth, requests, and workflows
│   │   └── server.js     # Server entry point
│   ├── tests/            # Automated verification test suite (11 test suites passing)
│   ├── render.yaml       # Cloud deployment configuration
│   └── package.json
└── README.md
```

### Setup & Local Execution Steps
```bash
# 1. Clone repository
git clone https://github.com/your-username/campusflow-ai.git
cd campusflow-ai

# 2. Setup and launch Backend
cd backend
npm install
npm run seed       # Seeds 10 departments, 17 users, 50+ requests, workflows, and duplicate clusters
npm start          # Runs on http://localhost:5000
npm test           # Runs 11 automated verification tests (100% pass)

# 3. Setup and launch Frontend
cd ../frontend
npm install
npm run dev        # Runs on http://localhost:5173
```

---

## 4. Deployed Application & Cloud Setup

- **Frontend Deployment (Vercel):** Configured via [`campusflow-ai/frontend/vercel.json`](./campusflow-ai/frontend/vercel.json) with client-side SPA routing.
- **Backend Deployment (Render/Railway):** Configured via [`campusflow-ai/backend/render.yaml`](./campusflow-ai/backend/render.yaml).
- **Database:** Supabase PostgreSQL with 23 relational tables active.
- **Demo Accounts & Profiles (Instant 1-Click Role Switching):**
  - **Administrator:** `admin@campusflow.ai` / `Password@123`
  - **Department Head (IT):** `hod.it@campusflow.ai` / `Password@123`
  - **Faculty Advisor:** `faculty@campusflow.ai` / `Password@123`
  - **Staff Technician:** `rahul.it@campusflow.ai` / `Password@123`
  - **Student:** `student@campusflow.ai` / `Password@123`
  - **Guest / Public Visitor:** `guest@campus.edu` (Zero credentials needed, fresh ticket intake at `/new`)
  *(Users can also switch personas with 1 click using the role dropdown in the navigation bar!)*

---

## 5. 3–5 Minute Demo Video Script & Storyboard

### **[0:00 – 0:45] Introduction & The Problem**
- **Visual:** Landing Page (`/`) showing the headline: *"LET AI RUN YOUR COLLEGE OPERATIONS"*.
- **Narrator Script:**
  > *"Every college wastes thousands of hours manually routing student complaints, tracking lost requests, and juggling staff workloads. Traditional systems wait for a human to operate them. CampusFlow AI is an autonomous operational workforce for higher education that understands requests and orchestrates the next actions needed to resolve them."*

### **[0:45 – 1:30] AI Operations Command Center & 1-Click Judge Demo**
- **Visual:** Navigate to Dashboard (`/dashboard`). Highlight the pulsing `AI AGENT ACTIVE` badge, 87% automation rate, and live AI activity feed.
- **Action:** Click the glowing **"RUN LIVE DEMO"** button in the navbar.
- **Narrator Script:**
  > *"Here in our AI Operations Center, judges can trigger four real-world scenarios with one click. Let's run Scenario 1: A student reports a broken projector in Classroom B204 with a presentation tomorrow. Watch as the AI autonomously extracts the entities, sets priority to HIGH, determines IT Support routing, and uses multi-factor scoring to dispatch AV Specialist Rahul Sharma with an active SLA timer."*

### **[1:30 – 2:30] Smart Intake & Duplicate Clustering**
- **Visual 1:** Navigate to `/intake`. Click the *"❄️ AC Leak in Lab 3"* pill. Show the real-time **AI Understanding Preview Card** updating dynamically with confidence scores. Submit the ticket.
- **Visual 2:** Navigate to `/duplicates`.
- **Narrator Script:**
  > *"When 8 students independently report the same leaking AC in Lab 3, CampusFlow's semantic clustering engine groups them into a single Master Incident. Instead of dispatching 8 separate technicians, one consolidated work order is generated, saving hours of redundant labor while keeping all students updated."*

### **[2:30 – 3:30] Recurring Defect Radar & Autonomous Escalation**
- **Visual 1:** Navigate to `/recurring`. Show the Lab 3 card showing 17 complaints in 30 days.
- **Visual 2:** Click *"Dispatch Preventive Work Order"*.
- **Visual 3:** Navigate to `/requests`. Open ticket REQ-1015 (Hostel Wi-Fi outage) showing the SLA timer, 80% warning alert, and autonomous escalation to Department Head Dr. Sunita Rao.
- **Narrator Script:**
  > *"CampusFlow doesn't just react — it prevents failures. Our Recurring Defect Radar detected 17 complaints for Lab 3 AC in 30 days, recognizing chronic equipment fatigue and scheduling a preventive overhaul. And if any assigned technician stalls, our background SLA watchdog sends automated reminders and escalates breached tickets directly to the Department Head."*

### **[3:30 – 4:30] Natural Language Workflow Builder & AI Copilot**
- **Visual 1:** Navigate to `/workflows`. Show the *"Describe Your Automation"* box. Click *"Compile into Node Graph"* to display the visual flowchart.
- **Visual 2:** Navigate to `/copilot`. Ask: *"What are today's urgent issues?"* Show the grounded live database answer and click the action button: *"Send SLA Reminders"*.
- **Narrator Script:**
  > *"Administrators can type policies in plain English, and CampusFlow compiles them into visual, executable workflow graphs. Furthermore, our Grounded Copilot allows leadership to query real-time campus metrics and dispatch corrective actions with human-in-the-loop authorization."*

### **[4:30 – 5:00] Conclusion & Measurable Impact**
- **Visual:** Navigate to `/analytics`. Show the **"Before vs After AI"** comparison matrix and the KPI summary: **87% Automation Rate**, **83% Processing Time Saved**, **38.5 Hours Conserved**.
- **Narrator Script:**
  > *"CampusFlow AI delivers measurable operational transformation: from 18 minutes of manual administrative friction down to 2.4 seconds of autonomous intelligence. Turn every campus request into an intelligent workflow. Thank you!"*
