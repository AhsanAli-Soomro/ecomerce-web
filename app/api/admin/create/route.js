// app/api/admin/create/route.js
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import dbConnect from '../../../../lib/db';
import Admin from '../../../../models/Admin';

export async function POST(req) {
  await dbConnect(); // Ensure DB connection

  const { username, password } = await req.json();

  try {
    // Check if the username already exists
    const existingAdmin = await Admin.findOne({ username });
    if (existingAdmin) {
      return NextResponse.json({ message: 'Username already exists' }, { status: 409 });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new admin user
    const newAdmin = new Admin({ username, password: hashedPassword });
    await newAdmin.save();

    return NextResponse.json({ message: 'Admin created successfully' }, { status: 201 });
  } catch (error) {
    console.error('Error creating admin:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
