import React, { createContext, useState, useEffect } from 'react';
import { getCart, addToCart, updateCartItem, removeFromCart, clearCart } from '../api/cartApi';
import { useAuth } from '../hooks/useAuth';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], total: 0, itemCount: 0 });
  const [loading, setLoading] = useState(false);
  const { user, isAuthenticated } = useAuth();

  // Load cart from localStorage or server depending on auth status
  useEffect(() => {
    const loadCart = async () => {
      setLoading(true);
      try {
        if (isAuthenticated) {
          // Fetch cart from server for logged in users
          const serverCart = await getCart();
          setCart(serverCart);
        } else {
          // Load cart from localStorage for guest users
          const localCart = JSON.parse(localStorage.getItem('cart')) || { items: [], total: 0, itemCount: 0 };
          setCart(localCart);
        }
      } catch (error) {
        console.error('Failed to load cart', error);
      } finally {
        setLoading(false);
      }
    };

    loadCart();
  }, [isAuthenticated]);

  // Save cart to localStorage for guest users
  useEffect(() => {
    if (!isAuthenticated && cart) {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart, isAuthenticated]);

  const addItem = async (product, quantity = 1) => {
    setLoading(true);
    try {
      if (isAuthenticated) {
        // Add to server cart for logged in users
        const updatedCart = await addToCart(product._id, quantity);
        setCart(updatedCart);
      } else {
        // Update local cart for guest users
        const existingItem = cart.items.find(item => item.product._id === product._id);
        
        if (existingItem) {
          // Update quantity if item already in cart
          const updatedItems = cart.items.map(item => 
            item.product._id === product._id 
              ? { ...item, quantity: item.quantity + quantity } 
              : item
          );
          
          const newTotal = updatedItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
          const newItemCount = updatedItems.reduce((count, item) => count + item.quantity, 0);
          
          setCart({
            items: updatedItems,
            total: newTotal,
            itemCount: newItemCount
          });
        } else {
          // Add new item to cart
          const newItem = {
            product,
            quantity
          };
          
          const newItems = [...cart.items, newItem];
          const newTotal = newItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
          const newItemCount = newItems.reduce((count, item) => count + item.quantity, 0);
          
          setCart({
            items: newItems,
            total: newTotal,
            itemCount: newItemCount
          });
        }
      }
    } catch (error) {
      console.error('Failed to add item to cart', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateItem = async (productId, quantity) => {
    if (quantity < 1) return;
    
    setLoading(true);
    try {
      if (isAuthenticated) {
        // Update server cart for logged in users
        const updatedCart = await updateCartItem(productId, quantity);
        setCart(updatedCart);
      } else {
        // Update local cart for guest users
        const updatedItems = cart.items.map(item => 
          item.product._id === productId 
            ? { ...item, quantity } 
            : item
        );
        
        const newTotal = updatedItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
        const newItemCount = updatedItems.reduce((count, item) => count + item.quantity, 0);
        
        setCart({
          items: updatedItems,
          total: newTotal,
          itemCount: newItemCount
        });
      }
    } catch (error) {
      console.error('Failed to update cart item', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (productId) => {
    setLoading(true);
    try {
      if (isAuthenticated) {
        // Remove from server cart for logged in users
        const updatedCart = await removeFromCart(productId);
        setCart(updatedCart);
      } else {
        // Remove from local cart for guest users
        const updatedItems = cart.items.filter(item => item.product._id !== productId);
        const newTotal = updatedItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
        const newItemCount = updatedItems.reduce((count, item) => count + item.quantity, 0);
        
        setCart({
          items: updatedItems,
          total: newTotal,
          itemCount: newItemCount
        });
      }
    } catch (error) {
      console.error('Failed to remove item from cart', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const clear = async () => {
    setLoading(true);
    try {
      if (isAuthenticated) {
        // Clear server cart for logged in users
        await clearCart();
      }
      // Reset cart state
      setCart({ items: [], total: 0, itemCount: 0 });
      // Clear localStorage cart for both guest and authenticated users
      localStorage.removeItem('cart');
    } catch (error) {
      console.error('Failed to clear cart', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        addItem,
        updateItem,
        removeItem,
        clear,
        itemCount: cart.itemCount,
        total: cart.total,
        items: cart.items,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
