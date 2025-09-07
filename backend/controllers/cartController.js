import { pool } from '../db.js';

async function ensureUserCart(userId) {
  const r = await pool.query('SELECT id FROM carts WHERE user_id=$1', [userId]);
  if (r.rows.length) return r.rows[0].id;
  const ins = await pool.query('INSERT INTO carts (user_id) VALUES ($1) RETURNING id', [userId]);
  return ins.rows[0].id;
}

export async function getCart(req, res) {
  try {
    const userId = req.user.userId;
    const cartId = await ensureUserCart(userId);
    const { rows } = await pool.query(`SELECT ci.id as cart_item_id, ci.quantity, i.*
      FROM cart_items ci JOIN items i ON i.id=ci.item_id WHERE ci.cart_id=$1`, [cartId]);
    res.json({ cartId, items: rows });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
}

export async function addToCart(req, res) {
  try {
    const userId = req.user.userId;
    const { itemId, quantity } = req.body;
    if (!itemId) return res.status(400).json({ error: 'itemId required' });
    const cartId = await ensureUserCart(userId);
    const q = parseInt(quantity || 1, 10);
    // upsert cart_items
    await pool.query(`INSERT INTO cart_items (cart_id, item_id, quantity)
      VALUES ($1,$2,$3) ON CONFLICT (cart_id, item_id) DO UPDATE SET quantity = cart_items.quantity + EXCLUDED.quantity`,
      [cartId, itemId, q]);
    res.json({ success: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to add to cart' });
  }
}

export async function removeFromCart(req, res) {
  try {
    const userId = req.user.userId;
    const { itemId } = req.body;
    if (!itemId) return res.status(400).json({ error: 'itemId required' });
    const cartId = await ensureUserCart(userId);
    await pool.query('DELETE FROM cart_items WHERE cart_id=$1 AND item_id=$2', [cartId, itemId]);
    res.json({ success: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to remove from cart' });
  }
}

export async function clearCart(req, res) {
  try {
    const userId = req.user.userId;
    const cartId = await ensureUserCart(userId);
    await pool.query('DELETE FROM cart_items WHERE cart_id=$1', [cartId]);
    res.json({ success: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to clear cart' });
  }
}
