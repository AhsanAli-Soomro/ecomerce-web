'use client';
import { useState, useEffect } from 'react';

export default function AdminManageCredentials() {
    const [admins, setAdmins] = useState([]); // Store list of admins
    const [newUsername, setNewUsername] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [editMode, setEditMode] = useState(null); // Track the admin being edited
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // Fetch admins on component mount
    useEffect(() => {
        fetchAdmins();
    }, []);

    // Fetch all admins from the API
    const fetchAdmins = async () => {
        try {
            const res = await fetch('/api/admin/list');
            if (res.ok) {
                const data = await res.json();
                setAdmins(data.admins);
            } else {
                console.error('Failed to fetch admins');
            }
        } catch (error) {
            console.error('Error fetching admins:', error);
        }
    };

    // Create or update an admin based on edit mode
    const handleSetCredentials = async (e) => {
        e.preventDefault();

        try {
            let res;
            if (editMode) {
                // Update the existing admin
                res = await fetch(`/api/admin/update/${editMode}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        newUsername,
                        newPassword,
                    }),
                });
            } else {
                // Create a new admin
                res = await fetch('/api/admin/create', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        username: newUsername,
                        password: newPassword,
                    }),
                });
            }

            if (res.ok) {
                setSuccessMessage(editMode ? 'Admin updated successfully' : 'New admin created successfully');
                setNewUsername('');
                setNewPassword('');
                setEditMode(null); // Exit edit mode
                fetchAdmins(); // Refresh the admin list
            } else {
                const { message } = await res.json();
                setErrorMessage(message || 'Failed to process request.');
            }
        } catch (error) {
            console.error('Error setting credentials:', error);
            setErrorMessage('Failed to process request.');
        }
    };

    // Delete an admin
    const handleDeleteAdmin = async (adminId) => {
        if (!confirm('Are you sure you want to delete this admin?')) return;

        try {
            const res = await fetch(`/api/admin/delete/${adminId}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                setSuccessMessage('Admin deleted successfully.');
                fetchAdmins(); // Refresh the list after deletion
            } else {
                setErrorMessage('Failed to delete admin.');
            }
        } catch (error) {
            console.error('Error deleting admin:', error);
            setErrorMessage('Failed to delete admin.');
        }
    };

    // Enter edit mode and set current admin credentials in the form
    const handleEditAdmin = (admin) => {
        setEditMode(admin._id); // Set the admin being edited
        setNewUsername(admin.username);
        setNewPassword(''); // Reset the password field for security
    };

    return (
        <div className="p-8 bg-gray-800 rounded-md shadow-lg">
            <h2 className="text-3xl font-bold text-gray-100 mb-6">{editMode ? 'Edit Admin' : 'Manage Admin Credentials'}</h2>

            {successMessage && <p className="text-green-400 mb-4">{successMessage}</p>}
            {errorMessage && <p className="text-red-400 mb-4">{errorMessage}</p>}

            {/* Form to create or edit an admin */}
            <form onSubmit={handleSetCredentials} className="space-y-4">
                <input
                    type="text"
                    placeholder="Username"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    className="w-full p-3 bg-gray-700 text-gray-300 border border-gray-600 rounded-md"
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full p-3 bg-gray-700 text-gray-300 border border-gray-600 rounded-md"
                    required
                />
                <div className="flex space-x-4">
                    <button
                        type="submit"
                        className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-3 rounded-md font-semibold transition"
                    >
                        {editMode ? 'Update Admin' : 'Create Admin'}
                    </button>
                    {editMode && (
                        <button
                            type="button"
                            onClick={() => {
                                setEditMode(null); // Exit edit mode
                                setNewUsername('');
                                setNewPassword('');
                            }}
                            className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-md font-semibold transition"
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </form>

            {/* Display list of admins */}
            <h3 className="text-2xl font-semibold text-gray-100 mt-8 mb-4">Existing Admins</h3>
            <ul className="space-y-4">
                {admins.map((admin) => (
                    <li key={admin._id} className="p-4 bg-gray-700 rounded-md flex justify-between items-center">
                        <span className="text-lg text-gray-300">{admin.username}</span>
                        <div className="flex space-x-4">
                            <button
                                onClick={() => handleEditAdmin(admin)}
                                className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md font-semibold transition"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => handleDeleteAdmin(admin._id)}
                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md font-semibold transition"
                            >
                                Delete
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
