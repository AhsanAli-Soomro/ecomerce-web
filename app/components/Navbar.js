'use client';
import { SignInButton, SignUpButton, UserButton, useAuth } from '@clerk/nextjs';
import { useState, useEffect } from 'react';
import { FiShoppingCart, FiMenu, FiX, FiSearch, FiFacebook, FiTwitter, FiInstagram } from 'react-icons/fi';
import { useProducts } from '../../contexts/ProductContext';
import { useRouter, usePathname } from 'next/navigation';

export default function Navbar() {
  const { isSignedIn } = useAuth();
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { products } = useProducts();
  const [categories, setCategories] = useState([]);
  const router = useRouter();
  const pathname = usePathname();
  const [currentQuote, setCurrentQuote] = useState(0);

  const quotes = [
    "Great deals every day!",
    "Upgrade your style with us!",
    "Find your perfect product today!",
    "Limited-time offers available now!",
    "Shop smarter, not harder!"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % quotes.length);
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, [quotes.length]);

  useEffect(() => {
    const uniqueCategories = [...new Set(products.map((product) => product.category))];
    setCategories(uniqueCategories);
  }, [products]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?query=${searchQuery}`);
      setSearchQuery('');
    }
  };

  return (
    <>
      <div className='fixed z-10 w-full'>
        {/* Main Navbar */}
        <nav className="navbar bg-white shadow-lg p-4">
          <div className="container mx-auto flex justify-between items-center">
            <h1
              className="text-3xl font-extrabold tracking-wide text-gray-800 cursor-pointer hover:text-yellow-500 transition-colors"
              onClick={() => router.push('/')}
            >
              My E-Commerce
            </h1>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center space-x-8">
              <NavLink href="/cart" icon={<FiShoppingCart size={20} />} label="Cart" />
              <CategoryLinks categories={categories} activePath={pathname} />
              <form onSubmit={handleSearch} className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="p-2 rounded-md shadow-md border focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
                <button type="submit">
                  <FiSearch size={24} className="text-gray-800 hover:text-yellow-500" />
                </button>
              </form>
              <AuthButtons isSignedIn={isSignedIn} />
            </div>

            {/* Mobile Menu Icon */}
            <button
              className="md:hidden focus:outline-none text-gray-800"
              onClick={() => setMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <FiX size={32} /> : <FiMenu size={32} />}
            </button>
          </div>

          {isMenuOpen && (
            <div className="md:hidden mt-4 flex flex-col items-center space-y-6 animate-slide-down">
              <NavLink href="/cart" icon={<FiShoppingCart size={24} />} label="Cart" />
              <CategoryLinks categories={categories} activePath={pathname} />
              <form onSubmit={handleSearch} className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="p-2 rounded-md shadow-md border focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
                <button type="submit">
                  <FiSearch size={24} className="text-gray-800 hover:text-yellow-500" />
                </button>
              </form>
              <AuthButtons isSignedIn={isSignedIn} />
            </div>
          )}
        </nav>
        {/* Sub-navbar for Social Media Links */}
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 py-2">
          <div className="container mx-auto flex justify-between items-center text-white">
            {/* Empty div for alignment */}
            <div className="w-1/4"></div>

            {/* Centered Rotating Quote */}
            <p className="text-center text-sm sm:text-base font-semibold">
              {quotes[currentQuote]}
            </p>

            {/* Social Media Icons */}
            <div className="flex justify-end space-x-4 w-1/4">
              <SocialIcon icon={<FiFacebook />} href="https://facebook.com" />
              <SocialIcon icon={<FiTwitter />} href="https://twitter.com" />
              <SocialIcon icon={<FiInstagram />} href="https://instagram.com" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// Social Icon Component
function SocialIcon({ icon, href }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="hover:scale-105 transition-transform">
      {icon}
    </a>
  );
}

// NavLink Component
function NavLink({ href, icon, label }) {
  return (
    <a
      href={href}
      className="flex items-center space-x-2 text-lg font-medium text-gray-800 hover:text-yellow-500 transition-transform transform hover:scale-105"
    >
      {icon}
      <span>{label}</span>
    </a>
  );
}

// Category Links Component with Active State Detection
function CategoryLinks({ categories, activePath }) {
  const displayCategories = ['Car', 'Fashion', 'Home', 'Sports'];

  return (
    <div className="flex space-x-4">
      {displayCategories.map((category, index) => {
        const isActive = activePath.includes(category.toLowerCase());
        return (
          <a
            key={index}
            href={`/${category.toLowerCase()}`}
            className={`text-lg font-medium ${isActive ? 'underline text-yellow-500' : 'text-gray-800'
              } hover:text-yellow-500 transition-transform transform hover:scale-105`}
          >
            {category}
          </a>
        );
      })}
    </div>
  );
}

// Authentication Buttons Component
function AuthButtons({ isSignedIn }) {
  return isSignedIn ? (
    <UserButton />
  ) : (
    <div className="flex">
      <SignInButton mode="modal">
        <button className="text-gray-800 font-semibold py-2 px-6
                            transition-transform transform hover:scale-105">
          Sign In
        </button>
      </SignInButton>
      <SignUpButton mode="modal">
        <button className="text-gray-800 font-semibold py-2 px-6 rounded-full shadow-xl border-yellow-500 border-2 hover:border-yellow-600 
                           hover:text-gray-900 transition-transform transform hover:scale-105 
                            focus:outline-none focus:ring-4 focus:ring-yellow-300">
          Sign Up
        </button>
      </SignUpButton>
    </div>
  );
}
