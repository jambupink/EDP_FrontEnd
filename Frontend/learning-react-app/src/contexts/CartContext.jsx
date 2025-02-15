import { createContext, useState, useContext } from 'react';
import UserContext from '../contexts/UserContext';
import http from '../http';

// Create the CartContext
const CartContext = createContext();

export const useCart = () => useContext(CartContext);

// Provide Cart Context to components
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const { user } = useContext(UserContext);

  // Add product to the cart
  const addToCart = (item, product) => {
    console.log('Adding to cart:', item, product); // Debugging statement
  
    // Check if item has all required fields
    if (!item || !item.variantId || !item.productName) {
      console.error("Item is missing required fields: ", item);
      return;
    }
  
    if (!product || !product.id) {
      console.error('Product is not defined or does not have an id.');
      return; // Exit the function early if product is invalid
    }
  
    const cartItem = {
      variantId: item.variantId, // Ensure variantId is properly passed
      productId: item.productId, // Using item.productId
      productName: item.productName,
      imageFile: item.imageFile,
      quantity: item.quantity || 1, // Use quantity from item, default to 1 if not provided
      price: item.price, // Add price if needed
      stock: item.stock  // Add stock if needed
    };
  
    setCart((prevCart) => [...prevCart, cartItem]);
  
    if (user?.id) {
      http.post(`/cart`, [cartItem]) // Ensure it's an array
        .then((res) => console.log('Item added to backend cart', res))
        .catch((error) => console.error('Error adding item to backend cart:', error));
    }
  };
  
  

  
  

  // Remove product from the cart
  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter(item => item.id !== productId));
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};


