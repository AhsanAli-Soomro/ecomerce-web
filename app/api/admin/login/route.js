// app/api/admin/login/route.js
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import dbConnect from '../../../../lib/db';
import Admin from '../../../../models/Admin';

export async function POST(req) {
  await dbConnect(); // Ensure database is connected

  const { username, password } = await req.json(); // Parse request body

  try {
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return NextResponse.json({ message: 'Invalid username or password' }, { status: 401 });
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return NextResponse.json({ message: 'Invalid username or password' }, { status: 401 });
    }

    return NextResponse.json({ message: 'Login successful' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
