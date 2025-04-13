// src/context/CartContext.jsx
import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [itemCount, setItemCount] = useState(0);
  const [total, setTotal] = useState(0);

  // Initialize cart from localStorage
  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      try {
        const parsedCart = JSON.parse(storedCart);
        setCart(parsedCart);
        updateCartStats(parsedCart);
      } catch (error) {
        console.error('Error parsing stored cart data:', error);
        localStorage.removeItem('cart');
      }
    }
  }, []);

  // Update cart in localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartStats(cart);
  }, [cart]);

  // Update cart stats (item count and total)
  const updateCartStats = (cartItems) => {
    const count = cartItems.reduce((total, item) => total + item.quantity, 0);
    setItemCount(count);
    
    const cartTotal = cartItems.reduce((sum, item) => {
      const price = item.price || 0;
      const discount = item.discount || 0;
      const finalPrice = price * (1 - discount / 100);
      return sum + (finalPrice * item.quantity);
    }, 0);
    
    setTotal(cartTotal);
  };

  // Add item to cart
  const addToCart = (product, quantity = 1) => {
    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(item => item.id === product.id);
      
      if (existingItemIndex !== -1) {
        // If item already exists, update quantity
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity += quantity;
        return updatedCart;
      } else {
        // Otherwise add new item
        return [...prevCart, { ...product, quantity }];
      }
    });
  };

  // Remove item from cart
  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  // Update item quantity
  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCart(prevCart => 
      prevCart.map(item => 
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  // Clear cart
  const clearCart = () => {
    setCart([]);
  };

  const value = {
    cart,
    itemCount,
    total,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};