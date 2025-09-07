import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getToken } from '../utils/auth';

const API = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

export default function Home() {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');

  const load = async () => {
    const params = {};
    if (q) params.q = q;
    if (category) params.category = category;
    if (price) params.price_lte = price;
    const { data } = await axios.get(`${API}/items`, { params });
    setItems(data);
  };

  useEffect(() => { load(); }, []);

  const addToCart = async (itemId) => {
    const token = getToken();
    if (!token) return alert('Login to add to cart');
    await axios.post(`${API}/cart/add`, { itemId, quantity:1 }, { headers: { Authorization: 'Bearer ' + token } });
    alert('Added to cart');
  };

  return (
    <div>
      <h2>Items</h2>
      <div style={{ marginBottom: 12 }}>
        <input placeholder="search" value={q} onChange={e=>setQ(e.target.value)} />{' '}
        <input placeholder="category" value={category} onChange={e=>setCategory(e.target.value)} />{' '}
        <input placeholder="max price" value={price} onChange={e=>setPrice(e.target.value)} />{' '}
        <button onClick={load}>Filter</button>
      </div>
      <div className="grid">
        {items.map(it => (
          <div className="card" key={it.id}>
            <h3>{it.name}</h3>
            <p>{it.description}</p>
            <p><strong>Category:</strong> {it.category}</p>
            <p><strong>Price:</strong> ₹{it.price}</p>
            <button onClick={()=>addToCart(it.id)}>Add to cart</button>
          </div>
        ))}
      </div>
    </div>
  );
}
