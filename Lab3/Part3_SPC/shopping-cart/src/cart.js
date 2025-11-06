import React, { useContext } from "react";
import { CartContext } from "./CartContext";

export default function Cart() {
  const { cart, removeFromCart, total } = useContext(CartContext);

  return (
    <div
      style={{
        border: "1px solid #ddd",
        padding: 20,
        borderRadius: 10,
        marginTop: 20,
      }}
    >
      <h3>🛒 Cart</h3>
      {cart.length === 0 ? (
        <p>Empty cart!</p>
      ) : (
        <>
          {cart.map((item) => (
            <div key={item.cartItemId}>
              {item.name} - ${item.price}
              <button onClick={() => removeFromCart(item.cartItemId)}>
                Remove
              </button>
            </div>
          ))}
          <hr />
          <p>
            <b>Total:</b> ${total}
          </p>
        </>
      )}
    </div>
  );
}
