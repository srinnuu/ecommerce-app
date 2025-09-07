import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getToken, clearToken } from '../utils/auth';
const API = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

export default function Cart() {
  const [cart, setCart] = useState(null);

  const load = async () => {
    const token = getToken();
    if (!token) return alert('Login to view cart');
    const { data } = await axios.get(`${API}/cart`, { headers: { Authorization: 'Bearer ' + token } });
    setCart(data);
  };

  useEffect(() => { load(); }, []);

  const remove = async (itemId) => {
    const token = getToken();
    await axios.post(`${API}/cart/remove`, { itemId }, { headers: { Authorization: 'Bearer ' + token } });
    load();
  };

  const clear = async () => {
    const token = getToken();
    await axios.post(`${API}/cart/clear`, {}, { headers: { Authorization: 'Bearer ' + token } });
    load();
  };

  return (
    <div>
      <h2>My Cart</h2>
      {!cart && <p>Loading or login required...</p>}
      {cart && (
        <div>
          <button onClick={clear}>Clear Cart</button>
          <div style={{ marginTop: 12 }}>
            {cart.items.length === 0 && <p>Cart empty</p>}
            {cart.items.map(ci => (
              <div key={ci.cart_item_id} className="card" style={{ marginBottom:8 }}>
                <h3>{ci.name}</h3>
                <p>Qty: {ci.quantity}</p>
                <p>Price: ₹{ci.price}</p>
                <button onClick={() => remove(ci.item_id)}>Remove</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
