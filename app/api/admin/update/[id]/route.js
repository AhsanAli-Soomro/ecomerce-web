import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import dbConnect from '../../../../../lib/db';
import Admin from '../../../../../models/Admin';

export async function PUT(req, { params }) {
    const { id } = params; // Get the admin ID from the URL params
    await dbConnect(); // Ensure DB connection

    const { newUsername, newPassword } = await req.json(); // Get new credentials

    try {
        const hashedPassword = await bcrypt.hash(newPassword, 10); // Hash the new password

        const updatedAdmin = await Admin.findByIdAndUpdate(
            id, // Find by admin ID
            { username: newUsername, password: hashedPassword }, // Update username and password
            { new: true } // Return the updated document
        );

        if (!updatedAdmin) {
            return NextResponse.json({ message: 'Admin not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Admin updated successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error updating admin:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
