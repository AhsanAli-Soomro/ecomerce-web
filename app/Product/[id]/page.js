'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, useUser, SignInButton } from '@clerk/nextjs'; // Import Clerk hooks
import { useCart } from '../../../contexts/CartContext';

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
  };

  const handleRatingChange = async (newRating) => {
    if (!isSignedIn) return router.push('/sign-in');

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

  if (loading) return <p>Loading product details...</p>;
  if (!product) return <p>Product not found</p>;

  return (
    <div className="product-details-container container mx-auto p-8 min-h-screen">
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
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-96 object-cover rounded-xl shadow-md hover:shadow-lg transition-shadow"
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
            <p className="text-2xl font-semibold text-yellow-500">${product.price}</p>

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
    </div>

  );
}
