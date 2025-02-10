import { NextResponse } from 'next/server';
import dbConnect from '../../../../../lib/db';
import Admin from '../../../../../models/Admin';

export async function DELETE(req, { params }) {
    const { id } = params; // Get admin ID from URL params
    await dbConnect(); // Ensure DB connection

    try {
        const deletedAdmin = await Admin.findByIdAndDelete(id);
        if (!deletedAdmin) {
            return NextResponse.json({ message: 'Admin not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Admin deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error deleting admin:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
