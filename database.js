const sqlite3 = require('sqlite3').verbose();

// Create and configure SQLite database
const db = new sqlite3.Database('./tasks.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        db.run(`
            CREATE TABLE IF NOT EXISTS tasks (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                description TEXT,
                due_date TEXT NOT NULL,
                status TEXT DEFAULT 'Pending'
            )
        `);
    }
});

module.exports = db;
