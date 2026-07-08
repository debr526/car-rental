const app = require('./app');
const config = require('./config/config');

const PORT = config.server.port;

app.listen(PORT, () => {
  console.log('');
  console.log('╔════════════════════════════════════════╗');
  console.log('║      QuickReserve API Server           ║');
  console.log('╠════════════════════════════════════════╣');
  console.log(`║  🚀 Server running on port ${PORT}        ║`);
  console.log(`║  🌍 Environment: ${config.server.nodeEnv.padEnd(20)} ║`);
  console.log(`║  📡 API URL: http://localhost:${PORT}/api  ║`);
  console.log('╚════════════════════════════════════════╝');
  console.log('');
});
