// app/api/admin/update/route.js
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import dbConnect from '../../../../lib/db';
import Admin from '../../../../models/Admin';

export async function PUT(req) {
  await dbConnect(); // Ensure DB connection

  const { currentUsername, newUsername, newPassword } = await req.json();

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10); // Hash the new password

    const updatedAdmin = await Admin.findOneAndUpdate(
      { username: currentUsername }, // Find by current username
      { username: newUsername, password: hashedPassword }, // Update username and password
      { new: true } // Return the updated document
    );

    if (!updatedAdmin) {
      return NextResponse.json({ message: 'Admin not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Credentials updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error updating credentials:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
