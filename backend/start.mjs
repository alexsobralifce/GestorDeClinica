// Entry wrapper to keep Node.js v24 process alive with tsx
// This works around an issue where tsx + ESM modules cause early process exit
import('./src/index.ts').catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
