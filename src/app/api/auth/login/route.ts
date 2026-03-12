import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { encrypt } from '@/lib/auth';
import { logAction, getClientIp } from '@/utils/auditLogger';
import { AUDIT_ACTIONS } from '@/utils/auditActions';

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ message: 'Missing credentials' }, { status: 400 });
        }

        await connectToDatabase();

        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
        }

        // Create session payload
        const payload = {
            userId: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
        };

        const sessionToken = await encrypt(payload);

        // Set cookie
        // Next.js 15: cookies() is async, so we await it. Wait, depending on Next.js version, it's async in Next.js 15. We are on "latest", so likely 15+. Let's just await it.
        const cookieStore = await cookies();
        cookieStore.set({
            name: 'session',
            value: sessionToken,
            httpOnly: true,
            path: '/',
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24, // 24 hours
        });

        // Audit log: record successful login
        logAction({
            userId: user._id.toString(),
            action: AUDIT_ACTIONS.LOGIN,
            resource: 'auth',
            details: { email: user.email },
            ipAddress: getClientIp(req.headers),
            userAgent: req.headers.get('user-agent') ?? '',
        });

        return NextResponse.json({ message: 'Logged in successfully', user: payload }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: 'Error logging in', error: error.message }, { status: 500 });
    }
}
