'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

// Predefined 6-digit recovery codes
const recoveryCodes = ['386333', '759852', '759863', '885566', '986532', '485327', '754286', '316497', '829371', '734286'];

export default function AdminLogin() {
    const [step, setStep] = useState('login'); // Track current step
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [recoveryCode, setRecoveryCode] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    // Handle login request
    const handleLogin = async (e) => {
        e.preventDefault();
        setError(''); // Clear previous errors

        try {
            const res = await fetch('/api/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            if (res.ok) {
                localStorage.setItem('isAdminLoggedIn', 'true');
                router.push('/admin'); // Redirect to admin dashboard
            } else {
                const { message } = await res.json();
                setError(message);
            }
        } catch (error) {
            console.error(error);
            setError('Login failed. Please try again.');
        }
    };

    // Handle recovery code verification
    const handleRecovery = (e) => {
        e.preventDefault();
        if (recoveryCodes.includes(recoveryCode)) {
            localStorage.setItem('isAdminLoggedIn', 'true'); // Set admin session
            router.push('/admin'); // Redirect to admin dashboard
        } else {
            setError('Invalid recovery code.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6">
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-3xl font-bold text-gray-100 mb-6 text-center">
                    {step === 'login' ? 'Admin Login' : 'Recovery Mode'}
                </h2>

                {error && <p className="text-red-400 mb-4 text-center">{error}</p>}

                {/* Login form */}
                {step === 'login' && (
                    <form onSubmit={handleLogin} className="space-y-4">
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full p-3 bg-gray-700 text-gray-300 border border-gray-600 rounded-md"
                            required
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 bg-gray-700 text-gray-300 border border-gray-600 rounded-md"
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

                {/* Recovery code form */}
                {step === 'recovery' && (
                    <form onSubmit={handleRecovery} className="space-y-4">
                        <input
                            type="text"
                            placeholder="Enter Recovery Code"
                            value={recoveryCode}
                            onChange={(e) => setRecoveryCode(e.target.value)}
                            className="w-full p-3 bg-gray-700 text-gray-300 border border-gray-600 rounded-md"
                            required
                        />
                        <button
                            type="submit"
                            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-md font-semibold transition"
                        >
                            Verify Code
                        </button>
                    </form>
                )}

                <div className="mt-4 text-center">
                    {step === 'login' ? (
                        <p className="text-sm text-gray-400">
                            Forgot credentials?{' '}
                            <button onClick={() => setStep('recovery')} className="text-blue-400 hover:underline">
                                Click here
                            </button>
                        </p>
                    ) : (
                        <p className="text-sm text-gray-400">
                            Remember credentials?{' '}
                            <button onClick={() => setStep('login')} className="text-blue-400 hover:underline">
                                Go back to login
                            </button>
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
