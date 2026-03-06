import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
    try {
        const { name, email, password } = await req.json();

        if (!name || !email || !password) {
            return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
        }

        await connectToDatabase();

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ message: 'User already exists' }, { status: 409 });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            role: 'patient', // default role
        });

        return NextResponse.json({ message: 'User registered successfully' }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ message: 'Error registering user', error: error.message }, { status: 500 });
    }
}
