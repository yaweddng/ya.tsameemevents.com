import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, '../platform.db');
const db = new Database(dbPath);

// Initialize schema
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE,
    password TEXT,
    name TEXT,
    username TEXT UNIQUE,
    role TEXT DEFAULT 'user',
    subscription_status TEXT DEFAULT 'trial',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS sites (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    title TEXT,
    subdomain TEXT UNIQUE,
    custom_domain TEXT UNIQUE,
    dns_verified BOOLEAN DEFAULT 0,
    status TEXT DEFAULT 'draft',
    theme_config TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sender_id TEXT,
    receiver_id TEXT,
    content TEXT,
    is_read BOOLEAN DEFAULT 0,
    notification_sent BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES users(id),
    FOREIGN KEY (receiver_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS otps (
    email TEXT PRIMARY KEY,
    otp TEXT,
    expires_at DATETIME,
    verified BOOLEAN DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT
  );
`);

// Add notification_sent column if it doesn't exist
try {
  db.exec("ALTER TABLE messages ADD COLUMN notification_sent BOOLEAN DEFAULT 0");
} catch (e) {
  // Column might already exist
}

// Ensure admin user exists for foreign key constraints in messages
try {
  db.exec(`
    INSERT OR IGNORE INTO users (id, email, name, username, role) 
    VALUES ('admin', 'admin@example.com', 'Admin', 'admin', 'admin')
  `);
} catch (e) {
  console.error("Error creating admin user:", e);
}

export default db;
