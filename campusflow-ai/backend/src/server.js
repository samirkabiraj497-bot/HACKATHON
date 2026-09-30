const dotenv = require('dotenv');
dotenv.config();

const app = require('./app');
const { initScheduler } = require('./jobs/scheduler');

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`
=====================================================
  🎓 CAMPUSFLOW AI — AI Operations Agent Server
=====================================================
  🚀 Server running on: http://localhost:${PORT}
  📡 API Base:           http://localhost:${PORT}/api
  🏥 Health check:       http://localhost:${PORT}/health
  🤖 AI Engine:          ACTIVE & DISPATCHING
=====================================================
  `);

  // Initialize automated background cron jobs (SLA watchdog, anomaly sweeps)
  initScheduler();
});

module.exports = server;
