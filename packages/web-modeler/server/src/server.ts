import app from './app';

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log('===========================================');
  console.log('  Catalyst BPMN Web Modeler - Backend API');
  console.log('===========================================');
  console.log(`  Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`  Server:      http://localhost:${PORT}`);
  console.log(`  Health:      http://localhost:${PORT}/health`);
  console.log(`  BPMN Dir:    ${process.env.BPMN_DIR || '/app/bpmn-files'}`);
  console.log(`  Connectors:  ${process.env.CONNECTORS_DIR || '/app/connectors'}`);
  console.log(`  Camunda:     ${process.env.CAMUNDA_API_URL || 'http://catalyst-camunda:8080/engine-rest'}`);
  console.log('===========================================');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
