import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import connectToDatabase from '@/lib/mongodb';
import Doctor from '@/models/Doctor';
import { decrypt } from '@/lib/auth';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('session')?.value;
        if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

        const payload = await decrypt(token);
        if (!payload || payload.role !== 'admin') {
            return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
        }

        const { id } = await params;
        const body = await req.json();

        await connectToDatabase();

        const updated = await Doctor.findByIdAndUpdate(id, { $set: body }, { new: true });
        if (!updated) {
            return NextResponse.json({ message: 'Doctor not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Doctor updated', doctor: updated }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: 'Error updating doctor', error: error.message }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('session')?.value;
        if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

        const payload = await decrypt(token);
        if (!payload || payload.role !== 'admin') {
            return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
        }

        const { id } = await params;
        await connectToDatabase();

        await Doctor.findByIdAndDelete(id);
        return NextResponse.json({ message: 'Doctor deleted' }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: 'Error deleting doctor', error: error.message }, { status: 500 });
    }
}
