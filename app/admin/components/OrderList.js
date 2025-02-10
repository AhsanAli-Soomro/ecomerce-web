import React, { useEffect, useState } from 'react';
import { CheckCircleIcon, ClockIcon, TrashIcon, PrinterIcon, ListBulletIcon } from '@heroicons/react/20/solid';

export default function OrderList({ orders, setOrders, loadingOrders, setLoadingOrders, setMessage }) {
    const [activeStatus, setActiveStatus] = useState('all');

    useEffect(() => {
        fetchOrders(activeStatus);
    }, [activeStatus]);

    const fetchOrders = async (filter) => {
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

    const handleOrderStatusChange = async (orderId, status) => {
        try {
            const res = await fetch('/api/orders', {
                method: 'PATCH',
                body: JSON.stringify({ orderId, status }),
                headers: { 'Content-Type': 'application/json' },
            });
            if (res.ok) {
                setMessage(`Order ${status === 'completed' ? 'completed' : 'marked as pending'} successfully!`);
                fetchOrders(status);
            }
        } catch (error) {
            console.error('Error updating order:', error);
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
                fetchOrders(activeStatus);
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
          ${order.cart
                .map(
                    (item) =>
                        `<li>${item.name} (${item.category}) - Quantity: ${item.quantity}, Price: Rs:${item.salePrice?.toFixed(
                            2
                        )}</li>`
                )
                .join('')}
        </ul>
        <p><strong>Total Quantity:</strong> ${order.totalQuantity}</p>
        <p><strong>Total Amount:</strong> Rs:${order.totalAmount.toFixed(2)}</p>
      </body>
      </html>
    `);
        printWindow.document.close();
        printWindow.print();
    };

    return (
        <div className="max-w-7xl mx-auto p-8 min-h-screen">
        <h1 className="text-3xl font-extrabold mb-8 text-center text-gray-100">Manage Orders</h1>
  
        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center space-x-6 items-center mb-8">
          {/* All Orders */}
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="status"
              value="all"
              checked={activeStatus === 'all'}
              onChange={() => setActiveStatus('all')}
              className="hidden"
            />
            <div
              className={`flex items-center space-x-2 p-3 rounded-lg shadow-md transition-all ${
                activeStatus === 'all' ? 'bg-blue-700 text-blue-200' : 'bg-gray-700 text-gray-400'
              } hover:bg-blue-600 hover:text-white`}
            >
              <ListBulletIcon className="h-6 w-6" />
              <span className="font-semibold">All</span>
            </div>
          </label>
  
          {/* Pending Orders */}
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="status"
              value="pending"
              checked={activeStatus === 'pending'}
              onChange={() => setActiveStatus('pending')}
              className="hidden"
            />
            <div
              className={`flex items-center space-x-2 p-3 rounded-lg shadow-md transition-all ${
                activeStatus === 'pending' ? 'bg-yellow-700 text-yellow-200' : 'bg-gray-700 text-gray-400'
              } hover:bg-yellow-600 hover:text-white`}
            >
              <ClockIcon className="h-6 w-6" />
              <span className="font-semibold">Pending</span>
            </div>
          </label>
  
          {/* Completed Orders */}
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="status"
              value="completed"
              checked={activeStatus === 'completed'}
              onChange={() => setActiveStatus('completed')}
              className="hidden"
            />
            <div
              className={`flex items-center space-x-2 p-3 rounded-lg shadow-md transition-all ${
                activeStatus === 'completed' ? 'bg-green-700 text-green-200' : 'bg-gray-700 text-gray-400'
              } hover:bg-green-600 hover:text-white`}
            >
              <CheckCircleIcon className="h-6 w-6" />
              <span className="font-semibold">Completed</span>
            </div>
          </label>
        </div>
  
        {/* Display Orders */}
        {loadingOrders ? (
          <p className="text-center text-lg text-gray-400">Loading orders...</p>
        ) : orders.length === 0 ? (
          <p className="text-center text-lg text-gray-400">
            {activeStatus === 'pending' && 'No Pending Orders.'}
            {activeStatus === 'completed' && 'No Completed Orders.'}
            {activeStatus === 'all' && 'No Orders Available.'}
          </p>
        ) : (
          <ul className="space-y-6">
            {orders.map((order) => (
              <li key={order._id} className="bg-gray-800 p-6 rounded-lg shadow-md">
                <div className="mb-4">
                  <p className="text-lg font-semibold text-gray-100">
                    <strong>Order ID:</strong> {order.orderId}
                  </p>
                  <p className="text-gray-300"><strong>Customer:</strong> {order.name}</p>
                  <p className="text-gray-300"><strong>Email:</strong> {order.email}</p>
                  <p className="text-gray-300"><strong>Total Amount:</strong> Rs {order.totalAmount.toFixed(2)}</p>
                  <p>
                    <strong>Status:</strong>{' '}
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        order.status === 'pending'
                          ? 'bg-yellow-600 text-yellow-100'
                          : 'bg-green-600 text-green-100'
                      }`}
                    >
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </p>
                </div>
  
                <div className="flex space-x-4">
                  {/* Mark Completed Button */}
                  <div className="relative group">
                    <button
                      onClick={() => handleOrderStatusChange(order.orderId, 'completed')}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow-md transition flex items-center"
                    >
                      <CheckCircleIcon className="h-5 w-5" />
                    </button>
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-black rounded hidden group-hover:block">
                      Mark the order as completed
                    </div>
                  </div>
  
                  {/* Mark Pending Button */}
                  <div className="relative group">
                    <button
                      onClick={() => handleOrderStatusChange(order.orderId, 'pending')}
                      className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg shadow-md transition flex items-center"
                    >
                      <ClockIcon className="h-5 w-5" />
                    </button>
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-black rounded hidden group-hover:block">
                      Mark the order as pending
                    </div>
                  </div>
  
                  {/* Delete Order Button */}
                  <div className="relative group">
                    <button
                      onClick={() => handleDeleteOrder(order.orderId)}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow-md transition flex items-center"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-black rounded hidden group-hover:block">
                      Delete this order
                    </div>
                  </div>
  
                  {/* Print Order Button */}
                  <div className="relative group">
                    <button
                      onClick={() => handlePrint(order)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md transition flex items-center"
                    >
                      <PrinterIcon className="h-5 w-5" />
                    </button>
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-black rounded hidden group-hover:block">
                      Print the order details
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
}
