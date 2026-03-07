"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Spin, Alert } from 'antd';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BookingForm from '@/components/BookingForm';
import TokenDisplay from '@/components/TokenDisplay';

export default function BookPage() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [bookedAppointment, setBookedAppointment] = useState<any>(null);
    const router = useRouter();

    useEffect(() => {
        fetch('/api/user/me')
            .then((res) => {
                if (!res.ok) throw new Error();
                return res.json();
            })
            .then((data) => setUser(data.user))
            .catch(() => router.push('/login'))
            .finally(() => setLoading(false));
    }, [router]);

    if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}><Spin size="large" /></div>;

    return (
        <>
            <Navbar />
            <main style={{ maxWidth: 900, margin: '0 auto', padding: 32 }}>
                <div style={{ marginBottom: 24 }}>
                    <h1 style={{ fontSize: 28, fontWeight: 900, color: '#0f172a', margin: '0 0 4px', letterSpacing: '-0.02em' }}>Book Appointment</h1>
                    <p style={{ color: '#64748b', fontSize: 15, margin: 0, fontWeight: 500 }}>Fill in the details to book your appointment</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
                    {/* Booking Form */}
                    <div style={{
                        background: 'rgba(255, 255, 255, 0.6)',
                        backdropFilter: 'blur(16px)',
                        WebkitBackdropFilter: 'blur(16px)',
                        borderRadius: 12,
                        border: '1px solid rgba(255, 255, 255, 0.4)',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                        padding: 24,
                    }}>
                        <BookingForm onSuccess={(appointment) => setBookedAppointment(appointment)} />
                    </div>

                    {/* Token Display / Placeholder */}
                    <div>
                        {bookedAppointment ? (
                            <>
                                <Alert
                                    title="Appointment Booked!"
                                    description="Your digital token has been generated."
                                    type="success"
                                    showIcon
                                    style={{ marginBottom: 16, borderRadius: 8 }}
                                />
                                <TokenDisplay
                                    tokenNumber={bookedAppointment.tokenNumber}
                                    estimatedWaitTime={bookedAppointment.estimatedWaitTime}
                                />
                            </>
                        ) : (
                            <div style={{
                                background: 'rgba(255, 255, 255, 0.6)',
                                backdropFilter: 'blur(16px)',
                                WebkitBackdropFilter: 'blur(16px)',
                                borderRadius: 12,
                                border: '1px solid rgba(255, 255, 255, 0.4)',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                                textAlign: 'center',
                                padding: 48,
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                                <span className="material-symbols-outlined" style={{ fontSize: 56, color: '#cbd5e1', marginBottom: 16 }}>confirmation_number</span>
                                <h4 style={{ color: '#94a3b8', fontWeight: 600, fontSize: 16, margin: '0 0 4px' }}>Your Token</h4>
                                <p style={{ color: '#94a3b8', fontSize: 14, margin: 0 }}>Submit the form to receive your digital token</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
