import dotenv from 'dotenv';
import pkg from 'pg';
const { Pool } = pkg;
dotenv.config();
export const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export async function ensureSchema() {
  const sql = `
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
  );

  CREATE TABLE IF NOT EXISTS items (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT,
    price NUMERIC(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
  );

  CREATE TABLE IF NOT EXISTS carts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW()
  );

  CREATE TABLE IF NOT EXISTS cart_items (
    id SERIAL PRIMARY KEY,
    cart_id INTEGER REFERENCES carts(id) ON DELETE CASCADE,
    item_id INTEGER REFERENCES items(id),
    quantity INTEGER DEFAULT 1,
    UNIQUE(cart_id, item_id)
  );
  `;
  await pool.query(sql);
  // Insert sample items if table empty
  const { rows } = await pool.query('SELECT COUNT(*)::int as c FROM items');
  if (rows[0].c === 0) {
    await pool.query(`
      INSERT INTO items (name, description, category, price) VALUES
      ('Wireless Mouse', 'Ergonomic wireless mouse', 'Accessories', 599.00),
      ('Mechanical Keyboard', 'RGB mechanical keyboard', 'Accessories', 2499.00),
      ('USB-C Charger', '65W fast charger', 'Electronics', 1299.00),
      ('Noise Cancelling Headphones', 'Over-ear ANC headphones', 'Audio', 6999.00)
    `);
  }
}
