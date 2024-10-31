'use client';
import { useSignIn } from '@clerk/nextjs';
import Image from 'next/image';
import { useState } from 'react';
import { BsApple, BsFacebook, BsGoogle } from 'react-icons/bs';

export default function SignInModal({ isOpen, onClose }) {
  const { signIn } = useSignIn();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      const result = await signIn.create({
        identifier: email,
        password,
      });
      if (result.status === 'complete') {
        onClose();
        window.location.href = '/dashboard'; // Redirect on successful sign-in
      }
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  const handleSocialSignIn = async (provider) => {
    try {
      await signIn.authenticateWithRedirect({ strategy: `oauth_${provider}` });
    } catch (err) {
      setError(`Failed to sign in with ${provider}`);
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
          <div className="flex justify-center mb-10">
            <Image
              width={200}
              height={100}
              src="/logo.png"
              alt="RoyalHunt"
            />
          </div>

          {/* Email and Password Sign-In Form */}
          <form onSubmit={handleSignIn} className="space-y-4">
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
              Sign In
            </button>
            {error && <p className="text-red-500 text-center mt-2">{error}</p>}
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <hr className="flex-grow border-t border-yellow-300" />
            <span className="mx-4 text-yellow-500">or</span>
            <hr className="flex-grow border-t border-yellow-300" />
          </div>

          {/* Social Sign-In Buttons */}
          <div className="flex flex-row justify-center gap-6">
            <button
              onClick={() => handleSocialSignIn('google')}
              className="flex items-center justify-center text-yellow-600 font-semibold text-2xl hover:text-yellow-800"
            >
              <BsGoogle />
            </button>
            <button
              onClick={() => handleSocialSignIn('facebook')}
              className="flex items-center justify-center text-yellow-600 font-semibold text-2xl hover:text-yellow-800"
            >
              <BsFacebook />
            </button>
            <button
              onClick={() => handleSocialSignIn('apple')}
              className="flex items-center justify-center text-yellow-600 font-semibold text-2xl hover:text-yellow-800"
            >
              <BsApple />
            </button>
          </div>

          {/* Sign-Up Link */}
          <div className="text-center mt-6 text-gray-500">
            Don’t have an account?{' '}
            <a href="/sign-up" className="text-yellow-500 hover:text-yellow-600">
              Sign Up
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
