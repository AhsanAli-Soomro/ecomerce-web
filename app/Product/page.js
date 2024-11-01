'use client';
import { useState } from 'react'; // Import useState to handle category and subcategory selection
import { useProducts } from '../../contexts/ProductContext';
import { useCart } from '../../contexts/CartContext';
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify'; // Import react-toastify
import 'react-toastify/dist/ReactToastify.css'; // Import toastify styles
import { motion } from 'framer-motion';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/20/solid';
import Image from 'next/image';
import { FiShoppingCart } from 'react-icons/fi';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from 'react-slick';


export default function HomePage() {
  const { products } = useProducts();
  const { dispatch: cartDispatch } = useCart();
  const router = useRouter();

  const [selectedCategory, setSelectedCategory] = useState('All'); // Track selected category
  const [selectedSubcategory, setSelectedSubcategory] = useState('All'); // Track selected subcategory
  const [categoryOpen, setCategoryOpen] = useState(true);
  const [subcategoryOpen, setSubcategoryOpen] = useState(true);

  const handleAddToCart = (product) => {
    cartDispatch({ type: 'ADD_TO_CART', payload: product });

    // Show toast notification
    toast.success(
      <div className="flex items-center space-x-4 p-2">
        {/* Product Image */}
        <div className="flex-shrink-0">
          <Image
            width={500}
            height={100}
            src={product.image}
            alt={product.name}
            className="w-16 h-16 object-cover rounded-md shadow-md hover:shadow-lg transition-shadow"
          />
        </div>

        {/* Product Info and Cart Link */}
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

  // Calculate average rating from product's ratings array
  const calculateAverageRating = (ratings) => {
    if (!ratings || ratings.length === 0) return 0;
    const total = ratings.reduce((sum, rating) => sum + rating.rating, 0);
    return (total / ratings.length).toFixed(1); // Return the average as a float (e.g., 4.2)
  };

  const renderStars = (averageRating) => {
    return (
      <div className="stars flex">
        {Array.from({ length: 5 }, (_, i) => (
          <span key={i} style={{ color: i < averageRating ? '#ffc107' : '#e4e5e9', fontSize: '24px', marginRight: '2px' }}>
            ★
          </span>
        ))}
      </div>
    );
  };

  // Get unique categories and subcategories
  const uniqueCategories = [...new Set(products.map((product) => product.category))];
  const uniqueSubcategories = [
    // 'All',
    ...new Set(
      products
        .filter((product) => selectedCategory === 'All' || product.category === selectedCategory)
        .map((product) => product.subcategory)
    ),
  ];

  // Filter products based on selected category and subcategory
  const filteredProducts = products.filter(
    (product) =>
      (selectedCategory === 'All' || product.category === selectedCategory) &&
      (selectedSubcategory === 'All' || product.subcategory === selectedSubcategory)
  );

  const dropdownVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { opacity: 1, height: 'auto', transition: { duration: 0.3 } },
  };

  const containerVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
  };

  const productVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
  };

  const toggleCategory = () => setCategoryOpen(!categoryOpen);
  const toggleSubcategory = () => setSubcategoryOpen(!subcategoryOpen);

  return (
    <div className="homepage-container container mx-auto py-4 sm:py-8 min-h-screen">
      <ToastContainer />
      {/* <motion.h1
    className="text-3xl sm:text-5xl font-extrabold text-center text-gray-800 mb-8 sm:mb-12 tracking-tight"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 1 }}
  >
    Product List
  </motion.h1> */}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 relative">
        {/* Filter Sidebar */}
        <motion.aside
          className="col-span-1 bg-white p-6 sm:p-8 rounded-xl shadow-lg lg:sticky top-8 z-10 lg:z-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{ minWidth: "100%" }} // Ensure full width on small screens
        >
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">Filters</h2>

          {/* Category Filter */}
          <div className="mb-6">
            <button
              onClick={toggleCategory}
              className="flex items-center justify-between w-full text-lg font-semibold text-gray-600 mb-2 focus:outline-none"
            >
              Filter by Category
              {categoryOpen ? (
                <ChevronUpIcon className="h-6 w-6 text-gray-500" />
              ) : (
                <ChevronDownIcon className="h-6 w-6 text-gray-500" />
              )}
            </button>
            {categoryOpen && (
              <div className="space-y-4 pl-4">
                {['All', ...uniqueCategories].map((category, index) => (
                  <div key={index} className="flex items-center">
                    <input
                      id={`filter-category-${index}`}
                      name="category"
                      type="checkbox"
                      value={category}
                      checked={selectedCategory === category}
                      onChange={() => {
                        setSelectedCategory(category);
                        setSelectedSubcategory('All');
                      }}
                      className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <label
                      htmlFor={`filter-category-${index}`}
                      className="ml-3 text-lg text-gray-600 capitalize"
                    >
                      {category}
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Subcategory Filter */}
          <div className="mb-6">
            <button
              onClick={toggleSubcategory}
              className="flex items-center justify-between w-full text-lg font-semibold text-gray-600 mb-2 focus:outline-none"
            >
              Filter by Subcategory
              {subcategoryOpen ? (
                <ChevronUpIcon className="h-6 w-6 text-gray-500" />
              ) : (
                <ChevronDownIcon className="h-6 w-6 text-gray-500" />
              )}
            </button>
            {subcategoryOpen && (
              <div className="space-y-4 pl-4">
                {['All', ...uniqueSubcategories].map((subcategory, index) => (
                  <div key={index} className="flex items-center">
                    <input
                      id={`filter-subcategory-${index}`}
                      name="subcategory"
                      type="checkbox"
                      value={subcategory}
                      checked={selectedSubcategory === subcategory}
                      onChange={() => setSelectedSubcategory(subcategory)}
                      className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <label
                      htmlFor={`filter-subcategory-${index}`}
                      className="ml-3 text-lg text-gray-600 capitalize"
                    >
                      {subcategory}
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.aside>

        {/* Product Grid */}
        <div className="col-span-1 lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-10">
          {filteredProducts.map((product) => {
            const salePrice = product.price - (product.price * product.sale) / 100;

            return (
              <motion.div
                key={product._id}
                className="product-card bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2 hover:scale-105 relative"
                variants={productVariants}
                initial="hidden"
                animate="visible"
                whileHover={{ scale: 1.05 }}
              >
                <div className="relative">
                  {product.images && product.images.length > 0 ? (
                    <Slider dots infinite speed={500} slidesToShow={1} slidesToScroll={1}>
                      {product.images.map((imgUrl, index) => (
                        <div key={index}>
                          <Image
                            width={500}
                            height={100}
                            src={imgUrl}
                            alt={`${product.name} Image ${index + 1}`}
                            className="w-full h-60 object-cover rounded-t-xl cursor-pointer hover:opacity-90 transition-opacity"
                            onClick={() => handleProductClick(product._id)}
                          />
                        </div>
                      ))}
                    </Slider>
                  ) : (
                    <Image
                      width={500}
                      height={100}
                      src={product.image} // Fallback single image
                      alt={product.name}
                      className="w-full h-60 object-cover rounded-t-xl cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => handleProductClick(product._id)}
                    />
                  )}

                  {product.sale > 0 && (
                    <span className="absolute top-3 right-3 bg-yellow-500 text-white text-sm font-semibold px-2 py-1 rounded-full">
                      {product.sale}% OFF
                    </span>
                  )}
                </div>


                <div className="px-4 sm:px-6">
                  <h2 className="product-name line-clamp-1 text-xl sm:text-2xl font-bold mt-2 text-gray-800 tracking-tight">
                    {product.name}
                  </h2>
                  <p className="product-category text-gray-500">
                    Category: <span className="text-gray-800">{product.category}</span>
                  </p>

                  <div className="flex items-center space-x-2 mt-2">
                    {product.sale > 0 ? (
                      <>
                        <p className="text-gray-400 line-through">
                          ${product.price ? product.price.toFixed(2) : '0.00'}
                        </p>
                        <p className="text-lg font-semibold text-yellow-500">
                          ${salePrice.toFixed(2)}
                        </p>
                      </>
                    ) : (
                      <p className="text-lg font-semibold text-gray-800">
                        ${product.price ? product.price.toFixed(2) : '0.00'}
                      </p>
                    )}
                  </div>


                  <div className="product-rating flex items-center space-x-1 mt-2">
                    {renderStars(calculateAverageRating(product.ratings))}
                    <span className="text-sm text-gray-600">({product.ratings?.length || 0})</span>
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
      </div>
    </div>


  );
}
