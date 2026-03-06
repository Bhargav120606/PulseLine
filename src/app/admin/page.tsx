"use client";

import { useEffect, useState, useCallback } from 'react';
import { Typography, Table, Button, Space, Tag, App, Spin } from 'antd';
import { PlayCircleOutlined, ForwardOutlined, CheckCircleOutlined } from '@ant-design/icons';
import DashboardStats from '@/components/DashboardStats';

const { Title } = Typography;

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
            // If starting a new consultation, first move any in-progress to completed
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

    if (loading) return <Spin size="large" />;

    const columns = [
        {
            title: 'Token',
            dataIndex: 'tokenNumber',
            key: 'tokenNumber',
            render: (t: number) => <Tag color="blue">#{t}</Tag>,
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
                                icon={<PlayCircleOutlined />}
                                onClick={() => handleAction(record._id, 'in-progress')}
                            >
                                Call In
                            </Button>
                            <Button
                                danger
                                size="small"
                                icon={<ForwardOutlined />}
                                onClick={() => handleAction(record._id, 'skipped')}
                            >
                                Skip
                            </Button>
                        </>
                    )}
                    {record.status === 'in-progress' && (
                        <Button
                            type="primary"
                            size="small"
                            style={{ background: '#52c41a', borderColor: '#52c41a' }}
                            icon={<CheckCircleOutlined />}
                            onClick={() => handleAction(record._id, 'completed')}
                        >
                            Complete
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
            <Title level={3}>Admin Dashboard</Title>

            <DashboardStats
                totalToday={queueData?.totalToday || 0}
                waiting={queueData?.waitingPatients || 0}
                completed={queueData?.completedPatients || 0}
                averageWaitTime={15}
            />

            <div style={{ marginTop: 24 }}>
                <Title level={5}>Today&apos;s Queue</Title>
                <Table
                    dataSource={allAppointments}
                    columns={columns}
                    rowKey="_id"
                    pagination={false}
                    bordered
                    style={{ borderRadius: 8, overflow: 'hidden' }}
                />
            </div>
        </div>
    );
}
