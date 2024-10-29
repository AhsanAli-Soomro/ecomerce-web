'use client';
import { motion } from 'framer-motion';
import { useProducts } from '../../contexts/ProductContext';

export default function LatestProductsScroll() {
  const { products } = useProducts(); // Fetch products from context

  // Sort products by creation date (assuming `createdAt` field exists)
  const latestProducts = [...products].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  if (latestProducts.length === 0) {
    return <p className="text-center py-8">No products available!</p>;
  }

  return (
    <div className="container mx-auto relative overflow-hidden w-full bg-gray-100 py-6">
      {/* Two identical sections for continuous scrolling */}
      <motion.div
        className="flex space-x-8 animate-scroll"
        initial={{ x: 0 }}
        animate={{ x: '-100%' }}
        transition={{
          repeat: Infinity,
          duration: latestProducts.length * 8, // Adjust speed
          ease: 'linear',
        }}
      >
        {latestProducts.concat(latestProducts).map((product, index) => (
          <div
            key={`${product._id}-${index}`}
            className="min-w-[200px] bg-white rounded-lg shadow-md hover:shadow-xl transform hover:scale-105 transition cursor-pointer relative overflow-hidden"
          >
            {/* Product Image */}
            <img
              src={product.image}
              alt={product.name}
              className="h-48 w-full object-cover"
            />
            {/* Product Info Overlay */}
            <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-50 text-white p-3">
              <h3 className="font-bold text-lg truncate">{product.name}</h3>
              <p className="text-yellow-400 font-semibold text-md mt-1">
                ${product.price.toFixed(2)}
              </p>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
