import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { MemStorage } from './storage.js';
import { createRoutes } from './routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 5000;

// Initialize storage
const storage = new MemStorage();

// Middleware
app.use(cors());
app.use(express.json());

// API routes
app.use(createRoutes(storage));

// Serve static files and React app
app.use(express.static(path.join(__dirname, '../client/dist')));

// Serve React app for all other routes (SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`CollabZone Server running on port ${PORT}`);
  console.log(`Backend: Express.js with in-memory storage`);
  console.log(`Frontend: React with Vite`);
  console.log(`Migration completed - ready for development!`);
});