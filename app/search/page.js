'use client';
import { useSearchParams } from 'next/navigation'; // Hook to get search params
import { useProducts } from '../../contexts/ProductContext';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function SearchPage() {
  const searchParams = useSearchParams(); // Get search query from URL
  const query = searchParams.get('query')?.toLowerCase(); // Extract the search query
  const { products } = useProducts(); // Fetch products from context
  const router = useRouter();

  // Filter products based on the search query
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(query)
  );

  const handleProductClick = (id) => {
    router.push(`/Product/${id}`);
  };

  const productVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
  };

  return (
    <div className="container mx-auto p-8 min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-center">Search Results</h1>

      {filteredProducts.length === 0 ? (
        <p className="text-center text-gray-600">No products found for "{query}".</p>
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
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-60 object-cover rounded-md cursor-pointer hover:opacity-90"
                onClick={() => handleProductClick(product._id)}
              />
              <h2 className="text-2xl font-bold mt-4">{product.name}</h2>
              <p className="text-gray-600 mt-2">Price: ${product.price}</p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
