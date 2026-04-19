const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Database connection
const db = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'drcs',
  password: '1234',
  port: 5432,
});

// =========================
// API ROUTES
// =========================

// Test route
app.get('/api', (req, res) => {
  res.send('API running');
});

// Add agency
app.post('/api/agencies', async (req, res) => {
  const { name, type, phone, location } = req.body;

  const result = await db.query(
    'INSERT INTO agencies (name,type,phone,location) VALUES ($1,$2,$3,$4) RETURNING *',
    [name, type, phone, location]
  );

  res.json(result.rows[0]);
});

// Get agencies
app.get('/api/agencies', async (req, res) => {
  const result = await db.query('SELECT * FROM agencies');
  res.json(result.rows);
});

// Create task
app.post('/api/tasks', async (req, res) => {
  const { title, assigned_to } = req.body;

  const result = await db.query(
    'INSERT INTO tasks (title,status,assigned_to) VALUES ($1,$2,$3) RETURNING *',
    [title, 'pending', assigned_to]
  );

  res.json(result.rows[0]);
});

// Get tasks
app.get('/api/tasks', async (req, res) => {
  const result = await db.query('SELECT * FROM tasks');
  res.json(result.rows);
});

// =========================
// FRONTEND (IMPORTANT PART)
// =========================

// Serve frontend folder
app.use(express.static(path.join(__dirname, '../frontend')));

// Load index.html on root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// =========================
// START SERVER
// =========================

app.listen(3001, () => {
  console.log('Server running on http://localhost:3001');
});