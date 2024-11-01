'use client';
import { useCart } from '../../contexts/CartContext';
import { useRouter } from 'next/navigation';
import { useAuth, useUser, SignInButton } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function CartComponent() {
  const { cart, dispatch } = useCart();
  const router = useRouter();
  const { isSignedIn, isLoaded: authLoaded } = useAuth();
  const { user } = useUser();

  const [checkoutMode, setCheckoutMode] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    userphone: "",
    country: '',
    state: '',
    city: '',
    address: '',
    postalCode: '',
    paymentMethod: 'Cash on Delivery',
  });

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.fullName || '',
        email: user.emailAddresses[0]?.emailAddress || '',
      }));
    }
  }, [user]);

  useEffect(() => setMounted(true), []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRemoveFromCart = (id) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: id });
  };

  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity < 1) return;
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity: newQuantity } });
  };

  const handleCheckoutClick = () => {
    setCheckoutMode(true);
  };

  const calculateTotalQuantity = () =>
    cart.reduce((total, item) => total + item.quantity, 0);

  const calculateTotalAmount = () =>
    cart.reduce((total, item) => {
      const salePrice = item.sale > 0
        ? item.price - (item.price * item.sale) / 100
        : item.price;
      return total + salePrice * item.quantity;
    }, 0);


    const handleCheckout = async () => {
      const orderId = `ORDER-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
      const predefinedPhone = process.env.NEXT_PUBLIC_TWILIO_TRIAL_NUMBER;
      const totalQuantity = calculateTotalQuantity();
      const totalAmount = calculateTotalAmount();
    
      const cartWithDiscounts = cart.map((item) => ({
        ...item,
        salePrice: item.sale > 0 ? item.price - (item.price * item.sale) / 100 : item.price,
      }));
    
      // Initialize the toast and store the ID
      const loadingToastId = toast.loading('Processing your order...');
    
      try {
        const response = await fetch('/api/sendNotification', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            phone: predefinedPhone,
            orderId,
            email: formData.email,
            userphone: formData.userphone,
            name: formData.name,
            totalQuantity,
            totalAmount,
            country: formData.country,
            state: formData.state,
            city: formData.city,
            address: formData.address,
            postalCode: formData.postalCode,
            cart: cartWithDiscounts,
          }),
        });
    
        if (!response.ok) {
          const { error } = await response.json();
          throw new Error(error || 'Failed to send notification');
        }
    
        // Update the toast with a success message
        toast.update(loadingToastId, {
          render: 'Order placed successfully! Confirmation email and SMS sent!',
          type: 'success',
          isLoading: false,
          autoClose: 1000, // Close after 3 seconds
        });
    
        // Clear the cart
        dispatch({ type: 'CLEAR_CART' });
    
        // Redirect to homepage after the success toast disappears
        setTimeout(() => {
          router.push('/');
        }, 1000);
      } catch (error) {
        console.error(error);
    
        // Update the toast with an error message
        toast.update(loadingToastId, {
          render: 'Something went wrong! Please try again.',
          type: 'error',
          isLoading: false,
          autoClose: 3000,
        });
      }
    };


  if (!mounted || !authLoaded) return null;
  // if (cart.length === 0) return <p>Your cart is empty</p>;

  return (
    <div className="cart-container p-4 bg-white h-screen overflow-y-scroll mt-6 rounded-lg sm:p-8 max-w-4xl mx-auto">
          <ToastContainer />
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center">Your Cart</h1>

      {cart.length === 0 ? (
        <p className="text-gray-600 text-center">Your cart is empty.</p>
      ) : (
        <div className="space-y-6">
          {/* Cart Items */}
          {cart.map((item) => (
            <div
              key={item._id}
              className="cart-item flex flex-col sm:flex-row items-center sm:items-start justify-between bg-gray-100 p-4 rounded-md"
            >
              <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                <Image
                  width={200}
                  height={100}
                  src={item.image}
                  alt={item.name}
                  className="w-32 h-32 sm:w-24 sm:h-24 object-cover rounded-md"
                />
                <div>
                  <h2 className="text-lg font-semibold">{item.name}</h2>
                  <div className="flex items-center space-x-2 mt-2">
                    {item.sale > 0 ? (
                      <>
                        <p className="text-gray-400 line-through">
                          ${item.price.toFixed(2)}
                        </p>
                        <p className="text-lg font-semibold text-yellow-500">
                          ${(item.price - (item.price * item.sale) / 100).toFixed(2)} x {item.quantity}
                        </p>
                      </>
                    ) : (
                      <p className="text-lg font-semibold text-gray-800">
                        ${item.price.toFixed(2)} x {item.quantity}
                      </p>
                    )}

                  </div>

                  <input
                    type="number"
                    value={item.quantity}
                    min="1"
                    onChange={(e) => handleQuantityChange(item._id, parseInt(e.target.value))}
                    className="w-20 p-2 border rounded-md mt-2"
                  />
                </div>
              </div>
              <button
                onClick={() => handleRemoveFromCart(item._id)}
                className="text-red-500 hover:text-red-700 mt-2 sm:mt-0"
              >
                Remove
              </button>
            </div>
          ))}

          <p className="text-xl font-semibold text-right">
            Total Amount: ${calculateTotalAmount().toFixed(2)}
          </p>


          {/* Checkout Button or Sign-in Options */}
          <div className="mt-6">
            {isSignedIn ? (
              <button
                onClick={openModal}
                className="text-white w-full font-semibold py-2 px-6 rounded-full shadow-xl bg-gradient-to-r from-yellow-500 to-yellow-600 
                          hover:from-yellow-600 hover:to-yellow-700 hover:text-gray-900 transition-transform transform hover:scale-105 
                          focus:outline-none focus:ring-4 focus:ring-yellow-300"              >
                Checkout
              </button>
            ) : (
              <div className="space-y-4">
                <p className="text-gray-600">
                  You can either login or checkout as a guest.
                </p>
                <SignInButton mode="modal">
                  <button
                    className="text-white w-full font-semibold py-2 px-6 rounded-full shadow-xl bg-gradient-to-r from-yellow-500 to-yellow-600 
                     hover:from-yellow-600 hover:to-yellow-700 hover:text-gray-900 transition-transform transform hover:scale-105 
                     focus:outline-none focus:ring-4 focus:ring-yellow-300"
                  >
                    Sign In
                  </button>
                </SignInButton>
                <button
                  onClick={openModal}
                  className="w-full bg-gray-300 hover:bg-gray-400 text-black py-3 rounded-full font-semibold transition"
                >
                  Checkout as Guest
                </button>
              </div>
            )}
          </div>

          {/* Checkout Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
                <h2 className="text-2xl font-bold mb-4">Checkout</h2>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleCheckout();
                    closeModal(); // Close modal on successful checkout
                  }}
                  className="space-y-4"
                >
                  <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-md"
                    required
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-md"
                    required
                  />
                  <input
                    type="tel"
                    name="userphone"
                    placeholder="Phone"
                    value={formData.userphone}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-md"
                    required
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="country"
                      placeholder="Country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="w-full p-3 border rounded-md"
                      required
                    />
                    <input
                      type="text"
                      name="state"
                      placeholder="State"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full p-3 border rounded-md"
                      required
                    />
                    <input
                      type="text"
                      name="city"
                      placeholder="City"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full p-3 border rounded-md"
                      required
                    />
                    <input
                      type="text"
                      name="postalCode"
                      placeholder="Postal Code"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      className="w-full p-3 border rounded-md"
                      required
                    />
                  </div>
                  <input
                    type="text"
                    name="address"
                    placeholder="Address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-md"
                    required
                  />
                  <select
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-md"
                  >
                    <option value="Cash on Delivery">Cash on Delivery</option>
                    <option value="Credit Card">Credit Card</option>
                  </select>

                  <button
                    type="submit"
                    className="w-full bg-yellow-500 hover:bg-yellow-600 text-black py-3 rounded-lg font-semibold transition"
                  >
                    Place Order
                  </button>
                </form>
                <button
                  onClick={closeModal}
                  className="mt-4 w-full bg-gray-300 hover:bg-gray-400 text-black py-3 rounded-lg font-semibold transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

