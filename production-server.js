#!/usr/bin/env node
// Production server for Replit deployment
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Set production environment with all required variables
process.env.NODE_ENV = 'production';
process.env.PORT = '5000';
process.env.HOST = '0.0.0.0';

console.log('🚀 Starting Progress Accountants in production mode...');
console.log(`📍 Server will bind to ${process.env.HOST}:${process.env.PORT}`);

// Start the minimal server for production deployment
const server = spawn('node', ['minimal-server.cjs'], {
  cwd: __dirname,
  stdio: 'inherit',
  env: {
    ...process.env,
    NODE_OPTIONS: '--max-old-space-size=1024'
  }
});

// Log server startup
server.on('spawn', () => {
  console.log('✅ Server process spawned successfully');
});

server.on('error', (err) => {
  console.error('❌ Failed to start server:', err);
  process.exit(1);
});

server.on('close', (code) => {
  if (code === 0) {
    console.log('✅ Server shut down gracefully');
  } else {
    console.log(`❌ Server process exited with code ${code}`);
  }
  process.exit(code);
});

// Handle graceful shutdown signals
const gracefulShutdown = (signal) => {
  console.log(`🔄 Received ${signal}, shutting down gracefully...`);
  server.kill(signal);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Keep the process alive and handle any uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  gracefulShutdown('SIGTERM');
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  gracefulShutdown('SIGTERM');
});