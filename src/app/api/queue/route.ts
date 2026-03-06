export const dynamic = 'force-dynamic';

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
        if (!payload) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

        await connectToDatabase();

        const today = new Date().toISOString().split('T')[0];

        // Get all today's appointments
        const allToday = await Appointment.find({ date: today }).populate('doctorId', 'name specialty');

        const currentlyServing = allToday.find((a) => a.status === 'in-progress');
        const waitingList = allToday.filter((a) => a.status === 'waiting').sort((a, b) => a.tokenNumber - b.tokenNumber);
        const completedList = allToday.filter((a) => a.status === 'completed');
        const skippedList = allToday.filter((a) => a.status === 'skipped');

        return NextResponse.json({
            currentToken: currentlyServing?.tokenNumber || null,
            currentAppointment: currentlyServing || null,
            nextTokens: waitingList.map((a) => a.tokenNumber),
            waitingPatients: waitingList.length,
            completedPatients: completedList.length,
            skippedPatients: skippedList.length,
            totalToday: allToday.length,
            estimatedWaitTime: waitingList.length * 15,
            waitingList,
            completedList,
        }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: 'Error fetching queue', error: error.message }, { status: 500 });
    }
}
