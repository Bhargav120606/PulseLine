"use client";

import { useEffect, useState, useCallback } from 'react';
import { Table, Button, Space, Tag, App, Spin } from 'antd';
import DashboardStats from '@/components/DashboardStats';

export default function AdminDashboard() {
    const [queueData, setQueueData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const { message } = App.useApp();

    const fetchData = useCallback(async () => {
        try {
            const res = await fetch('/api/queue');
            if (res.ok) {
                const data = await res.json();
                setQueueData(data);
            }
        } catch {
            console.error('Failed to fetch queue data');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 5000);
        return () => clearInterval(interval);
    }, [fetchData]);

    const handleAction = async (id: string, status: string) => {
        try {
            if (status === 'in-progress' && queueData?.currentAppointment) {
                await fetch(`/api/appointments/${queueData.currentAppointment._id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ status: 'completed' }),
                });
            }

            const res = await fetch(`/api/appointments/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status }),
            });
            if (res.ok) {
                message.success(`Patient ${status === 'completed' ? 'completed' : status === 'skipped' ? 'skipped' : 'called in'}`);
                fetchData();
            }
        } catch {
            message.error('Action failed');
        }
    };

    if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}><Spin size="large" /></div>;

    const columns = [
        {
            title: 'Token',
            dataIndex: 'tokenNumber',
            key: 'tokenNumber',
            render: (t: number) => (
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
                    #{t}
                </span>
            ),
        },
        {
            title: 'Patient',
            dataIndex: 'patientName',
            key: 'patientName',
        },
        {
            title: 'Doctor',
            dataIndex: ['doctorId', 'name'],
            key: 'doctor',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => {
                const colorMap: Record<string, string> = {
                    'waiting': 'orange',
                    'in-progress': 'processing',
                    'completed': 'green',
                    'skipped': 'red',
                };
                return <Tag color={colorMap[status] || 'default'}>{status.toUpperCase()}</Tag>;
            },
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: any) => (
                <Space>
                    {record.status === 'waiting' && (
                        <>
                            <Button
                                type="primary"
                                size="small"
                                style={{ background: '#26c6da', borderColor: '#26c6da' }}
                                onClick={() => handleAction(record._id, 'in-progress')}
                            >
                                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>play_circle</span>
                                    Call In
                                </span>
                            </Button>
                            <Button
                                danger
                                size="small"
                                onClick={() => handleAction(record._id, 'skipped')}
                            >
                                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>fast_forward</span>
                                    Skip
                                </span>
                            </Button>
                        </>
                    )}
                    {record.status === 'in-progress' && (
                        <Button
                            type="primary"
                            size="small"
                            style={{ background: '#22c55e', borderColor: '#22c55e' }}
                            onClick={() => handleAction(record._id, 'completed')}
                        >
                            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>check_circle</span>
                                Complete
                            </span>
                        </Button>
                    )}
                </Space>
            ),
        },
    ];

    const allAppointments = [
        ...(queueData?.currentAppointment ? [queueData.currentAppointment] : []),
        ...(queueData?.waitingList || []),
        ...(queueData?.completedList || []),
    ];

    return (
        <div>
            {/* Header */}
            <div style={{ marginBottom: 32 }}>
                <h1 style={{ fontSize: 28, fontWeight: 900, color: '#0f172a', margin: '0 0 4px', letterSpacing: '-0.02em' }}>Admin Dashboard</h1>
                <p style={{ color: '#64748b', fontSize: 15, margin: 0, fontWeight: 500 }}>Manage and optimize your clinic operations</p>
            </div>

            <DashboardStats
                totalToday={queueData?.totalToday || 0}
                waiting={queueData?.waitingPatients || 0}
                completed={queueData?.completedPatients || 0}
                averageWaitTime={15}
            />

            <div style={{
                marginTop: 24,
                background: '#ffffff',
                borderRadius: 12,
                border: '1px solid #e2e8f0',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                overflow: 'hidden',
            }}>
                <div style={{ padding: '16px 24px', borderBottom: '1px solid #f1f5f9' }}>
                    <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: '#0f172a' }}>Today&apos;s Queue</h3>
                </div>
                <Table
                    dataSource={allAppointments}
                    columns={columns}
                    rowKey="_id"
                    pagination={false}
                    style={{ borderRadius: 0 }}
                />
            </div>
        </div>
    );
}
