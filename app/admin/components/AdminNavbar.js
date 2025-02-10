"use client"
import { usePathname } from 'next/navigation';
import React, { useState } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';

export default function AdminNavbar({ handleLogout, handleChangePassword }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const pathname = usePathname();

    // Check if the current page is the admin page
    const isAdminLoginPage = pathname.startsWith('/adminlogin');

    return (
        <nav className="fixed top-0 left-0 w-full bg-gray-800 text-white shadow-md z-50">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                {/* Left Section: Admin Branding */}
                <div className="text-3xl font-bold flex items-center">
                    <span className="text-yellow-400">Admin</span>
                    {isAdminLoginPage ? null : <span className="ml-1">Dashboard</span>}
                </div>

                {/* Hamburger Menu Button (Mobile View) */}
                <div className="md:hidden">
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="text-white focus:outline-none"
                    >
                        {isMenuOpen ? <FiX size={28} /> : <FiMenu size={28} />}
                    </button>
                </div>

                {/* Desktop Links */}
                {isAdminLoginPage ? null : <div className="hidden md:flex space-x-6 items-center">
                    <a
                        href='/admin'
                        className="text-gray-300 hover:text-white font-semibold transition"
                    >
                        Dashboard
                    </a>
                    <a
                        href='/'
                        className="text-gray-300 hover:text-white font-semibold transition"
                    >
                        Home
                    </a>
                    <button
                        onClick={handleChangePassword}
                        className="text-yellow-400 hover:text-white font-semibold transition"
                    >
                        Change Password
                    </button>
                    <button
                        onClick={handleLogout}
                        className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-md font-semibold transition"
                    >
                        Logout
                    </button>
                </div>}
            </div>

            {/* Mobile Menu Links */}
            {isMenuOpen && (
                <div className="md:hidden bg-gray-700 text-white px-4 py-4 space-y-3 shadow-lg">
                    <a
                        href='/admin'
                        className="block text-gray-300 hover:text-yellow-400 font-semibold transition"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        Dashboard
                    </a>
                    <a
                        href='/'
                        className="block text-gray-300 hover:text-yellow-400 font-semibold transition"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        Home
                    </a>
                    <button
                        onClick={() => {
                            handleChangePassword();
                            setIsMenuOpen(false);
                        }}
                        className="block text-gray-300 hover:text-yellow-400 font-semibold transition"
                    >
                        Change Password
                    </button>
                    <button
                        onClick={() => {
                            handleLogout();
                            setIsMenuOpen(false);
                        }}
                        className="w-full bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-md font-semibold transition"
                    >
                        Logout
                    </button>
                </div>
            )}
        </nav>
    );
}
