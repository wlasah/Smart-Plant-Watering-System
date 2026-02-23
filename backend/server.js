const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// MySQL Connection Pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '', // Default XAMPP password is empty
  database: 'smart_plant_watering',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// GET all plants
app.get('/api/plants', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [plants] = await connection.query('SELECT * FROM plants');
    connection.release();
    res.json(plants);
  } catch (error) {
    console.error('Error fetching plants:', error);
    res.status(500).json({ error: 'Failed to fetch plants' });
  }
});

// GET single plant by ID
app.get('/api/plants/:id', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [plant] = await connection.query(
      'SELECT * FROM plants WHERE id = ?',
      [req.params.id]
    );
    connection.release();
    
    if (plant.length === 0) {
      return res.status(404).json({ error: 'Plant not found' });
    }
    res.json(plant[0]);
  } catch (error) {
    console.error('Error fetching plant:', error);
    res.status(500).json({ error: 'Failed to fetch plant' });
  }
});

// POST new plant
app.post('/api/plants', async (req, res) => {
  const { name, location, moisture_level, status } = req.body;
  
  // Validation
  if (!name || !location) {
    return res.status(400).json({ error: 'Name and location are required' });
  }
  
  try {
    const connection = await pool.getConnection();
    const [result] = await connection.query(
      'INSERT INTO plants (name, location, moisture_level, status) VALUES (?, ?, ?, ?)',
      [name, location, moisture_level || 50, status || 'Healthy']
    );
    connection.release();
    
    res.status(201).json({
      id: result.insertId,
      name,
      location,
      moisture_level: moisture_level || 50,
      status: status || 'Healthy',
      last_watered: new Date(),
      created_at: new Date()
    });
  } catch (error) {
    console.error('Error creating plant:', error);
    res.status(500).json({ error: 'Failed to create plant' });
  }
});

// PUT update plant (water the plant)
app.put('/api/plants/:id', async (req, res) => {
  const { moisture_level, status } = req.body;
  
  try {
    const connection = await pool.getConnection();
    await connection.query(
      'UPDATE plants SET moisture_level = ?, status = ?, last_watered = NOW() WHERE id = ?',
      [moisture_level || 100, status || 'Healthy', req.params.id]
    );
    connection.release();
    
    res.json({ message: 'Plant updated successfully' });
  } catch (error) {
    console.error('Error updating plant:', error);
    res.status(500).json({ error: 'Failed to update plant' });
  }
});

// DELETE plant
app.delete('/api/plants/:id', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    await connection.query('DELETE FROM plants WHERE id = ?', [req.params.id]);
    connection.release();
    
    res.json({ message: 'Plant deleted successfully' });
  } catch (error) {
    console.error('Error deleting plant:', error);
    res.status(500).json({ error: 'Failed to delete plant' });
  }
});

// POST water plant (log watering event)
app.post('/api/plants/:id/water', async (req, res) => {
  const { moisture_before, moisture_after } = req.body;
  
  try {
    const connection = await pool.getConnection();
    
    // Log watering event
    await connection.query(
      'INSERT INTO watering_history (plant_id, moisture_before, moisture_after) VALUES (?, ?, ?)',
      [req.params.id, moisture_before || 0, moisture_after || 100]
    );
    
    // Update plant last_watered and moisture level
    await connection.query(
      'UPDATE plants SET last_watered = NOW(), moisture_level = ? WHERE id = ?',
      [moisture_after || 100, req.params.id]
    );
    
    connection.release();
    res.json({ message: 'Plant watered successfully' });
  } catch (error) {
    console.error('Error watering plant:', error);
    res.status(500).json({ error: 'Failed to water plant' });
  }
});

// GET watering history for a plant
app.get('/api/plants/:id/history', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [history] = await connection.query(
      'SELECT * FROM watering_history WHERE plant_id = ? ORDER BY watering_date DESC LIMIT 30',
      [req.params.id]
    );
    connection.release();
    
    res.json(history);
  } catch (error) {
    console.error('Error fetching watering history:', error);
    res.status(500).json({ error: 'Failed to fetch watering history' });
  }
});

// GET all watering history (for analytics)
app.get('/api/watering-history', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [history] = await connection.query(
      'SELECT wh.*, p.name FROM watering_history wh JOIN plants p ON wh.plant_id = p.id ORDER BY wh.watering_date DESC LIMIT 100'
    );
    connection.release();
    
    res.json(history);
  } catch (error) {
    console.error('Error fetching watering history:', error);
    res.status(500).json({ error: 'Failed to fetch watering history' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🌱 Server running on http://localhost:${PORT}`);
  console.log(`✅ Database: smart_plant_watering`);
});
