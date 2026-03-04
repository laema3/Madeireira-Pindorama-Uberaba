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
    const row = db.prepare('SELECT value FROM store WHERE key = ?').get(req.params.key) as { value: string } | undefined;
    if (row) {
      console.log(`Loading data for key: ${req.params.key} (${row.value.length} bytes)`);
      res.json(JSON.parse(row.value));
    } else {
      console.log(`No data found for key: ${req.params.key}`);
      res.json(null);
    }
  });

  app.post('/api/data/:key', (req, res) => {
    const { key } = req.params;
    console.log(`Saving data for key: ${key} (${JSON.stringify(req.body).length} bytes)`);
    const value = JSON.stringify(req.body);
    db.prepare('INSERT OR REPLACE INTO store (key, value) VALUES (?, ?)').run(key, value);
    res.json({ success: true });
  });

  app.get('/api/health', (req, res) => {
    const count = db.prepare('SELECT COUNT(*) as count FROM store').get() as { count: number };
    res.json({ status: 'ok', keys: count.count });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files from dist (Production Mode)
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
