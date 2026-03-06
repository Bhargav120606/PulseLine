import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import connectToDatabase from '@/lib/mongodb';
import Appointment from '@/models/Appointment';
import { decrypt } from '@/lib/auth';

// Book a new appointment
export async function POST(req: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('session')?.value;
        if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

        const payload = await decrypt(token);
        if (!payload?.userId) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

        const { patientName, phoneNumber, age, doctorId } = await req.json();
        if (!patientName || !phoneNumber || !age || !doctorId) {
            return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
        }

        await connectToDatabase();

        const today = new Date().toISOString().split('T')[0];

        // Get next token number for today
        const lastAppointment = await Appointment.findOne({ date: today })
            .sort({ tokenNumber: -1 })
            .limit(1);
        const tokenNumber = lastAppointment ? lastAppointment.tokenNumber + 1 : 1;

        // Calculate estimated wait (15 min per waiting patient)
        const waitingCount = await Appointment.countDocuments({ date: today, status: 'waiting' });
        const estimatedWaitTime = waitingCount * 15;

        const appointment = await Appointment.create({
            patientId: payload.userId,
            patientName,
            phoneNumber,
            age: Number(age),
            doctorId,
            date: today,
            tokenNumber,
            status: 'waiting',
            estimatedWaitTime,
        });

        return NextResponse.json({ message: 'Appointment booked', appointment }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ message: 'Error booking appointment', error: error.message }, { status: 500 });
    }
}

// List appointments
export async function GET(req: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('session')?.value;
        if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

        const payload = await decrypt(token);
        if (!payload) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

        await connectToDatabase();

        const { searchParams } = new URL(req.url);
        const dateFilter = searchParams.get('date') || new Date().toISOString().split('T')[0];

        let appointments;
        if (payload.role === 'admin') {
            appointments = await Appointment.find({ date: dateFilter })
                .sort({ tokenNumber: 1 })
                .populate('doctorId', 'name specialty');
        } else {
            appointments = await Appointment.find({ patientId: payload.userId, date: dateFilter })
                .sort({ tokenNumber: 1 })
                .populate('doctorId', 'name specialty');
        }

        return NextResponse.json({ appointments }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: 'Error fetching appointments', error: error.message }, { status: 500 });
    }
}
