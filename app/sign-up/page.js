"use client"
import { BsGoogle, BsFacebook, BsApple } from 'react-icons/bs';
import Image from 'next/image';
import { useSignUp } from '@clerk/nextjs';
import { useState } from 'react';

export default function SignUpModal({ isOpen, onClose }) {
  const { signUp } = useSignUp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const result = await signUp.create({
        emailAddress: email,
        password,
      });
      if (result.status === 'complete') {
        onClose();
        window.location.href = '/dashboard'; // Redirect on successful sign-up
      }
    } catch (err) {
      setError('Failed to create an account');
    }
  };

  const handleSocialSignUp = async (provider) => {
    try {
      await signUp.authenticateWithRedirect({ strategy: `oauth_${provider}` });
    } catch (err) {
      setError(`Failed to sign up with ${provider}`);
    }
  };

  return (
    <div className="fixed inset-0 top-96 mt-14 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="relative w-full h-svh flex items-center justify-center bg-black bg-opacity-50">
        <div className="relative w-full max-w-md p-8 bg-white shadow-lg rounded-lg animate-fade-in transform scale-100 transition-all">
          {/* Close Button */}
          <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700">
            &times;
          </button>

          {/* Logo */}
          <div className="flex justify-center mb-6">
            <Image
              width={200}
              height={100}
              src="/logo.png"
              alt="RoyalHunt"
            />
          </div>

          <h2 className="text-2xl font-semibold text-yellow-500 text-center mb-6">
            Create Your Account
          </h2>

          {/* Email and Password Sign-Up Form */}
          <form onSubmit={handleSignUp} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-yellow-500 font-medium">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring focus:ring-yellow-400"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-yellow-500 font-medium">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring focus:ring-yellow-400"
                required
              />
            </div>
            <button
              type="submit"
              className="text-white w-full mt-6 font-semibold py-3 px-8 rounded-b-lg shadow-lg bg-gradient-to-r from-yellow-500 to-yellow-600 
            hover:from-yellow-600 hover:to-yellow-700 hover:text-gray-900 transition-transform transform hover:scale-105 
            focus:outline-none focus:ring-4 focus:ring-yellow-300"
            >
              Sign Up
            </button>
            {error && <p className="text-red-500 text-center mt-2">{error}</p>}
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <hr className="flex-grow border-t border-yellow-300" />
            <span className="mx-4 text-yellow-500">or</span>
            <hr className="flex-grow border-t border-yellow-300" />
          </div>

          {/* Social Sign-Up Buttons */}
          <div className="flex flex-row justify-center gap-6">
            <button
              onClick={() => handleSocialSignUp('google')}
              className="flex items-center justify-center text-yellow-600 font-semibold text-2xl hover:text-yellow-800"
            >
              <BsGoogle />
            </button>
            <button
              onClick={() => handleSocialSignUp('facebook')}
              className="flex items-center justify-center text-yellow-600 font-semibold text-2xl hover:text-yellow-800"
            >
              <BsFacebook />
            </button>
            <button
              onClick={() => handleSocialSignUp('apple')}
              className="flex items-center justify-center text-yellow-600 font-semibold text-2xl hover:text-yellow-800"
            >
              <BsApple />
            </button>
          </div>

          {/* Sign-In Link */}
          <div className="text-center mt-6 text-gray-500">
            Already have an account?{' '}
            <a href="/sign-in" className="text-yellow-500 hover:text-yellow-600">
              Sign In
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
