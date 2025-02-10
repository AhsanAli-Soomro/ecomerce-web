import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/db';
import Admin from '../../../../models/Admin';

export async function GET() {
    await dbConnect(); // Ensure DB connection

    try {
        const admins = await Admin.find({}, 'username'); // Fetch all admins (only username)
        return NextResponse.json({ admins }, { status: 200 });
    } catch (error) {
        console.error('Error fetching admins:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
