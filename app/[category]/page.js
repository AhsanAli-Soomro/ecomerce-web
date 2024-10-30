'use client';
import { useRouter } from 'next/navigation';
import { useProducts } from '../../contexts/ProductContext';
import { motion } from 'framer-motion';
import { FiShoppingCart } from 'react-icons/fi';
import { useCart } from '../../contexts/CartContext';
import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function CategoryPage({ params }) {
  const { products } = useProducts(); // Get products from context
  const { dispatch: cartDispatch } = useCart(); // Use cart context to manage cart
  const router = useRouter();
  const [filteredProducts, setFilteredProducts] = useState([]);

  const category = params.category; // Get the category from route parameters

  // Filter products based on the category
  useEffect(() => {
    if (category) {
      const filtered = products.filter(
        (product) => product.category.toLowerCase() === category.toLowerCase()
      );
      setFilteredProducts(filtered);
    }
  }, [category, products]);

  const handleAddToCart = (product) => {
    cartDispatch({ type: 'ADD_TO_CART', payload: product });
  };

  const handleProductClick = (id) => {
    router.push(`/Product/${id}`);
  };

  const productVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
  };

  return (
    <div className="container mx-auto p-8 min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-center">
        {category ? `${category} Products` : 'Loading...'}
      </h1>

      {filteredProducts.length === 0 ? (
        <p className="text-center text-gray-600">No products found in this category.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredProducts.map((product) => (
            <motion.div
              key={product._id}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-transform transform hover:scale-105"
              variants={productVariants}
              initial="hidden"
              animate="visible"
            >
              <Image
                src={product.image}
                alt={product.name}
                width={500}
                height={100}
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
      )}
    </div>
  );
}
