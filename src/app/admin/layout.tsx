"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Layout, Spin } from 'antd';
import Navbar from '@/components/Navbar';
import AdminSidebar from '@/components/AdminSidebar';

const { Content } = Layout;

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
        <>
            <Navbar />
            <Layout>
                <AdminSidebar />
                <Content className="dashboard-container" style={{ minHeight: 'calc(100vh - 64px)', background: '#f8feff' }}>
                    {children}
                </Content>
            </Layout>
        </>
    );
}
