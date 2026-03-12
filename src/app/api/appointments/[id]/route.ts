import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import connectToDatabase from '@/lib/mongodb';
import Appointment from '@/models/Appointment';
import { decrypt } from '@/lib/auth';
import { logAction, getClientIp } from '@/utils/auditLogger';
import { AUDIT_ACTIONS } from '@/utils/auditActions';

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

        const updated = await Appointment.findByIdAndUpdate(id, { $set: body }, { new: true });
        if (!updated) {
            return NextResponse.json({ message: 'Appointment not found' }, { status: 404 });
        }

        // Audit log: record appointment update
        logAction({
            userId: payload.userId as string,
            action: AUDIT_ACTIONS.UPDATE,
            resource: 'appointment',
            details: { appointmentId: id, updatedFields: Object.keys(body) },
            ipAddress: getClientIp(req.headers),
            userAgent: req.headers.get('user-agent') ?? '',
        });

        return NextResponse.json({ message: 'Appointment updated', appointment: updated }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: 'Error updating appointment', error: error.message }, { status: 500 });
    }
}
