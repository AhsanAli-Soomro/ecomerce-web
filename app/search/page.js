'use client';
import { useSearchParams } from 'next/navigation'; // Hook to get search params
import { useProducts } from '../../contexts/ProductContext';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useCart } from '@/contexts/CartContext';
import { FiShoppingCart } from 'react-icons/fi'; // Import cart icon
import { toast, ToastContainer } from 'react-toastify'; // Toast notifications
import 'react-toastify/dist/ReactToastify.css'; // Toast styles

export default function SearchPage() {
  const searchParams = useSearchParams(); // Get search query from URL
  const query = searchParams.get('query')?.toLowerCase(); // Extract search query
  const { products } = useProducts(); // Fetch products from context
  const router = useRouter();
  const { dispatch: cartDispatch } = useCart();

  // Check if products exist to prevent errors
  const filteredProducts = products
    ? products.filter((product) =>
      product.name.toLowerCase().includes(query)
    )
    : [];

  const handleAddToCart = (product) => {
    cartDispatch({ type: 'ADD_TO_CART', payload: product });

    // Show toast notification
    toast.success(
      <div className="flex items-center space-x-4 p-2">
        <div className="flex-shrink-0">
          <Image
            width={60}
            height={60}
            src={product.image}
            alt={product.name}
            className="w-16 h-16 object-cover rounded-md shadow-md hover:shadow-lg transition-shadow"
          />
        </div>
        <div className="flex flex-col">
          <p className="text-sm sm:text-base font-medium text-gray-800">
            {product.name} added to your cart!
          </p>
          <a
            href="/cart"
            className="text-yellow-600 font-semibold underline hover:text-yellow-700 transition-colors mt-1 flex items-center space-x-1"
          >
            <FiShoppingCart size={18} />
            <span>View Cart</span>
          </a>
        </div>
      </div>,
      {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      }
    );
  };

  const handleProductClick = (id) => {
    router.push(`/Product/${id}`);
  };

  return (
    <div className="container mx-auto p-8 min-h-screen">
      <ToastContainer />

      <h1 className="text-4xl font-bold mb-8 text-center">Search Results</h1>

      {filteredProducts.length === 0 ? (
        <p className="text-center text-gray-600">
          No products found for "{query}".
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredProducts.map((product) => {
            const salePrice =
              product.price - (product.price * product.sale) / 100;

            return (
              <motion.div
                key={product._id}
                className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-transform transform hover:scale-105"
              >
                <div className="relative">
                  {/* Product Image */}
                  <Image
                    width={500}
                    height={100}
                    src={product.image}
                    alt={product.name}
                    className="product-image w-full h-60 object-cover rounded-t-xl cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => handleProductClick(product._id)}
                  />
                  {product.sale > 0 && (
                    <span className="absolute top-3 right-3 bg-yellow-500 text-white text-sm font-semibold px-2 py-1 rounded-full">
                      {product.sale}% OFF
                    </span>
                  )}
                </div>
                <div className="px-4 sm:px-6">
                  <h2 className="text-xl sm:text-2xl font-bold mt-4 text-gray-800 tracking-tight">
                    {product.name}
                  </h2>
                  <p className="text-gray-500">
                    Category:{" "}
                    <span className="text-gray-800">{product.category}</span>
                  </p>
                  <div className="flex items-center space-x-2 mt-2">
                    {product.sale > 0 ? (
                      <>
                        <p className="text-gray-400 line-through">
                          ${product.price.toFixed(2)}
                        </p>
                        <p className="text-lg font-semibold text-yellow-500">
                          ${salePrice.toFixed(2)}
                        </p>
                      </>
                    ) : (
                      <p className="text-lg font-semibold text-gray-800">
                        ${product.price.toFixed(2)}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => handleAddToCart(product)}
                  className="text-white w-full mt-6 font-semibold py-3 px-8 rounded-b-lg shadow-lg bg-gradient-to-r from-yellow-500 to-yellow-600 
                             hover:from-yellow-600 hover:to-yellow-700 hover:text-gray-900 transition-transform transform hover:scale-105 
                             focus:outline-none focus:ring-4 focus:ring-yellow-300"
                >
                  Add to Cart
                </button>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

