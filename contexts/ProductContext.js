'use client';
import { createContext, useContext, useReducer, useEffect } from 'react';
import Cookies from 'js-cookie'; // Import js-cookie

// Create ProductContext
const ProductContext = createContext();

// Reducer function for product actions
const productReducer = (state, action) => {
  switch (action.type) {
    case 'SET_PRODUCTS':
      return action.payload;
    case 'ADD_PRODUCT':
      return [...state, action.payload];
    case 'UPDATE_PRODUCT':
      return state.map((p) =>
        p._id === action.payload._id ? action.payload : p
      );
    case 'DELETE_PRODUCT':
      return state.filter((p) => p._id !== action.payload);
    default:
      return state;
  }
};

// ProductProvider Component
export const ProductProvider = ({ children }) => {
  const [products, dispatch] = useReducer(productReducer, []);

  // Fetch products from API or cookies
  useEffect(() => {
    const storedProducts = Cookies.get('products'); // Check if products exist in cookies

    if (storedProducts) {
      console.log('Loading products from cookies...');
      dispatch({ type: 'SET_PRODUCTS', payload: JSON.parse(storedProducts) });
    } else {
      console.log('Fetching products from API...');
      fetchProducts(); // Fetch from API if cookies don't exist
    }
  }, []);

  // Fetch products from the API and store them in cookies
  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      console.log('Fetched products:', data);

      dispatch({ type: 'SET_PRODUCTS', payload: data }); // Store in state
      Cookies.set('products', JSON.stringify(data), { expires: 1 }); // Store in cookies for 1 day
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  };

  // Add new product
  const addProduct = async (productData) => {
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });
      const newProduct = await res.json();
      dispatch({ type: 'ADD_PRODUCT', payload: newProduct });

      // Update cookies after adding a product
      updateCookies([...products, newProduct]);
    } catch (error) {
      console.error('Failed to add product:', error);
    }
  };

  // Update a product
  const updateProduct = async (id, updatedData) => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });
      const updatedProduct = await res.json();
      dispatch({ type: 'UPDATE_PRODUCT', payload: updatedProduct });

      // Update cookies after updating a product
      const updatedProducts = products.map((p) =>
        p._id === id ? updatedProduct : p
      );
      updateCookies(updatedProducts);
    } catch (error) {
      console.error('Failed to update product:', error);
    }
  };

  // Delete a product
  const deleteProduct = async (id) => {
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        dispatch({ type: 'DELETE_PRODUCT', payload: id });

        // Update cookies after deleting a product
        const updatedProducts = products.filter((p) => p._id !== id);
        updateCookies(updatedProducts);
      }
    } catch (error) {
      console.error('Failed to delete product:', error);
    }
  };

  // Helper function to update cookies
  const updateCookies = (productList) => {
    Cookies.set('products', JSON.stringify(productList), { expires: 1 });
  };

  return (
    <ProductContext.Provider value={{ products, addProduct, updateProduct, deleteProduct }}>
      {children}
    </ProductContext.Provider>
  );
};

// Hook to use ProductContext
export const useProducts = () => useContext(ProductContext);
