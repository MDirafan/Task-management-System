const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./database');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

//frontend
const path = require('path');

// Serve static files from the frontend directory
app.use(express.static(path.join(__dirname, '../frontend')));

// Default route to serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Routes

// Get all tasks
app.get('/tasks', (req, res) => {
    db.all('SELECT * FROM tasks', [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// Create a new task
app.post('/tasks', (req, res) => {
    const { title, description, due_date } = req.body;
    const sql = `INSERT INTO tasks (title, description, due_date) VALUES (?, ?, ?)`;
    const params = [title, description, due_date];
    db.run(sql, params, function (err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({ id: this.lastID });
    });
});

// Update a task
app.put('/tasks/:id', (req, res) => {
    const { title, description, due_date, status } = req.body;
    const sql = `UPDATE tasks SET title = ?, description = ?, due_date = ?, status = ? WHERE id = ?`;
    const params = [title, description, due_date, status, req.params.id];
    db.run(sql, params, function (err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({ updated: this.changes });
    });
});

// Delete a task
app.delete('/tasks/:id', (req, res) => {
    const sql = `DELETE FROM tasks WHERE id = ?`;
    const params = [req.params.id];
    db.run(sql, params, function (err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({ deleted: this.changes });
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
