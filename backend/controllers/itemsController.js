import { pool } from '../db.js';

export async function listItems(req, res) {
  try {
    const { category, price_lte, q } = req.query;
    let sql = 'SELECT * FROM items WHERE 1=1';
    const params = [];
    if (category) { params.push(category); sql += ` AND category=$${params.length}`; }
    if (price_lte) { params.push(price_lte); sql += ` AND price <= $${params.length}`; }
    if (q) { params.push('%'+q+'%'); sql += ` AND (name ILIKE $${params.length} OR description ILIKE $${params.length})`; }
    sql += ' ORDER BY created_at DESC';
    const { rows } = await pool.query(sql, params);
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to list items' });
  }
}

export async function getItem(req, res) {
  try {
    const { id } = req.params;
    const { rows } = await pool.query('SELECT * FROM items WHERE id=$1', [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to fetch item' });
  }
}

export async function createItem(req, res) {
  try {
    const { name, description, category, price } = req.body;
    if (!name || !price) return res.status(400).json({ error: 'Name and price required' });
    const { rows } = await pool.query('INSERT INTO items (name, description, category, price) VALUES ($1,$2,$3,$4) RETURNING *',
      [name, description || null, category || null, price]);
    res.json(rows[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to create item' });
  }
}

export async function updateItem(req, res) {
  try {
    const { id } = req.params;
    const { name, description, category, price } = req.body;
    const { rows } = await pool.query('UPDATE items SET name=$1,description=$2,category=$3,price=$4 WHERE id=$5 RETURNING *',
      [name, description || null, category || null, price, id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to update item' });
  }
}

export async function deleteItem(req, res) {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM items WHERE id=$1', [id]);
    res.json({ success: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to delete' });
  }
}
