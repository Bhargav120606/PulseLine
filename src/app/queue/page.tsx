"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Spin } from 'antd';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import QueueCard from '@/components/QueueCard';

export default function QueuePage() {
    const [queueData, setQueueData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const fetchQueue = async () => {
        try {
            const userRes = await fetch('/api/user/me');
            if (!userRes.ok) { router.push('/login'); return; }

            const res = await fetch('/api/queue');
            if (res.ok) {
                const data = await res.json();
                setQueueData(data);
            }
        } catch {
            router.push('/login');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQueue();
        const interval = setInterval(fetchQueue, 10000);
        return () => clearInterval(interval);
    }, []);

    if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}><Spin size="large" /></div>;

    return (
        <>
            <Navbar />
            <main style={{ flex: 1, padding: 32, maxWidth: 1400, margin: '0 auto', width: '100%' }}>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <div style={{ color: '#26c6da' }}>
                            <span className="material-symbols-outlined" style={{ fontSize: 32 }}>medical_services</span>
                        </div>
                        <div>
                            <h1 style={{ fontSize: 24, fontWeight: 800, color: '#26c6da', textTransform: 'uppercase', letterSpacing: '-0.02em', margin: 0 }}>PulseLine Clinic</h1>
                            <p style={{ color: '#94a3b8', fontSize: 14, fontWeight: 500, margin: 0 }}>Live Queue Dashboard</p>
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(38, 198, 218, 0.1)', padding: 12, borderRadius: 8 }}>
                        <span className="material-symbols-outlined" style={{ color: '#26c6da', fontSize: 24 }}>schedule</span>
                    </div>
                </div>

                {queueData ? (
                    <QueueCard
                        currentToken={queueData.currentToken}
                        nextTokens={queueData.nextTokens}
                        waitingPatients={queueData.waitingPatients}
                        estimatedWaitTime={queueData.estimatedWaitTime}
                    />
                ) : (
                    <p style={{ color: '#94a3b8' }}>Unable to load queue data</p>
                )}
            </main>
            <Footer />
        </>
    );
}
