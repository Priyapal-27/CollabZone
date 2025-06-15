import { exec } from 'child_process';

// Simple development script to run the server
console.log('Starting CollabZone development server...');

const server = exec('node server/index.js', (error, stdout, stderr) => {
  if (error) {
    console.error(`Error: ${error}`);
    return;
  }
  if (stderr) {
    console.error(`Stderr: ${stderr}`);
    return;
  }
  console.log(stdout);
});

server.stdout.on('data', (data) => {
  console.log(data);
});

server.stderr.on('data', (data) => {
  console.error(data);
});

process.on('SIGINT', () => {
  console.log('\nShutting down server...');
  server.kill();
  process.exit();
});