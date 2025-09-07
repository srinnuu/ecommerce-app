import express from 'express';
import auth from '../middleware/auth.js';
import { getCart, addToCart, removeFromCart, clearCart } from '../controllers/cartController.js';

const router = express.Router();
router.use(auth);

router.get('/', getCart);
router.post('/add', addToCart); // body: { itemId, quantity }
router.post('/remove', removeFromCart); // body: { itemId }
router.post('/clear', clearCart);

export default router;
