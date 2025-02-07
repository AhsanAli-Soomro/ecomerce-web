'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useProducts } from '../../contexts/ProductContext';
import { CheckCircleIcon, ClockIcon, PencilIcon, PrinterIcon, TrashIcon } from '@heroicons/react/20/solid';
const ITEMS_PER_PAGE = 10;
export default function AdminPage() {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
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
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editProductId, setEditProductId] = useState(null);
  const [activeStep, setActiveStep] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentProducts = products.slice(startIndex, endIndex);
  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);

  const handleNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const handlePreviousPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));


  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isAdminLoggedIn');
    if (!isLoggedIn) {
      router.push('/adminlogin');
    }
  }, [router]);

  const handleInputChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', 'ecomerce-web');

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
      updateProduct(editProductId, product);
      setMessage('Product updated successfully!');
    } else {
      addProduct(product);
      setMessage('Product uploaded successfully!');
    }

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
    deleteProduct(id);
    setMessage('Product deleted successfully!');
  };

  const handleChangePassword = () => {
    router.push('/adminlogin?step=update');
  };


  useEffect(() => {
    fetchOrders('pending');
  }, [activeStep]);

  const fetchOrders = async (filter = 'all') => {
    setLoadingOrders(true);
    try {
      const res = await fetch('/api/orders');
      let data = await res.json();

      if (filter === 'pending') {
        data = data.filter((order) => order.status === 'pending');
      } else if (filter === 'completed') {
        data = data.filter((order) => order.status === 'completed');
      }

      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoadingOrders(false);
    }
  };


  const handleCompleteOrder = async (orderId) => {
    try {
      const res = await fetch('/api/orders', {
        method: 'PATCH',
        body: JSON.stringify({ orderId, status: 'completed' }),
        headers: { 'Content-Type': 'application/json' },
      });
      if (res.ok) {
        setMessage('Order completed successfully!');
        fetchOrders('completed');
      }
    } catch (error) {
      console.error('Error completing order:', error);
    }
  };

  const handlePendingOrder = async (orderId) => {
    try {
      const res = await fetch('/api/orders', {
        method: 'PATCH',
        body: JSON.stringify({ orderId, status: 'pending' }),
        headers: { 'Content-Type': 'application/json' },
      });
      if (res.ok) {
        setMessage('Order pending successfully!');
        fetchOrders('pending');
      }
    } catch (error) {
      console.error('Error pending order:', error);
    }
  };


  const handleDeleteOrder = async (orderId) => {
    try {
      const res = await fetch('/api/orders', {
        method: 'DELETE',
        body: JSON.stringify({ orderId }),
        headers: { 'Content-Type': 'application/json' },
      });
      if (res.ok) {
        setMessage('Order deleted successfully!');
        fetchOrders();
      }
    } catch (error) {
      console.error('Error deleting order:', error);
    }
  };


  const handlePrint = (order) => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
      <head><title>Order - ${order.orderId}</title></head>
      <body>
        <h1>Order Details - ${order.orderId}</h1>
        <p><strong>Customer Name:</strong> ${order.name}</p>
        <p><strong>Email:</strong> ${order.email}</p>
        <p><strong>Phone:</strong> ${order.userphone}</p>
        <h3>Shipping Address</h3>
        <p>${order.address}, ${order.city}, ${order.state}, ${order.country}, ${order.postalCode}</p>
        <h3>Order Summary</h3>
        <ul>
          ${order.cart.map(
      (item) =>
        `<li>${item.name} (${item.category}) - Quantity: ${item.quantity}, Price: $${item.salePrice?.toFixed(2)}</li>`
    ).join('')}
        </ul>
        <p><strong>Total Quantity:</strong> ${order.totalQuantity}</p>
        <p><strong>Total Amount:</strong> $${order.totalAmount.toFixed(2)}</p>
        <p><em>Thank you for your order!</em></p>
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
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
            localStorage.removeItem('isAdminLoggedIn');
            router.push('/adminlogin');
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
          <button
            onClick={() => setActiveStep(3)}
            className={`pb-2 text-lg font-semibold border-b-4 ${activeStep === 3 ? 'border-yellow-500 text-yellow-600' : 'border-transparent text-gray-500'}`}
          >
            Order List
          </button>
        </div>
      </div>


      {activeStep === 3 && (
        <div className="max-w-6xl mx-auto bg-white p-6 shadow-md rounded-md">
          <h1 className="text-2xl font-bold mb-4 text-center">Order List</h1>

          {/* Filter Buttons */}
          <div className="flex space-x-4 mb-6">
            <div className="relative group">
              <button
                onClick={() => fetchOrders('all')}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                All Orders
              </button>
              <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden w-auto px-2 py-1 text-xs text-white bg-black rounded group-hover:block">
                View all orders
              </div>
            </div>

            <div className="relative group">
              <button
                onClick={() => fetchOrders('pending')}
                className="px-4 py-2 bg-yellow-300 rounded hover:bg-yellow-400"
              >
                Pending Orders
              </button>
              <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden w-auto px-2 py-1 text-xs text-white bg-black rounded group-hover:block">
                View pending orders
              </div>
            </div>

            <div className="relative group">
              <button
                onClick={() => fetchOrders('completed')}
                className="px-4 py-2 bg-green-300 rounded hover:bg-green-400"
              >
                Completed Orders
              </button>
              <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden w-auto px-2 py-1 text-xs text-white bg-black rounded group-hover:block">
                View completed orders
              </div>
            </div>

          </div>

          {loadingOrders ? (
            <p>Loading orders...</p>
          ) : orders.length === 0 ? (
            <p>No orders found.</p>
          ) : (
            <ul className="space-y-4">
              {orders.map((order) => (
                <li key={order._id} className="border p-4 rounded shadow-md">
                  <p><strong>Order ID:</strong> {order.orderId}</p>
                  <p><strong>Customer:</strong> {order.name}</p>
                  <p><strong>Email:</strong> {order.email}</p>
                  <p><strong>Phone:</strong> {order.userphone}</p>
                  <p><strong>Status:</strong>
                    <span className={order.status === 'pending' ? 'text-yellow-600' : 'text-green-600'}>
                      {order.status}
                    </span>
                  </p>
                  <p><strong>Total Amount:</strong> ${order.totalAmount.toFixed(2)}</p>

                  {/* Action Buttons */}
                  <div className="flex space-x-4 mt-2">

                    <div className="flex space-x-4">
                      {/* Mark as Completed */}
                      <div className="relative group">
                        <button
                          onClick={() => handleCompleteOrder(order.orderId)}
                          className="flex items-center bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
                        >
                          <CheckCircleIcon className="h-5 w-5" />
                        </button>
                        <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden px-2 py-1 text-xs text-white bg-black rounded group-hover:block">
                          Mark order as completed
                        </span>
                      </div>

                      {/* Mark as Pending */}
                      <div className="relative group">
                        <button
                          onClick={() => handlePendingOrder(order.orderId)}
                          className="flex items-center bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600"
                        >
                          <ClockIcon className="h-5 w-5" />
                        </button>
                        <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden px-2 py-1 text-xs text-white bg-black rounded group-hover:block">
                          Mark order as pending
                        </span>
                      </div>

                      {/* Delete Order */}
                      <div className="relative group">
                        <button
                          onClick={() => handleDeleteOrder(order.orderId)}
                          className="flex items-center bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                        <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden px-2 py-1 text-xs text-white bg-black rounded group-hover:block">
                          Delete this order
                        </span>
                      </div>

                      {/* Print Order */}
                      <div className="relative group">
                        <button
                          onClick={() => handlePrint(order)}
                          className="flex items-center bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                        >
                          <PrinterIcon className="h-5 w-5" />
                        </button>
                        <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden px-2 py-1 text-xs text-white bg-black rounded group-hover:block">
                          Print order details
                        </span>
                      </div>
                    </div>

                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}



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
