import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import connectToDatabase from '@/lib/mongodb';
import Doctor from '@/models/Doctor';
import { decrypt } from '@/lib/auth';

export async function GET() {
    try {
        await connectToDatabase();
        const doctors = await Doctor.find({}).sort({ name: 1 });
        return NextResponse.json({ doctors }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: 'Error fetching doctors', error: error.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('session')?.value;
        if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

        const payload = await decrypt(token);
        if (!payload || payload.role !== 'admin') {
            return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
        }

        const { name, specialty, workingHoursStart, workingHoursEnd, isAvailable } = await req.json();
        if (!name || !specialty) {
            return NextResponse.json({ message: 'Name and specialty are required' }, { status: 400 });
        }

        await connectToDatabase();

        const doctor = await Doctor.create({
            name,
            specialty,
            workingHoursStart: workingHoursStart || '09:00',
            workingHoursEnd: workingHoursEnd || '17:00',
            isAvailable: isAvailable !== undefined ? isAvailable : true,
        });

        return NextResponse.json({ message: 'Doctor added', doctor }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ message: 'Error adding doctor', error: error.message }, { status: 500 });
    }
}
