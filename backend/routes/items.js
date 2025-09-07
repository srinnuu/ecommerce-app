import express from 'express';
import { listItems, createItem, updateItem, deleteItem, getItem } from '../controllers/itemsController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/', listItems);
router.get('/:id', getItem);
router.post('/', auth, createItem); // simple auth guard for creating items
router.put('/:id', auth, updateItem);
router.delete('/:id', auth, deleteItem);

export default router;
