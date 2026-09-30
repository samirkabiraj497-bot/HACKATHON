# 🎓 CAMPUSFLOW AI — AI College Operations Agent

> **"Turn every campus request into an intelligent workflow."**
> 
> *A Next-Generation Autonomous Operational Workforce for Higher Education Institutions.*
> Developed for the **Smart Automation Challenge**.

---

## 🏆 Competition Theme: Smart Automation

Colleges and universities handle thousands of operational requests weekly across facilities, IT, hostels, academics, examinations, and administration. Today, these rely on fragmented emails, paper forms, and WhatsApp groups. Human administrative staff must manually read, triage, assign, follow up, and chase every ticket.

**The result:**
- Multi-day delays and lost requests
- Human error and arbitrary task assignments
- Uneven technician overload and staff burnout
- Complete absence of real-time operational visibility
- High overhead costs

### Traditional System vs. CampusFlow AI

| Traditional Campus Workflow | CampusFlow AI Agent Pipeline |
| :--- | :--- |
| **Manual Request:** Student submits email/paper form | **Natural Language Intake:** Multi-entity extraction in real time |
| **Manual Reading:** 4 to 8 hours reading backlog | **Instant AI Triage:** Sub-second classification & priority scoring |
| **Arbitrary Assignment:** Random staff dispatching | **Multi-Factor Dispatch:** Matches skills (96%), workload & proximity |
| **Manual Follow-up:** Lost tickets & angry phone calls | **Autonomous SLA Watchdog:** 80% warning triggers & HOD escalation |
| **Duplicate Labor:** 8 students report same AC leak separately | **Semantic Clustering:** Collapses 8 reports into 1 Master Incident |
| **Spreadsheets:** End-of-month manual report compilation | **Daily Synthesis:** Autonomous AI executive reports & recurring defect radar |

---

## 🌟 Core Innovation Statement

> **CampusFlow AI doesn't just digitize college workflows. It understands requests and autonomously orchestrates the next actions required to resolve them.**
> 
> Traditional software waits for a human to operate it. **CampusFlow AI operates the workflow.**

```text
                                 CAMPUSFLOW AI
                                      │
                                      ▼
                               STUDENT / FACULTY
                                      │
                                      ▼
                               REQUEST SUBMITTED
                        ("The projector in B204 is broken
                        and we have a presentation tomorrow")
                                      │
                                      ▼
                                 🤖 AI AGENT
                                      │
                   ┌──────────────────┼──────────────────┐
                   ▼                  ▼                  ▼
               CLASSIFY           PRIORITIZE          EXTRACT
             (IT Support)           (HIGH)         (Room B204, AV)
                   │                  │                  │
                   └──────────────────┼──────────────────┘
                                      ▼
                                MAKE DECISION
                                      │
                                      ▼
                               START WORKFLOW
                                      │
                                      ▼
                                    ASSIGN
                           (Rahul Sharma - 96% Match,
                              42% Current Workload)
                                      │
                                      ▼
                                    NOTIFY
                            (Mobile Push to Tech,
                            Confirmation to Student)
                                      │
                                      ▼
                                 SLA MONITOR
                               (8-Hour Window)
                                      │
                         ┌────────────┴────────────┐
                         ▼                         ▼
                      RESOLVED                  DELAY / RISK
                         │                         │
                         │                     80% REMINDER
                         │                         │
                         │                   AUTO-ESCALATE
                         │                  (Department Head)
                         │                         │
                         └────────────┬────────────┘
                                      ▼
                                   RESOLVE
                                      │
                                      ▼
                               GENERATE REPORT
                                      │
                                      ▼
                          AI RECURRING DEFECT RADAR
                         (17 AC complaints in Lab 3 ->
                         Dispatches Preventive Work Order)
```

---

## 🚀 Key Features

### 1. 🧠 Intelligent Natural Language Request Intake
- Unstructured natural language processing — students describe issues in plain English.
- Real-time live intent extraction preview card (`Category`, `Problem`, `Location`, `Impact`, `Priority`, `Suggested Department`, `Confidence Score`).
- **AI Confidence Thresholding (Section 29):** If confidence drops below 70%, the system flags `AI CONFIDENCE LOW` and prompts human-in-the-loop review.

### 2. 🎯 Multi-Factor Technician Assignment Engine (Section 17)
- Replaces arbitrary manual dispatch with a deterministic scoring algorithm:
  $$\text{Score} = (\text{Skill Match} \times 0.35) + (\text{Workload Inverse} \times 0.25) + (\text{Availability} \times 0.20) + (\text{Rating} \times 0.10) + (\text{Proximity} \times 0.10)$$
- Real-world example: **Rahul Sharma** (Audio/Visual Specialist, 96% match, 42% workload score, Available -> Assigned).

### 3. 🛡️ Autonomous SLA Watchdog & Progressive Escalation (Sections 22 & 23)
- Configurable SLA policies (`CRITICAL`: 30m response / 2h resolution; `HIGH`: 2h / 8h; `MEDIUM`: 8h / 24h; `LOW`: 24h / 72h).
- Automated background evaluation sweeps:
  - **80% SLA Consumed:** Dispatches urgency warning alert to technician.
  - **100% SLA Breached:** Automatically escalates ticket status to `ESCALATED` and alerts Department Head.
  - **Extended Inaction (>120m):** Escalates directly to Campus Administrator.

### 4. 🧩 Duplicate Incident Clustering & Suppression (Section 24)
- Identifies concurrent reports of identical physical campus failures (e.g. 8 students reporting "Lab 3 AC leak").
- Clustered via token Jaccard similarity and location matching.
- **1-Click Master Incident Consolidation:** Consolidates 8 redundant tickets into 1 single maintenance task while maintaining real-time status broadcasts to all 8 submitters.

### 5. 📡 Recurring Defect Radar & Asset Fatigue Analysis (Section 25)
- Cross-correlates 30-day historical ticket telemetry.
- Flags chronically failing hardware (e.g. *"Lab 3 has logged 17 AC complaints in 30 days"*).
- Generates preventive maintenance work orders before catastrophic room closures happen.

### 6. ✍️ Natural Language Workflow Builder ("Describe Your Automation", Section 19)
- Administrators type operational rules in natural language:
  > *"When a student submits a leave request longer than three days, send it to the faculty advisor. If approved, notify the student and update attendance. If unreviewed after 24 hours, remind the advisor."*
- AI compiles the text into an executable node-based workflow graph:
  `TRIGGER` → `AI CLASSIFICATION` → `CONDITION` → `APPROVAL` → `ASSIGN` → `NOTIFICATION` → `WAIT` → `ESCALATE` → `END`.

### 7. 🤖 Grounded AI Operations Copilot (Sections 26 & 27)
- Conversational command assistant connected directly to live PostgreSQL database records.
- Answers executive queries: *"What are today's urgent issues?"*, *"Which department has the highest backlog?"*, *"Which tasks are close to SLA breach?"*
- **Action-Based AI:** Proposes and executes concrete mutations with human confirmation: *"Remind all assigned technicians"*, *"Schedule preventive overhaul"*.

### 8. 📊 Daily AI Operations Report & Analytics (Sections 32 & 33)
- Executive daily briefing with KPIs, AI observations, bottleneck alerts, and actionable recommendations.
- Print/PDF export and clipboard copy.
- Real-time automation metrics: **87% Automated**, **83% Time Saved**, **38.5 Hours Conserved**, **18 Duplicates Merged**.

### 9. 🚀 1-Click Interactive Judge Demo Mode (Section 45)
- Interactive modal demonstrating the 4 core competition scenarios in real time with step-by-step visual playback and confetti celebration!
  - **Scenario 1:** Projector broken in Classroom B204 with presentation tomorrow.
  - **Scenario 2:** 8 duplicate complaints for Lab 3 AC consolidated into 1 Master Incident.
  - **Scenario 3:** Technician inactivity -> SLA warning -> Automatic escalation to HOD.
  - **Scenario 4:** Admin asks Copilot for campus bottlenecks & generates live daily report.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, Vite, Tailwind CSS, React Router v7, Lucide React, Recharts, Axios, Canvas-Confetti |
| **Backend** | Node.js (v24), Express.js, MVC Architecture, Service Layer, Middleware, Node-Cron |
| **Database** | Supabase PostgreSQL + Resilient Hybrid Zero-Downtime Cache Layer |
| **Authentication** | JSON Web Tokens (JWT), bcrypt password hashing, Role-Based Access Control (RBAC) |
| **AI Engine** | CampusFlow Neural Operational Engine + Extensible Gemini / OpenAI / Anthropic Provider API |

---

## 📂 Project Structure

```text
campusflow-ai/
├── backend/
│   ├── src/
│   │   ├── config/              # Supabase & environment configuration
│   │   ├── controllers/         # REST Controllers (Auth, Requests, AI, Workflows, etc.)
│   │   ├── database/            # Hybrid DB layer, JSON store & Seed script
│   │   ├── jobs/                # Node-cron background schedulers (SLA watchdog, Anomaly sweeps)
│   │   ├── middleware/          # JWT Auth, RBAC authorization, Centralized error handler
│   │   ├── routes/              # Express API route declarations
│   │   ├── services/
│   │   │   ├── ai/              # Classification, Priority engine, Duplicate detector, Recurring radar, Copilot
│   │   │   ├── assignment/      # Multi-factor intelligent staff dispatcher
│   │   │   ├── workflow/        # Natural language workflow compiler & runner
│   │   │   ├── escalation/      # SLA monitoring & autonomous escalation service
│   │   │   ├── notification/    # In-app notifications & read receipts
│   │   │   ├── reporting/       # Daily AI executive operations report generator
│   │   │   └── analytics/       # Live metrics, time saved & Before vs After comparison
│   │   ├── utils/               # Standardized JSON response formatting
│   │   ├── app.js               # Express application configuration
│   │   └── server.js            # HTTP Server bootstrap & cron activation
│   ├── tests/
│   │   └── run-tests.js         # Automated verification suite (11 test cases)
│   ├── .env.example
│   ├── .env
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/          # Navbar, Sidebar, LiveActivityFeed, AIUnderstandingCard, Timeline, DemoModal
    │   ├── context/             # AuthContext (Role switching, JWT), NotificationContext
    │   ├── pages/
    │   │   ├── LandingPage.jsx          # Public showcase & transformation pipeline
    │   │   ├── DashboardPage.jsx        # AI Operations Command Center
    │   │   ├── IntakePage.jsx           # Natural Language smart request intake
    │   │   ├── RequestsPage.jsx         # Tickets & incidents with SLA monitors
    │   │   ├── DuplicatesPage.jsx       # Duplicate detection & Master Incident merge
    │   │   ├── RecurringPage.jsx        # Recurring defect radar & hotspot analyzer
    │   │   ├── WorkflowBuilderPage.jsx  # NL & Visual node workflow builder
    │   │   ├── ApprovalsPage.jsx        # Faculty / HOD sign-off queue
    │   │   ├── CopilotPage.jsx          # Grounded AI decision copilot
    │   │   ├── ReportsPage.jsx          # Daily AI operations report
    │   │   ├── AnalyticsPage.jsx        # Value metrics & Before vs After matrix
    │   │   └── AdminControlPage.jsx     # Automation control center
    │   ├── services/            # Axios API client
    │   ├── App.jsx              # Main routing & layout
    │   ├── index.css            # Cyber dark design system & glassmorphism
    │   └── main.jsx
    ├── index.html
    ├── tailwind.config.js
    └── package.json
```

---

## 🗄️ Database Schema (Supabase PostgreSQL)

The system deploys 23 relational tables:
1. `users` — Authentication credentials, roles, contacts, status.
2. `roles` — System permissions (`student`, `faculty`, `staff`, `department_head`, `admin`).
3. `departments` — 10 Campus operational units (IT, Maintenance, Hostel, Academics, Admin, etc.).
4. `employees` — Staff specialists, job titles, verified skills, workload scores (0-100), availability.
5. `students` — Student records, batches, hostel rooms.
6. `request_categories` — Operational categories and default SLA expectations.
7. `requests` — Ticket records, AI summaries, extracted entities, SLA deadlines, master incident links.
8. `request_comments` — Public and internal collaboration threads.
9. `request_attachments` — File uploads and evidence documents.
10. `tasks` — Granular operational actions generated per ticket.
11. `task_assignments` — Dispatch logs with criteria breakdown and match scores.
12. `workflows` — Orchestration templates and node definitions.
13. `workflow_nodes` — Visual graph nodes (`TRIGGER`, `AI_CLASSIFICATION`, `CONDITION`, etc.).
14. `workflow_runs` — Step-by-step execution logs for each active ticket.
15. `approvals` — Faculty/HOD authorization queue with approval/rejection rationale.
16. `notifications` — In-app push notification feeds.
17. `sla_rules` — Priority response/resolution thresholds and warning percentages.
18. `escalation_rules` — Multi-tier escalation escalation paths by role.
19. `automation_rules` — Configurable event-action triggers.
20. `ai_decisions` — Complete audit trail of AI classifications, confidence, and models used.
21. `incidents` — Master incidents grouping clustered duplicate tickets.
22. `audit_logs` — Immutable event stream capturing `AI_AGENT`, `HUMAN`, and `SYSTEM` actions.
23. `analytics` — Daily aggregated operations statistics and metrics.

---

## 🔑 Environment Variables

### Backend (`campusflow-ai/backend/.env`)

```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Supabase Credentials
SUPABASE_URL=https://hcnybaabvqrjztnlzqdl.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# JWT Authentication
JWT_SECRET=campusflow_super_secret_jwt_key_2026_operations_agent_production
JWT_EXPIRES_IN=7d

# AI Model Configuration
AI_PROVIDER=local_intelligent_agent
AI_API_KEY=
AI_MODEL=gemini-2.0-flash
AI_CONFIDENCE_THRESHOLD=0.70
```

---

## ⚡ Installation & Quick Start

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher (v24 recommended)
- **npm**: v9.0.0 or higher

### 2. Backend Setup
```bash
cd campusflow-ai/backend
npm install
npm run seed     # Populates 10 departments, 17 users, 50+ requests, workflows & SLA rules
npm start        # Starts server on http://localhost:5000
```

### 3. Frontend Setup
```bash
cd campusflow-ai/frontend
npm install
npm run dev      # Starts Vite dev server on http://localhost:5173
```

### 4. Run Automated Test Suite
```bash
cd campusflow-ai/backend
npm test         # Runs 11 automated test cases verifying the full autonomous pipeline
```

---

## 🎭 Demo Credentials & Fast Role Switching

CampusFlow includes a **Fast Role-Switcher** in the top navigation bar. You can instantly switch between personas without logging out:

| Persona | Role | Name | Email | Password |
| :--- | :--- | :--- | :--- | :--- |
| **Administrator** | `admin` | Dr. Vikram Patel | `admin@campusflow.ai` | `Password@123` |
| **Department Head** | `department_head` | Dr. Sunita Rao (IT) | `hod.it@campusflow.ai` | `Password@123` |
| **Faculty Advisor** | `faculty` | Prof. Rajesh Nair | `faculty@campusflow.ai` | `Password@123` |
| **Staff Technician** | `staff` | Rahul Sharma (AV) | `rahul.it@campusflow.ai` | `Password@123` |
| **Student** | `student` | Aarav Mehta | `student@campusflow.ai` | `Password@123` |

---

## 🎬 3-Minute Judge Demonstration Script (Section 55)

1. Open **`http://localhost:5173/`** to view the **Landing Page** and the transformation pipeline.
2. Click **"Explore Platform"** to enter the **AI Operations Command Center** (`/dashboard`). Note the `AI AGENT ACTIVE` pulsing beacon, 87% automation rate, and live AI activity stream.
3. Click the glowing **"RUN LIVE DEMO"** button in the navbar to open the interactive scenario runner:
   - **Scenario 1:** Watch the flagship Classroom B204 projector request get extracted, classified, prioritized as `HIGH`, and dispatched to technician Rahul Sharma with an active SLA timer.
   - **Scenario 2:** Run the Lab 3 duplicate cluster demonstration to see 8 separate reports consolidated into 1 Master Incident.
   - **Scenario 3:** Run the SLA Watchdog scenario to see a ticket trigger an 80% reminder and automatically escalate to HOD Dr. Sunita Rao.
   - **Scenario 4:** See the AI Copilot answer operational questions from live database telemetry and propose corrective actions.
4. Navigate to **"Smart Request Intake"** (`/intake`) and click one of the quick scenario pills (e.g. *"AC Leak in Lab 3"*). Observe the real-time AI Understanding card update dynamically as you type.
5. Navigate to **"Describe Your Automation"** (`/workflows`) and click **"Compile into Node Graph"** to observe plain English policies transform into interactive visual workflow flowchart nodes.
6. Open **"Daily AI Report"** (`/reports`) to inspect the synthesized executive briefing with AI observations and preventive maintenance recommendations.
7. Open **"Analytics & Impact"** (`/analytics`) to view the dedicated **"Before vs After AI"** comparison matrix.

---

## 🔮 Future Enhancements
- WhatsApp & Telegram conversational intake bots with bi-directional technician updates.
- Computer vision model to classify physical defects directly from student photo uploads.
- IoT smart sensor integration (energy meters, water level sensors, chiller pressure monitors) to trigger automated work orders before humans notice defects.
- Voice-activated campus field dispatch for technicians on mobile terminals.

---

## 📄 License
This project is licensed under the MIT License — created for the Smart Automation Challenge.
Developed with passion by the **CampusFlow AI** Engineering Team.
