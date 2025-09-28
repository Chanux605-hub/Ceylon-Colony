import { createContext, useState, useEffect, useContext } from 'react';

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  const [cartCount, setCartCount] = useState(0);
  
  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem('cartItems');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  // Update cart count whenever cartItems changes
  useEffect(() => {
    const count = Object.values(cartItems).reduce((total, qty) => total + qty, 0);
    setCartCount(count);
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (itemId) => {
    setCartItems(prev => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1
    }));
  };

  const removeFromCart = (itemId) => {
    setCartItems(prev => {
      const newCart = {...prev};
      if (newCart[itemId] > 1) {
        newCart[itemId] -= 1;
      } else {
        delete newCart[itemId];
      }
      return newCart;
    });
  };

  const getTotalCartAmount = (products) => {
    return Object.entries(cartItems).reduce((total, [itemId, quantity]) => {
      const item = products.find(p => p.id === itemId);
      return total + (item ? item.price * quantity : 0);
    }, 0);
  };

  const contextValue = {
    cartItems,
    cartCount,
    addToCart,
    removeFromCart,
    getTotalCartAmount
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;