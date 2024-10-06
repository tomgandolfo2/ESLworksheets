import sqlite3 from "sqlite3";
const db = new sqlite3.Database("./worksheets.db");

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS worksheets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    description TEXT,
    file_url TEXT
  )`);
});

export default db;
