const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const path = require('path');

const app = express();

/* =========================
   MIDDLEWARE
========================= */
app.use(cors());
app.use(express.json());

/* =========================
   DATABASE (Railway / Local)
========================= */
const db = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://postgres:1234@localhost:5432/drcs',
  ssl: process.env.DATABASE_URL
    ? { rejectUnauthorized: false }
    : false
});

/* =========================
   TEST ROUTE
========================= */
app.get('/api', (req, res) => {
  res.send('API running 🚀');
});

/* =========================
   ADD AGENCY
========================= */
app.post('/api/agencies', async (req, res) => {
  const { name, type, phone, location } = req.body;

  try {
    const result = await db.query(
      'INSERT INTO agencies (name, type, phone, location) VALUES ($1,$2,$3,$4) RETURNING *',
      [name, type, phone, location]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error adding agency' });
  }
});

/* =========================
   GET ALL AGENCIES
========================= */
app.get('/api/agencies', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM agencies ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching agencies' });
  }
});

/* =========================
   SERVE FRONTEND (IMPORTANT)
========================= */
app.use(express.static(path.join(__dirname, '../frontend')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

/* =========================
   SERVER START
========================= */
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});