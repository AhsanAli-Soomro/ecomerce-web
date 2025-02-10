import React from 'react';

export default function Header({ router }) {
    const handleLogout = () => {
        localStorage.removeItem('isAdminLoggedIn');
        router.push('/adminlogin');
    };

    const handleChangePassword = () => {
        router.push('/adminlogin?step=update');
    };

    return (
        <div className="flex fixed top-32 right-10 items-center justify-end w-32 gap-4">
            <button
                onClick={handleChangePassword}
                className="mt-6 text-gray-700 hover:text-red-600 font-semibold transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-red-300"
            >
                Change Password
            </button>
            <button
                onClick={handleLogout}
                className="mt-6 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-md font-semibold shadow-md transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-red-300"
            >
                Logout
            </button>
        </div>
    );
}
