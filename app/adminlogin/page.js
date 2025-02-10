'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
    const [step, setStep] = useState('login'); // Track the current step: 'login' or 'update'
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [newUsername, setNewUsername] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const router = useRouter();

    // Handle Login Request
    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch('/api/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            if (res.ok) {
                localStorage.setItem('isAdminLoggedIn', 'true');
                setStep('update'); // Proceed to the update step
            } else {
                const { message } = await res.json();
                setError(message);
            }
        } catch (error) {
            console.error(error);
            setError('Failed to login. Please try again.');
        }
    };

    // Handle Update Request
    const handleUpdateCredentials = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch('/api/admin/update', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    currentUsername: username,
                    newUsername,
                    newPassword,
                }),
            });

            if (res.ok) {
                setSuccess('Credentials updated successfully!');
                localStorage.removeItem('isAdminLoggedIn'); // Logout the user
                router.push('/adminlogin'); // Redirect to login page
            } else {
                const { message } = await res.json();
                setError(message);
            }
        } catch (error) {
            console.error(error);
            setError('Failed to update credentials.');
        }
    };

    const handleadmin = () => {
        router.push('/admin'); // Redirect to update credentials step
    };

    return (
        <div className='pt-5 bg-gray-100 h-svh'>
            <div className="flex fixed top-32 right-10 items-center justify-end w-full gap-4">
                <button
                    onClick={handleadmin}
                    className="mt-6 text-gray-100 py-2 px-4 rounded-xl bg-red-500 hover:bg-red-600 font-semibold transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-red-300"
                >
                    Admin
                </button>
            </div>
            <div className="flex items-center justify-center py-48 bg-gray-100">
                <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                    <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
                        {step === 'login' ? 'Admin Login' : 'Update Credentials'}
                    </h2>

                    {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
                    {success && <p className="text-green-500 mb-4 text-center">{success}</p>}

                    {/* Step 1: Login Form */}
                    {step === 'login' && (
                        <form onSubmit={handleLogin} className="space-y-4">
                            <input
                                type="text"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full p-3 border rounded-md"
                                required
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full p-3 border rounded-md"
                                required
                            />
                            <button
                                type="submit"
                                className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-3 rounded-md font-semibold transition"
                            >
                                Login
                            </button>
                        </form>
                    )}

                    {/* Step 2: Update Credentials Form */}
                    {step === 'update' && (
                        <form onSubmit={handleUpdateCredentials} className="space-y-4">
                            <input
                                type="text"
                                placeholder="New Username"
                                value={newUsername}
                                onChange={(e) => setNewUsername(e.target.value)}
                                className="w-full p-3 border rounded-md"
                                required
                            />
                            <input
                                type="password"
                                placeholder="New Password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full p-3 border rounded-md"
                                required
                            />
                            <div className="flex space-x-4">
                                <button
                                    type="submit"
                                    className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-md font-semibold transition"
                                >
                                    Update Credentials
                                </button>
                                <button
                                    type="button"
                                    onClick={() => router.push('/adminlogin')}
                                    className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-md font-semibold transition"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    )}

                    {/* Toggle Step Links */}
                    <div className="mt-4 text-center">
                        {step === 'login' && (
                            <p className="text-sm text-gray-500">
                                Want to update credentials?{' '}
                                <button
                                    onClick={() => setStep('update')}
                                    className="text-blue-500 hover:underline"
                                >
                                    Click here
                                </button>
                            </p>
                        )}
                        {step === 'update' && (
                            <p className="text-sm text-gray-500">
                                Want to go back to login?{' '}
                                <button
                                    onClick={() => setStep('login')}
                                    className="text-blue-500 hover:underline"
                                >
                                    Click here
                                </button>
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
