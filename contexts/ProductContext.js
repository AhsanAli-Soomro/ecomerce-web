'use client';
import { createContext, useContext, useReducer, useEffect } from 'react';

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

  // Fetch products on mount
  useEffect(() => {
    console.log('Fetching products...');
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        console.log('Fetched products:', data);
        dispatch({ type: 'SET_PRODUCTS', payload: data });
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    };
    fetchProducts();
  }, []);
    

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
      }
    } catch (error) {
      console.error('Failed to delete product:', error);
    }
  };

  return (
    <ProductContext.Provider value={{ products, addProduct, updateProduct, deleteProduct }}>
      {children}
    </ProductContext.Provider>
  );
};

// Hook to use ProductContext
export const useProducts = () => useContext(ProductContext);
