'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, useUser, SignInButton } from '@clerk/nextjs'; // Import Clerk hooks
import { useCart } from '../../../contexts/CartContext';
import { ToastContainer, toast } from 'react-toastify'; // Import react-toastify
import 'react-toastify/dist/ReactToastify.css'; // Import toastify styles
import CategoryProducts from '@/app/components/CategoryProducts';
import Image from 'next/image';
import { FiShoppingCart } from 'react-icons/fi';
import SignInModal from '@/app/components/SignInModal';

export default function ProductDetails({ params }) {
  const router = useRouter();
  const { isSignedIn, isLoaded: authLoaded } = useAuth();
  const { user, isLoaded: userLoaded } = useUser();
  const { dispatch: cartDispatch } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0); // New hover state
  const [showAllComments, setShowAllComments] = useState(false);

  const { id } = params || {};


  useEffect(() => {
    if (!id) {
      console.error('Product ID not found');
      return router.push('/');
    }

    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${id}`);
        if (!res.ok) throw new Error('Failed to fetch product');

        const data = await res.json();
        setProduct(data);

        const existingRating = data.ratings?.find((r) => r.userId === user?.id);
        if (existingRating) setUserRating(existingRating.rating);
      } catch (error) {
        console.error('Error fetching product details:', error);
        router.push('/');
      } finally {
        setLoading(false);
      }
    };

    if (userLoaded) fetchProduct();
  }, [id, user, userLoaded]);

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
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const openSignIn = () => setIsSignInOpen(true);
  const closeSignIn = () => setIsSignInOpen(false);
  const handleRatingChange = async (newRating) => {
    if (!isSignedIn) {
      openSignIn();
      return;
    }

    try {
      const res = await fetch(`/api/products/${id}/rate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, rating: newRating }),
      });

      if (res.ok) {
        setUserRating(newRating);
        const updatedProduct = await res.json();
        setProduct(updatedProduct);
      }
    } catch (error) {
      console.error('Error updating rating:', error);
    }
  };

  const calculateAverageRating = () => {
    if (!product?.ratings || product.ratings.length === 0) return 0;
    const totalRating = product.ratings.reduce((sum, r) => sum + r.rating, 0);
    return (totalRating / product.ratings.length).toFixed(1);
  };

  const handleAddComment = async () => {
    if (!authLoaded || !userLoaded || !user) return;

    setSubmitting(true);

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user: user.fullName || user.username || 'Anonymous',
          text: comment,
        }),
      });

      if (res.ok) {
        const updatedProduct = await res.json();
        setProduct(updatedProduct);
        setComment('');
      } else {
        console.error('Failed to post comment');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setSubmitting(false);
    }
  };


  const comments = product?.comments || [];
  const displayedComments = showAllComments ? comments : comments.slice(0, 1);

  const handleShowMoreToggle = () => {
    setShowAllComments((prev) => !prev);
  };

  const renderStars = (rating, onClick) => {
    return [...Array(5)].map((_, index) => {
      const starValue = index + 1;
      return (
        <span
          key={starValue}
          onClick={() => onClick(starValue)}
          onMouseEnter={() => setHoverRating(starValue)}
          onMouseLeave={() => setHoverRating(0)}
          style={{
            cursor: 'pointer',
            color: starValue <= (hoverRating || rating) ? '#ffc107' : '#e4e5e9',
            fontSize: '24px',
            marginRight: '5px',
          }}
        >
          ★
        </span>
      );
    });
  };

  if (loading) {
    return (
      <div className='container mx-auto h-svh text-center pt-20'>
        <div role="status">
          <svg aria-hidden="true" class="inline w-10 h-10 text-gray-200 animate-spin dark:text-gray-600 fill-yellow-400" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
          </svg>
          <span class="sr-only">Loading...</span>
        </div>
      </div>

    );
  };
  if (!product) return <p>Product not found</p>;
  const salePrice = product.price - (product.price * product.sale) / 100;
  return (
    <div className="product-details-container container mx-auto p-8 min-h-screen">
      <ToastContainer />
      {/* Go Back Button */}
      <button
        onClick={() => router.back()}
        className="text-white mb-8 font-semibold py-3 px-8 rounded-full shadow-xl bg-gradient-to-r from-yellow-500 to-yellow-600 
               hover:from-yellow-600 hover:to-yellow-700 hover:text-gray-900 transition-transform transform hover:scale-105 
               focus:outline-none focus:ring-4 focus:ring-yellow-300"
      >
        Go Back
      </button>

      {/* Product Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Image */}
        <div className="product-image relative">
          <Image
            width={500}
            height={100}
            src={product.image}
            alt={product.name}
            className="w-full h-full object-fill rounded-xl shadow-md hover:shadow-lg transition-shadow"
          />
        </div>

        {/* Product Details */}
        <div className="product-info flex flex-col justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-800">{product.name}</h1>
            {/* <p className="text-lg text-gray-600">
            Category: <span className="text-gray-800">{product.category}</span>
            </p> */}
            <p className="text-md text-gray-500 leading-relaxed">{product.description}</p>
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
          <div className="product-rating-container py-6 flex flex-col space-y-4">
            {/* Product Rating Section */}
            <div className="product-rating flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <p className="text-lg font-semibold text-gray-800">
                Average Rating: {calculateAverageRating()} / 5
              </p>
              <div className="flex items-center">
                {renderStars(userRating, handleRatingChange)}
              </div>
            </div>
            {!isSignedIn && (
              <div>
                <SignInModal isOpen={isSignInOpen} onClose={closeSignIn} />
              </div>
            )}

            {/* Add to Cart Button */}
            <button
              onClick={() => handleAddToCart(product)}
              className="text-white w-full font-semibold py-3 px-8 rounded-full shadow-lg 
               bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 
               hover:text-gray-900 transition-transform transform hover:scale-105 
               focus:outline-none focus:ring-4 focus:ring-yellow-300"
            >
              Add to Cart
            </button>
          </div>

        </div>
      </div>

      {/* Comments Section */}
      <div className="mt-12">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6">Comments</h2>

        {/* Display Comments */}
        <div className="comments space-y-1">
          {displayedComments.map((c, index) => (
            <div
              key={index}
              className="comment p-6 flex justify-between items-start bg-white rounded-lg shadow-md"
            >
              {/* Comment Content */}
              <div>
                <p className="font-semibold text-lg text-gray-800">{c.user}:</p>
                <p className="text-gray-600 mt-2">{c.text}</p>
              </div>

              {/* Comment Date and Time */}
              <p className="text-gray-500 text-sm mt-2 whitespace-nowrap">
                {new Date(c.date).toLocaleString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: 'numeric',
                  hour12: true, // Ensures AM/PM format
                })}
              </p>
            </div>
          ))}

          {product.comments.length > 3 && (
            <button
              onClick={handleShowMoreToggle}
              className="text-yellow-500 font-semibold mt-4 hover:text-yellow-700 transition"
            >
              {showAllComments ? 'Show Less' : `See More (${product.comments.length - 1} more)`}
            </button>
          )}
        </div>

        {/* Add Comment Section */}
        {authLoaded && isSignedIn ? (
          <div className="add-comment mt-8 space-y-4">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add your comment..."
              className="w-full p-4 border rounded-md shadow-sm focus:ring-2 focus:ring-yellow-400"
              disabled={submitting}
            />
            <button
              onClick={handleAddComment}
              className="text-white w-full font-semibold py-3 px-8 rounded-full shadow-lg bg-gradient-to-r from-yellow-500 to-yellow-600 
                         hover:from-yellow-600 hover:to-yellow-700 hover:text-gray-900 transition-transform transform hover:scale-105 
                         focus:outline-none focus:ring-4 focus:ring-yellow-300"
              disabled={submitting || !comment.trim()}
            >
              {submitting ? 'Posting...' : 'Post Comment'}
            </button>
          </div>
        ) : (
          <p className="text-gray-600 mt-4">
            You must <SignInButton mode="modal">sign in</SignInButton> to post a comment.
          </p>
        )}
      </div>
      <div className="related-products-section my-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Products You May Like
        </h2>
        <CategoryProducts category={product.category} />
      </div>
    </div>

  );
}
