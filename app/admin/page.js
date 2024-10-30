'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useProducts } from '../../contexts/ProductContext'; // Import the ProductContext

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
  });

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editProductId, setEditProductId] = useState(null);

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
    <div className="min-h-screen p-8">
      <div className="flex items-center justify-end w-full gap-4">
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

      <div className="max-w-4xl mx-auto bg-white p-6 shadow-md rounded-md">
        {/* Header */}
        <h1 className="text-2xl font-bold mb-4 text-center">
          Admin Panel - {isEditing ? 'Edit Product' : 'Upload Product'}
        </h1>
        {message && <p className="text-green-500 text-center mb-4">{message}</p>}

        {/* Product Form */}
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
            // required
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

        {/* Product List */}
        <h2 className="text-xl font-bold mt-8 mb-4 text-center">Product List</h2>
        <ul className="space-y-4">
          {products.map((p) => (
            <li
              key={p._id}
              className="flex items-center justify-between bg-gray-50 p-4 rounded-md shadow-sm"
            >
              <div>
                <strong className="block text-lg">{p.name}</strong>
                <span className="block text-sm text-gray-600">
                  {p.subcategory} - {p.category} - ${p.price} - ${p.sale}%
                </span>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(p)}
                  className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(p._id)}
                  className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>

  );
}
