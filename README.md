# 🎓 CAMPUSFLOW AI — AI College Operations Agent

> **"Turn every campus request into an intelligent workflow."**
> 
> *An Autonomous Operational Workforce for Higher Education Institutions.*
> Developed for the **Smart Automation Challenge**.

[![GitHub Repository](https://img.shields.io/badge/GitHub-Repository-blue?logo=github)](https://github.com/samirkabiraj497-bot/HACKATHON)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Verification Suite](https://img.shields.io/badge/Tests-11%2F11%20Passed%20(100%25)-emerald)](#-automated-verification-test-suite)
[![Tech Stack](https://img.shields.io/badge/Stack-React%2019%20%7C%20Node.js%20%7C%20Supabase-purple)](#-tech-stack)

---

## 🏆 Project Overview

**CampusFlow AI** is an autonomous operational agent that converts unstructured campus tickets, emails, and complaints into executable workflows. Instead of humans reading, routing, dispatching, and chasing tickets manually, the AI handles end-to-end operational execution.

### Key Autonomous Capabilities
1. **Fresh Ticket Intake & Guest Portal (`/new`):** Open any physical, academic, or facility issue with zero clutter. Submissions by visitors or students are pre-screened in real time.
2. **AI Understanding & Entity Extraction (`/intake`):** Multi-entity parsing (category, problem, location, equipment, deadline, impact).
3. **Multi-Factor Dispatch Engine:** Objective scoring based on **Skills (35%) + Workload Inverse (25%) + Availability (20%) + Rating (10%) + Proximity (10%)**.
4. **Duplicate Incident Semantic Clustering (`/duplicates`):** Clusters concurrent complaints (e.g. 8 complaints for Lab 3 AC) into 1 Master Incident.
5. **Recurring Defect Radar (`/recurring`):** Detects historical failure patterns (e.g. 17 complaints in 30 days) and dispatches preventive maintenance work orders.
6. **Natural Language Workflow Builder (`/workflows`):** Converts plain English policies into visual flowchart nodes.
7. **Multi-Tier Approvals Queue (`/approvals`):** Automates sign-offs for On-Duty (OD) passes, event permits, and timetable course substitutions with AI pre-screening pass badges.
8. **Grounded AI Copilot (`/copilot`):** Live database Q&A assistant proposing concrete backend actions with human authorization.
9. **Daily Operations AI Synthesis (`/reports`):** Synthesizes daily operational telemetry into executive summaries.
10. **Impact & Analytics Matrix (`/analytics`):** Measures 87% automation rate, 83% time saved, and 38.5 hours conserved.

---

## 🚀 Quick Start Guide

### 1. Launch Backend (Express + Supabase PostgreSQL)
```bash
cd campusflow-ai/backend
npm install
npm run seed       # Seeds 10 departments, 17 users, 50+ requests, workflows, and duplicate clusters
npm start          # Runs on http://localhost:5000
npm test           # Runs 11 automated verification tests (100% pass)
```

### 2. Launch Frontend (React 19 + Vite + Tailwind CSS)
```bash
cd campusflow-ai/frontend
npm install
npm run dev        # Runs on http://localhost:5173
```

---

## 👥 Demo Profiles & Instant Role Switching

Switch personas with **1 click** using the top navigation bar dropdown:

| Persona | Name | Email | Password | Role Description |
| :--- | :--- | :--- | :--- | :--- |
| **Administrator** | Dr. Vikram Patel | `admin@campusflow.ai` | `Password@123` | Full system control, analytics, and policy definitions |
| **Department Head (IT)** | Dr. Sunita Rao | `hod.it@campusflow.ai` | `Password@123` | Supervisory approvals, staff allocation & escalations |
| **Faculty Advisor** | Prof. Rajesh Nair | `faculty@campusflow.ai` | `Password@123` | Approves student On-Duty passes and timetable adjustments |
| **Technician (AV)** | Rahul Sharma | `rahul.it@campusflow.ai` | `Password@123` | Assigned task execution, diagnostics & resolution |
| **Student** | Aarav Mehta | `student@campusflow.ai` | `Password@123` | Submits campus complaints and tracks live SLA timers |
| **Guest / Visitor** | Campus Guest | `guest@campus.edu` | *(None needed)* | Opens fresh tickets directly at `/new` with zero friction |

---

## 🧪 Automated Verification Test Suite

Run the full production verification suite:
```bash
cd campusflow-ai/backend && npm test
```

```text
🧪 Starting CampusFlow AI Production Verification Suite...

  ✅ PASS: System Health Check online
  ✅ PASS: JWT Authentication and bcrypt login
  ✅ PASS: AI Classification Service (Category, Priority HIGH, IT Support routing, Confidence > 90%)
  ✅ PASS: Autonomous Intake & Intelligent Assignment to Rahul Sharma (AV Specialist)
  ✅ PASS: Duplicate Incident Semantic Detection (Clustering Lab 3 AC reports)
  ✅ PASS: Recurring Problem Detection Engine (Identified Lab 3 with 17 complaints)
  ✅ PASS: AI Operations Copilot Q&A grounded in live database
  ✅ PASS: Natural Language Workflow Builder ("Describe your automation" to Node Graph)
  ✅ PASS: SLA Watchdog Autonomous Sweep Engine
  ✅ PASS: Daily AI Operations Report generation with observations & recommendations
  ✅ PASS: 1-Click Interactive Judge Demo Runner (Scenario 1 Flagship)

=====================================================
  📊 TEST RESULTS: 11 PASSED, 0 FAILED (100% PASS)
=====================================================
```

---

## 📂 Repository Structure

```text
HACKATHON/
├── SUBMISSION.md            # Official Competition Package & 3-5 Min Demo Video Script
├── README.md                # Project Overview & Architecture Guide
└── campusflow-ai/
    ├── frontend/            # React 19 + Vite + Tailwind CSS + Lucide Icons + Recharts
    │   ├── src/
    │   │   ├── pages/       # Landing, Dashboard, Fresh (/new), Intake, Requests, Duplicates,
    │   │   │                # Recurring, Workflows, Approvals, Copilot, Reports, Analytics, Admin
    │   │   ├── components/  # Navbar, Sidebar, LiveDemoModal, AIUnderstandingCard
    │   │   ├── context/     # AuthContext (Role Switcher), NotificationContext
    │   │   └── services/    # Axios API Client
    │   ├── vercel.json      # Production SPA Cloud Routing
    │   └── package.json
    │
    └── backend/             # Node.js + Express.js + REST Architecture + Node-Cron
        ├── src/
        │   ├── config/      # Supabase Client Configuration
        │   ├── controllers/ # Auth, Requests, AI, Workflows, Approvals, Escalations, Demo
        │   ├── database/    # 23 Relational Tables + Seed Script + Resilient Cache
        │   ├── jobs/        # Background Cron Schedulers (SLA watchdog, Recurring sweep)
        │   ├── routes/      # REST API Routes (/api)
        │   ├── services/    # AI Classification, Priority, Duplicates, Copilot, Workflows
        │   └── server.js    # Express Server Entry Point
        ├── tests/           # 11 Production Integration Verification Tests
        ├── render.yaml      # Cloud Deployment Blueprint
        └── package.json
```

---

## 🌐 Official Submission Package

- Read the complete judging submission write-up: [`SUBMISSION.md`](./SUBMISSION.md)
- Public GitHub Repository: [samirkabiraj497-bot/HACKATHON](https://github.com/samirkabiraj497-bot/HACKATHON)
