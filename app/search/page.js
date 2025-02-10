'use client';
import { useSearchParams } from 'next/navigation';
import { useProducts } from '../../contexts/ProductContext';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useState } from 'react';

export default function SearchPage() {
  const searchParams = useSearchParams(); // Client-side only
  const { products } = useProducts(); 
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Fetch query and filter products on mount and updates
  useEffect(() => {
    const searchQuery = searchParams.get('query')?.toLowerCase() || '';
    setQuery(searchQuery);

    // Dynamically filter products based on query
    if (products) {
      const filtered = products.filter((product) =>
        product.name.toLowerCase().includes(searchQuery)
      );
      setFilteredProducts(filtered);
    }
  }, [searchParams, products]);

  return (
    <div className="container mx-auto p-8 min-h-screen">
      <ToastContainer />

      <h1 className="text-4xl font-bold mb-8 text-center">Search Results for "{query}"</h1>

      {filteredProducts.length === 0 ? (
        <p className="text-center text-gray-600">No products found for "{query}".</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} router={router} />
          ))}
        </div>
      )}
    </div>
  );
}

function ProductCard({ product, router }) {
  const handleProductClick = () => {
    router.push(`/Product/${product._id}`);
  };

  return (
    <motion.div
      className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-transform transform hover:scale-105"
    >
      <div className="relative">
        <Image
          width={500}
          height={100}
          src={product.image}
          alt={product.name}
          className="product-image w-full h-60 object-cover rounded-t-xl cursor-pointer hover:opacity-90"
          onClick={handleProductClick}
        />
      </div>
      <div className="px-4 sm:px-6">
        <h2 className="text-xl sm:text-2xl font-bold mt-4 text-gray-800">{product.name}</h2>
        <p className="text-gray-500">Category: {product.category}</p>
      </div>
    </motion.div>
  );
}
