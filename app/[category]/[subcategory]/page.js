'use client';
import { useRouter } from 'next/navigation';
import { useProducts } from '../../../contexts/ProductContext';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiShoppingCart } from 'react-icons/fi';
import { useCart } from '../../../contexts/CartContext';
import Image from 'next/image';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Toastify styles

export default function SubcategoryPage({ params }) {
  const { category, subcategory } = params; // Access both category and subcategory
  const { products } = useProducts(); // Get products from context
  const { dispatch: cartDispatch } = useCart(); // Use cart context to manage cart
  const router = useRouter();

  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const filtered = products.filter(
      (product) =>
        product.category?.toLowerCase() === category.toLowerCase() &&
        product.subcategory?.toLowerCase() === subcategory.toLowerCase()
    );
    setFilteredProducts(filtered);
    setLoading(false); // Stop loading once products are filtered
  }, [category, subcategory, products]);

  const handleProductClick = (id) => {
    router.push(`/product/${id}`);
  };

  const handleAddToCart = (product) => {
    cartDispatch({ type: 'ADD_TO_CART', payload: product });

    // Show toast notification
    toast.success(
      <div className="flex items-center space-x-4">
        <Image
          width={50}
          height={50}
          src={product.image}
          alt={product.name}
          className="w-12 h-12 object-cover rounded-md shadow-md"
        />
        <div>
          <p className="text-sm font-medium">{product.name} added to cart!</p>
          <a
            href="/cart"
            className="text-yellow-600 hover:text-yellow-700 font-semibold underline"
          >
            View Cart
          </a>
        </div>
      </div>,
      {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      }
    );
  };

  const productVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
  };

  if (loading) {
    return <p className="text-center text-gray-600">Loading products...</p>;
  }

  if (filteredProducts.length === 0) {
    return <p className="text-center text-gray-600">No products found in this subcategory.</p>;
  }

  return (
    <div className="container mx-auto pt-36 p-6">
      {/* Toast Container */}
      <ToastContainer />

      <h1 className="text-3xl font-bold mb-6 capitalize">
        {subcategory} Products
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => {
          const salePrice =
            product.sale > 0
              ? (product.price - (product.price * product.sale) / 100).toFixed(2)
              : null;

          return (
            <motion.div
              key={product._id}
              className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-transform transform hover:scale-105"
              variants={productVariants}
              initial="hidden"
              animate="visible"
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
                        ${salePrice}
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
                <span>Add to Cart</span>
              </button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
