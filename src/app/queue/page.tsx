"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Layout, Typography, Spin } from 'antd';
import Navbar from '@/components/Navbar';
import QueueCard from '@/components/QueueCard';

const { Content } = Layout;
const { Title, Text } = Typography;

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
        const interval = setInterval(fetchQueue, 10000); // Refresh every 10 seconds
        return () => clearInterval(interval);
    }, []);

    if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}><Spin size="large" /></div>;

    return (
        <>
            <Navbar />
            <Content className="dashboard-container" style={{ maxWidth: 700, margin: '0 auto' }}>
                <Title level={3} style={{ marginBottom: 8 }}>Live Queue Status</Title>
                <Text type="secondary" style={{ marginBottom: 24, display: 'block' }}>Auto-refreshes every 10 seconds</Text>

                {queueData ? (
                    <QueueCard
                        currentToken={queueData.currentToken}
                        nextTokens={queueData.nextTokens}
                        waitingPatients={queueData.waitingPatients}
                        estimatedWaitTime={queueData.estimatedWaitTime}
                    />
                ) : (
                    <Text type="secondary">Unable to load queue data</Text>
                )}
            </Content>
        </>
    );
}
