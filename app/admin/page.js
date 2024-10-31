'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useProducts } from '../../contexts/ProductContext'; // Import the ProductContext
import { PencilIcon, TrashIcon } from '@heroicons/react/20/solid';
const ITEMS_PER_PAGE = 10;
export default function AdminPage() {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts(); // Use context functions
  const router = useRouter();
  const [product, setProduct] = useState({
    name: '',
    category: '',
    subcategory: '',
    price: '',
    sale: '',
    description: '',
    image: '',
    // image1: '',
  });

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editProductId, setEditProductId] = useState(null);
  const [activeStep, setActiveStep] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentProducts = products.slice(startIndex, endIndex);

  // Calculate the total number of pages
  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);

  // Pagination handlers
  const handleNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const handlePreviousPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));


  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isAdminLoggedIn'); // Check login status
    if (!isLoggedIn) {
      router.push('/adminlogin'); // Redirect to login page if not logged in
    }
  }, [router]);

  const handleInputChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', 'ecomerce-web'); // Cloudinary preset

    setLoading(true);
    try {
      const res = await fetch('https://api.cloudinary.com/v1_1/dodyzgste/image/upload', {
        method: 'POST',
        body: data,
      });

      const result = await res.json();
      if (res.ok && result.secure_url) {
        setProduct((prev) => ({ ...prev, image: result.secure_url }));
        setMessage('Image uploaded successfully!');
      } else {
        setMessage(`Image upload failed: ${result.error?.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Image upload error:', error);
      setMessage('Image upload failed: Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!product.name || !product.category || !product.subcategory || !product.price || !product.image) {
      setMessage('All fields are required');
      return;
    }

    if (isEditing) {
      updateProduct(editProductId, product); // Update product if in edit mode
      setMessage('Product updated successfully!');
    } else {
      addProduct(product); // Add new product
      setMessage('Product uploaded successfully!');
    }

    // Reset form state
    setProduct({ name: '', category: '', subcategory: '', price: '', sale: '', description: '', image: '' });
    setIsEditing(false);
    setEditProductId(null);
  };

  const handleEdit = (product) => {
    setProduct(product);
    setIsEditing(true);
    setEditProductId(product._id);
  };

  const handleCancelEdit = () => {
    setProduct({ name: '', subcategory: '', category: '', subcategory: '', price: '', sale: '', description: '', image: '' });
    setIsEditing(false);
    setEditProductId(null);
  };

  const handleDelete = (id) => {
    deleteProduct(id); // Delete product by ID
    setMessage('Product deleted successfully!');
  };

  const handleChangePassword = () => {
    router.push('/adminlogin?step=update'); // Redirect to update credentials step
  };

  return (
    <div className="min-h-screen pt-8">
      {/* Header */}
      <div className="flex fixed top-32 right-10 items-center justify-end w-full gap-4">
        <button
          onClick={handleChangePassword}
          className="mt-6 text-gray-700 hover:text-red-600 font-semibold transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-red-300"
        >
          Change Password
        </button>
        <button
          onClick={() => {
            localStorage.removeItem('isAdminLoggedIn'); // Clear login state
            router.push('/adminlogin'); // Redirect to login page
          }}
          className="mt-6 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-md font-semibold shadow-md transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-red-300"
        >
          Logout
        </button>
      </div>

      {/* Stepper */}
      <div className="flex justify-center  mb-8">
        <div className="flex space-x-8 z-10">
          <button
            onClick={() => setActiveStep(1)}
            className={`pb-2 text-lg font-semibold border-b-4 ${activeStep === 1 ? 'border-yellow-500 text-yellow-600' : 'border-transparent text-gray-500'
              } transition`}
          >
            Upload Product
          </button>
          <button
            onClick={() => setActiveStep(2)}
            className={`pb-2 text-lg font-semibold border-b-4 ${activeStep === 2 ? 'border-yellow-500 text-yellow-600' : 'border-transparent text-gray-500'
              } transition`}
          >
            Product List
          </button>
        </div>
      </div>

      {/* Step 1: Upload Product */}
      {activeStep === 1 && (
        <div className="max-w-4xl mx-auto bg-white p-6 shadow-md rounded-md">
          <h1 className="text-2xl font-bold mb-4 text-center">
            Admin Panel - {isEditing ? 'Edit Product' : 'Upload Product'}
          </h1>
          {message && <p className="text-green-500 text-center mb-4">{message}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Product Name"
              value={product.name}
              onChange={handleInputChange}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:ring focus:ring-yellow-400"
            />
            <input
              type="text"
              name="category"
              placeholder="Category"
              value={product.category}
              onChange={handleInputChange}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:ring focus:ring-yellow-400"
            />
            <input
              type="text"
              name="subcategory"
              placeholder="Subcategory"
              value={product.subcategory}
              onChange={handleInputChange}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:ring focus:ring-yellow-400"
            />
            <input
              type="number"
              name="price"
              placeholder="Price"
              value={product.price}
              onChange={handleInputChange}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:ring focus:ring-yellow-400"
            />
            <input
              type="number"
              name="sale"
              placeholder="Sale Off"
              value={product.sale}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring focus:ring-yellow-400"
            />
            <textarea
              name="description"
              placeholder="Description"
              value={product.description}
              onChange={handleInputChange}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:ring focus:ring-yellow-400"
            ></textarea>
            <input
              type="file"
              onChange={handleImageChange}
              className="w-full p-3 border border-gray-300 rounded-md"
            />
            {loading && <p className="text-yellow-500">Uploading image...</p>}

            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={loading}
                className={`w-full bg-yellow-500 text-white font-semibold py-3 rounded-md transition ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-yellow-600'
                  }`}
              >
                {isEditing ? 'Update Product' : 'Upload Product'}
              </button>
              {isEditing && (
                <button
                  onClick={handleCancelEdit}
                  className="w-full bg-gray-500 text-white font-semibold py-3 rounded-md hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {/* Step 2: Product List */}
      {activeStep === 2 && (
        <div className="max-w-4xl mx-auto bg-white p-6 shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Product List</h2>
      
      <ul className="space-y-4">
        {currentProducts.map((p) => (
          <li
            key={p._id}
            className="flex items-center justify-between bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <img
                  src={p.image || '/placeholder.png'}
                  alt={p.name}
                  className="w-16 h-16 rounded-md object-cover border border-gray-200"
                />
              </div>
              <div>
                <strong className="text-lg font-semibold text-gray-800">{p.name}</strong>
                <p className="text-sm text-gray-600">
                  {p.subcategory} - {p.category}
                </p>
                <p className="text-sm text-gray-600">
                  Price: <span className="font-semibold">${p.price}</span> 
                  {p.sale && (
                    <span className="ml-2 text-red-500">({p.sale}% off)</span>
                  )}
                </p>
              </div>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => handleEdit(p)}
                className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition"
              >
                <PencilIcon className="h-5 w-5" aria-hidden="true" />
              </button>
              <button
                onClick={() => handleDelete(p._id)}
                className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600 transition"
              >
                <TrashIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Pagination Controls */}
      <div className="flex justify-center mt-6 space-x-4">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className={`px-4 py-2 bg-gray-200 rounded-md ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-300'}`}
        >
          Previous
        </button>
        
        <span className="text-gray-700 font-semibold">
          Page {currentPage} of {totalPages}
        </span>

        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 bg-gray-200 rounded-md ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-300'}`}
        >
          Next
        </button>
      </div>
    </div>
      )}
    </div>
  );
}
