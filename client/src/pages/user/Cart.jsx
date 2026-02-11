import React, { useState, useEffect } from "react";

const Cart = () => {
  const [cart, setCart] = useState([]);

  // Load cart from browser
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart"));
    if (savedCart) {
      setCart(savedCart);
    }
  }, []);

  // Increase quantity
  const increase = (id) => {
    const updated = cart.map(item =>
      item._id === id
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );

    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  // Decrease quantity
  const decrease = (id) => {
    const updated = cart.map(item =>
      item._id === id && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    );

    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  // Remove item
  const removeItem = (id) => {
    const updated = cart.filter(item => item._id !== id);

    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  // Total price
  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div>
      <h2>My Cart</h2>

      {cart.length === 0 && <p>Cart is empty</p>}

      {cart.map(item => (
        <div key={item._id} style={{ border: "1px solid gray", margin: "10px", padding: "10px" }}>
          
          <h4>{item.name}</h4>
          <p>₹{item.price}</p>

          <button onClick={() => decrease(item._id)}>-</button>
          <span> {item.quantity} </span>
          <button onClick={() => increase(item._id)}>+</button>

          <br /><br />

          <button onClick={() => removeItem(item._id)}>
            Remove
          </button>
        </div>
      ))}

      <h3>Total: ₹{total}</h3>

      {cart.length > 0 && (
        <button>Place Order</button>
      )}
    </div>
  );
};

export default Cart;