import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import connectToDatabase from '@/lib/mongodb';
import Appointment from '@/models/Appointment';
import { decrypt } from '@/lib/auth';

export async function GET() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('session')?.value;
        if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

        const payload = await decrypt(token);
        if (!payload || payload.role !== 'admin') {
            return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
        }

        await connectToDatabase();

        const today = new Date().toISOString().split('T')[0];

        const allToday = await Appointment.find({ date: today });

        const totalToday = allToday.length;
        const completed = allToday.filter((a) => a.status === 'completed').length;
        const waiting = allToday.filter((a) => a.status === 'waiting').length;
        const skipped = allToday.filter((a) => a.status === 'skipped').length;
        const inProgress = allToday.filter((a) => a.status === 'in-progress').length;

        // Average wait time for completed patients
        const completedAppointments = allToday.filter((a) => a.status === 'completed');
        let averageWaitTime = 0;
        if (completedAppointments.length > 0) {
            const totalWait = completedAppointments.reduce((sum, a) => sum + a.estimatedWaitTime, 0);
            averageWaitTime = Math.round(totalWait / completedAppointments.length);
        }

        return NextResponse.json({
            totalToday,
            completed,
            waiting,
            skipped,
            inProgress,
            averageWaitTime,
        }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: 'Error fetching reports', error: error.message }, { status: 500 });
    }
}
