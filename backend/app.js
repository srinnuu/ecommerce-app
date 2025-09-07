import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRouter from './routes/auth.js';
import itemsRouter from './routes/items.js';
import cartRouter from './routes/cart.js';
import { ensureSchema } from './db.js';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (_req, res) => res.json({ status: 'ok', service: 'E-commerce API' }));

app.use('/api/auth', authRouter);
app.use('/api/items', itemsRouter);
app.use('/api/cart', cartRouter);

const PORT = process.env.PORT || 5000;
ensureSchema().then(() => {
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
}).catch(err => {
  console.error('DB init failed', err);
  process.exit(1);
});
