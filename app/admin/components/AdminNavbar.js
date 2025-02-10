"use client"
import React from 'react';

export default function AdminNavbar({ handleLogout, handleChangePassword }) {
  return (
    <nav className="fixed top-0 left-0 w-full bg-gray-800 text-white shadow-md z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Left Section: Admin Branding */}
        <div className="text-2xl font-bold">
          <span className="text-blue-400">Admin</span> Dashboard
        </div>

        {/* Right Section: Action Buttons */}
        <div className="flex space-x-4 items-center">
          <button
            onClick={handleChangePassword}
            className="text-gray-300 hover:text-white font-semibold px-4 py-2 rounded-md transition"
          >
            Change Password
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-md font-semibold transition"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
