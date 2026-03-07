"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Spin } from 'antd';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TokenDisplay from '@/components/TokenDisplay';
import Link from 'next/link';

export default function PatientDashboard() {
    const [user, setUser] = useState<any>(null);
    const [appointments, setAppointments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userRes = await fetch('/api/user/me');
                if (!userRes.ok) { router.push('/login'); return; }
                const userData = await userRes.json();
                if (userData.user.role === 'admin') { router.push('/admin'); return; }
                setUser(userData.user);

                const appRes = await fetch('/api/appointments');
                if (appRes.ok) {
                    const appData = await appRes.json();
                    setAppointments(appData.appointments || []);
                }
            } catch {
                router.push('/login');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [router]);

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/');
        router.refresh();
    };

    if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}><Spin size="large" /></div>;

    const latestAppointment = appointments.length > 0 ? appointments[appointments.length - 1] : null;

    return (
        <>
            <Navbar />
            <main style={{ maxWidth: 1000, margin: '0 auto', padding: 32 }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
                    <div>
                        <h1 style={{ fontSize: 28, fontWeight: 900, color: '#0f172a', margin: '0 0 4px', letterSpacing: '-0.02em' }}>
                            Welcome, {user?.name}!
                        </h1>
                        <p style={{ color: '#64748b', fontSize: 15, margin: 0, fontWeight: 500 }}>Manage your appointments and track your queue</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            padding: '8px 16px',
                            borderRadius: 8,
                            background: '#ffffff',
                            border: '1px solid #e2e8f0',
                            cursor: 'pointer',
                            color: '#64748b',
                            fontWeight: 600,
                            fontSize: 14,
                            fontFamily: 'inherit',
                            transition: 'background 0.2s',
                        }}
                    >
                        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>logout</span>
                        Logout
                    </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
                    {/* Quick Actions */}
                    <div style={{
                        background: 'rgba(255, 255, 255, 0.6)',
                        backdropFilter: 'blur(16px)',
                        WebkitBackdropFilter: 'blur(16px)',
                        borderRadius: 12,
                        border: '1px solid rgba(255, 255, 255, 0.4)',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                        padding: 24,
                    }}>
                        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20, color: '#0f172a' }}>Quick Actions</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            <Link href="/book" style={{ textDecoration: 'none' }}>
                                <button style={{
                                    width: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: 10,
                                    padding: '14px 20px',
                                    borderRadius: 8,
                                    background: '#26c6da',
                                    color: '#ffffff',
                                    fontWeight: 700,
                                    fontSize: 15,
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontFamily: 'inherit',
                                }}>
                                    <span className="material-symbols-outlined" style={{ fontSize: 20 }}>calendar_month</span>
                                    Book Appointment
                                </button>
                            </Link>
                            <Link href="/queue" style={{ textDecoration: 'none' }}>
                                <button style={{
                                    width: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: 10,
                                    padding: '14px 20px',
                                    borderRadius: 8,
                                    background: '#ffffff',
                                    color: '#0f172a',
                                    fontWeight: 700,
                                    fontSize: 15,
                                    border: '1px solid #e2e8f0',
                                    cursor: 'pointer',
                                    fontFamily: 'inherit',
                                }}>
                                    <span className="material-symbols-outlined" style={{ fontSize: 20 }}>monitoring</span>
                                    View Live Queue
                                </button>
                            </Link>
                        </div>
                    </div>

                    {/* Latest Token */}
                    {latestAppointment ? (
                        <TokenDisplay
                            tokenNumber={latestAppointment.tokenNumber}
                            doctorName={latestAppointment.doctorId?.name}
                            estimatedWaitTime={latestAppointment.estimatedWaitTime}
                        />
                    ) : (
                        <div style={{
                            background: 'rgba(255, 255, 255, 0.6)',
                            backdropFilter: 'blur(16px)',
                            WebkitBackdropFilter: 'blur(16px)',
                            borderRadius: 12,
                            border: '1px solid rgba(255, 255, 255, 0.4)',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                            padding: 32,
                            textAlign: 'center',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            <div>
                                <span className="material-symbols-outlined" style={{ fontSize: 48, color: '#cbd5e1', marginBottom: 12, display: 'block' }}>confirmation_number</span>
                                <h4 style={{ color: '#94a3b8', fontWeight: 600, fontSize: 16, margin: '0 0 4px' }}>No Token Yet</h4>
                                <p style={{ color: '#94a3b8', fontSize: 14, margin: 0 }}>Book an appointment to receive your digital token</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Appointments List */}
                {appointments.length > 0 && (
                    <div style={{
                        marginTop: 24,
                        background: 'rgba(255, 255, 255, 0.6)',
                        backdropFilter: 'blur(16px)',
                        WebkitBackdropFilter: 'blur(16px)',
                        borderRadius: 12,
                        border: '1px solid rgba(255, 255, 255, 0.4)',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                        padding: 24,
                    }}>
                        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: '#0f172a' }}>Today&apos;s Appointments</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {appointments.map((app) => (
                                <div key={app._id} style={{
                                    padding: '12px 16px',
                                    borderRadius: 8,
                                    border: '1px solid #f1f5f9',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                        <span style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            padding: '2px 10px',
                                            borderRadius: 4,
                                            background: 'rgba(38, 198, 218, 0.1)',
                                            color: '#26c6da',
                                            fontSize: 14,
                                            fontWeight: 700,
                                        }}>
                                            #{app.tokenNumber}
                                        </span>
                                        <span style={{ color: '#64748b', fontSize: 14, fontWeight: 500 }}>
                                            Dr. {app.doctorId?.name || 'N/A'}
                                        </span>
                                    </div>
                                    <span style={{
                                        fontSize: 12,
                                        fontWeight: 700,
                                        textTransform: 'uppercase',
                                        color: app.status === 'completed' ? '#22c55e' : app.status === 'in-progress' ? '#f59e0b' : '#94a3b8',
                                    }}>
                                        {app.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </main>
            <Footer />
        </>
    );
}
