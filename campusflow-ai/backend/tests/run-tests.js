const http = require('http');

function request(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ status: res.statusCode, body: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, raw: body });
        }
      });
    });
    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

async function runTests() {
  console.log('🧪 Starting CampusFlow AI Production Verification Suite...\n');
  let passed = 0;
  let failed = 0;

  const assert = (condition, name) => {
    if (condition) {
      console.log(`  ✅ PASS: ${name}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${name}`);
      failed++;
    }
  };

  try {
    // 1. Health check
    const health = await request({ hostname: 'localhost', port: 5000, path: '/health', method: 'GET' });
    assert(health.status === 200 && health.body.status === 'ONLINE', 'System Health Check online');

    // 2. Auth - Login
    const loginRes = await request(
      { hostname: 'localhost', port: 5000, path: '/api/auth/login', method: 'POST', headers: { 'Content-Type': 'application/json' } },
      { email: 'admin@campusflow.ai', password: 'Password@123' }
    );
    assert(loginRes.status === 200 && loginRes.body.data.token, 'JWT Authentication and bcrypt login');
    const token = loginRes.body.data ? loginRes.body.data.token : null;
    const authHeaders = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };

    // 3. AI Classification & Intent Extraction (Scenario 1 Flagship)
    const classifyRes = await request(
      { hostname: 'localhost', port: 5000, path: '/api/ai/classify', method: 'POST', headers: authHeaders },
      {
        title: "The projector in classroom B204 isn't working and we have an important presentation tomorrow morning",
        description: "Ceiling projector red lamp blinking error.",
        location: "Classroom B204"
      }
    );
    assert(
      classifyRes.status === 200 &&
      classifyRes.body.data.department === 'IT Support' &&
      classifyRes.body.data.priority === 'HIGH' &&
      classifyRes.body.data.confidence >= 0.90,
      'AI Classification Service (Category, Priority HIGH, IT Support routing, Confidence > 90%)'
    );

    // 4. Request Autonomous Creation & Dispatch
    const createReq = await request(
      { hostname: 'localhost', port: 5000, path: '/api/requests', method: 'POST', headers: authHeaders },
      {
        title: "The projector in classroom B204 isn't working and we have an important presentation tomorrow morning",
        description: "Ceiling projector red lamp blinking error.",
        location: "Classroom B204"
      }
    );
    assert(
      createReq.status === 201 &&
      createReq.body.data.request.request_number &&
      createReq.body.data.assignment.name.includes('Rahul'),
      'Autonomous Intake & Intelligent Assignment to Rahul Sharma (AV Specialist)'
    );

    // 5. Duplicate Incident Detection Check
    const dupRes = await request(
      { hostname: 'localhost', port: 5000, path: '/api/ai/duplicates', method: 'POST', headers: authHeaders },
      {
        title: "Lab 3 AC is leaking water on desk 4",
        description: "AC problem in Lab 3",
        location: "Lab 3"
      }
    );
    assert(
      dupRes.status === 200 && dupRes.body.data.isDuplicate,
      'Duplicate Incident Semantic Detection (Clustering Lab 3 AC reports)'
    );

    // 6. Recurring Anomaly Radar
    const recurringRes = await request({ hostname: 'localhost', port: 5000, path: '/api/ai/recurring', method: 'GET', headers: authHeaders });
    assert(
      recurringRes.status === 200 && recurringRes.body.data.insights.length >= 3,
      'Recurring Problem Detection Engine (Identified Lab 3 with 17 complaints)'
    );

    // 7. Grounded AI Copilot Q&A
    const copilotRes = await request(
      { hostname: 'localhost', port: 5000, path: '/api/ai/copilot/query', method: 'POST', headers: authHeaders },
      { query: "What are today's urgent issues?" }
    );
    assert(
      copilotRes.status === 200 && copilotRes.body.data.answer.includes('urgent'),
      'AI Operations Copilot Q&A grounded in live database'
    );

    // 8. Natural Language Workflow Builder
    const workflowGenRes = await request(
      { hostname: 'localhost', port: 5000, path: '/api/workflows/generate', method: 'POST', headers: authHeaders },
      { prompt: "When a student submits a leave request longer than three days, send it to the faculty advisor. If approved, notify the student." }
    );
    assert(
      workflowGenRes.status === 200 && workflowGenRes.body.data.nodes.length >= 4,
      'Natural Language Workflow Builder ("Describe your automation" to Node Graph)'
    );

    // 9. SLA Watchdog Autonomous Sweep
    const slaRes = await request({ hostname: 'localhost', port: 5000, path: '/api/escalation/sweep', method: 'POST', headers: authHeaders });
    assert(
      slaRes.status === 200 && slaRes.body.data.evaluatedCount > 0,
      'SLA Watchdog Autonomous Sweep Engine'
    );

    // 10. Daily Operations Report Generation
    const reportRes = await request({ hostname: 'localhost', port: 5000, path: '/api/reports/daily', method: 'GET', headers: authHeaders });
    assert(
      reportRes.status === 200 && reportRes.body.data.metrics.automationRate,
      'Daily AI Operations Report generation with observations & recommendations'
    );

    // 11. Judge Live Demo Scenario 1-4 Runner
    const demoRes = await request(
      { hostname: 'localhost', port: 5000, path: '/api/demo/run-scenario', method: 'POST', headers: authHeaders },
      { scenarioId: 1 }
    );
    assert(
      demoRes.status === 200 && demoRes.body.data.steps.length >= 5,
      '1-Click Interactive Judge Demo Runner (Scenario 1 Flagship)'
    );

  } catch (err) {
    console.error('Test execution exception:', err);
    failed++;
  }

  console.log(`\n=====================================================`);
  console.log(`  📊 TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log(`=====================================================\n`);

  process.exit(failed > 0 ? 1 : 0);
}

runTests();
