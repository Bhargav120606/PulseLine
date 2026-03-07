"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Spin } from 'antd';
import Navbar from '@/components/Navbar';
import AdminSidebar from '@/components/AdminSidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [authorized, setAuthorized] = useState(false);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        fetch('/api/user/me')
            .then((res) => res.json())
            .then((data) => {
                if (data.authenticated && data.user.role === 'admin') {
                    setAuthorized(true);
                } else {
                    router.push('/login');
                }
            })
            .catch(() => router.push('/login'))
            .finally(() => setLoading(false));
    }, [router]);

    if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}><Spin size="large" /></div>;
    if (!authorized) return null;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#f6f6f8' }}>
            <Navbar />
            <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
                <AdminSidebar />
                <main style={{
                    flex: 1,
                    overflowY: 'auto',
                    padding: 32,
                    background: '#f6f6f8',
                }}>
                    {children}
                </main>
            </div>
        </div>
    );
}
