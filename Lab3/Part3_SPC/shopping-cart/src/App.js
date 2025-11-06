import React from "react";
import { CartProvider } from "./CartContext";
import ProductList from "./ProductList";
import Cart from "./cart";

function App() {
  return (
    <CartProvider>
      <div style={{ margin: 30, fontFamily: "Arial" }}>
        <h2>🛍️ Shopping Cart App</h2>
        <ProductList />
        <Cart />
      </div>
    </CartProvider>
  );
}

export default App;
