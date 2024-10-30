'use client';
import { useRouter } from 'next/navigation';
import { useProducts } from '../../../contexts/ProductContext';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiShoppingCart } from 'react-icons/fi';
import { useCart } from '../../../contexts/CartContext';
import Image from 'next/image';


export default function SubcategoryPage({ params }) {
  const { category, subcategory } = params; // Access both category and subcategory
  const { products } = useProducts();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const { dispatch: cartDispatch } = useCart(); // Use cart context to manage cart
  const router = useRouter();

  useEffect(() => {
    const filtered = products.filter(
      (product) =>
        product.category?.toLowerCase() === category.toLowerCase() &&
        product.subcategory?.toLowerCase() === subcategory.toLowerCase()
    );
    setFilteredProducts(filtered);
  }, [category, subcategory, products]);

  const handleProductClick = (id) => {
    router.push(`/product/${id}`);
  };

  if (filteredProducts.length === 0) {
    return <p>No products found in this subcategory.</p>;
  }

  const handleAddToCart = (product) => {
    cartDispatch({ type: 'ADD_TO_CART', payload: product });
  };

  const productVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 capitalize">
        {subcategory} Products
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
            <motion.div
            key={product._id}
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-transform transform hover:scale-105"
            variants={productVariants}
            initial="hidden"
            animate="visible"
          >
            <Image
            width={500}
            height={100}
              src={product.image}
              alt={product.name}
              className="w-full h-60 object-cover rounded-md cursor-pointer hover:opacity-90"
              onClick={() => handleProductClick(product._id)}
            />
            <h2 className="text-2xl font-bold mt-4">{product.name}</h2>
            <p className="text-gray-600 mt-2">Price: ${product.price}</p>
            <button
              onClick={() => handleAddToCart(product)}
              className="mt-4 w-full bg-yellow-500 hover:bg-yellow-600 text-black py-2 px-4 rounded-lg transition"
            >
              Add to Cart <FiShoppingCart className="inline ml-2" />
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
