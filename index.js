const { spawn } = require('child_process');

const child = spawn('sh', ['-c', 'cd backend && npm install && npm start'], {
  stdio: 'inherit',
  shell: true
});

child.on('error', (error) => {
  console.error(`spawn error: ${error}`);
});

child.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
  process.exit(code);
});
