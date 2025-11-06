import React, { useContext } from "react";
import { CartContext } from "./CartContext";

const products = [
  { id: 1, name: "iPhone 15", price: 999 },
  { id: 2, name: "MacBook Air M3", price: 1299 },
  { id: 3, name: "AirPods Pro 2", price: 249 },
  { id: 4, name: "Apple Watch", price: 499 },
];

export default function ProductList() {
  const { addToCart } = useContext(CartContext);

  return (
    <div style={{ border: "1px solid #ddd", padding: 20, borderRadius: 10 }}>
      <h3>🛍️ Products</h3>
      {products.map((p) => (
        <div key={p.id} style={{ margin: "10px 0" }}>
          {p.name} - ${p.price}
          <button style={{ marginLeft: 10 }} onClick={() => addToCart(p)}>
            Add to cart
          </button>
        </div>
      ))}
    </div>
  );
}
