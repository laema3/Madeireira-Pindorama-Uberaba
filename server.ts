import express from 'express';
import { createServer as createViteServer } from 'vite';
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;
  const db = new Database('data.db');

  console.log('Starting server with NODE_ENV:', process.env.NODE_ENV);

  // Initialize database
  db.exec(`
    CREATE TABLE IF NOT EXISTS store (
      key TEXT PRIMARY KEY,
      value TEXT
    )
  `);

  app.use(express.json({ limit: '50mb' }));

  // API Routes
  app.get('/api/data/:key', (req, res) => {
    console.log(`GET /api/data/${req.params.key}`);
    const row = db.prepare('SELECT value FROM store WHERE key = ?').get(req.params.key) as { value: string } | undefined;
    if (row) {
      res.json(JSON.parse(row.value));
    } else {
      console.log(`Key ${req.params.key} not found, returning null`);
      res.json(null);
    }
  });

  app.post('/api/data/:key', (req, res) => {
    console.log(`POST /api/data/${req.params.key}`);
    const { key } = req.params;
    const value = JSON.stringify(req.body);
    db.prepare('INSERT OR REPLACE INTO store (key, value) VALUES (?, ?)').run(key, value);
    res.json({ success: true });
  });

  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
