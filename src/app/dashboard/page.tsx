"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Layout, Typography, Row, Col, Card, Button, Space, Spin } from 'antd';
import { CalendarOutlined, OrderedListOutlined, LogoutOutlined } from '@ant-design/icons';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import TokenDisplay from '@/components/TokenDisplay';

const { Content } = Layout;
const { Title, Text } = Typography;

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
            <Content className="dashboard-container" style={{ maxWidth: 1000, margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                    <div>
                        <Title level={3} style={{ margin: 0 }}>Welcome, {user?.name}!</Title>
                        <Text type="secondary">Manage your appointments and track your queue</Text>
                    </div>
                    <Button icon={<LogoutOutlined />} onClick={handleLogout}>Logout</Button>
                </div>

                <Row gutter={[24, 24]}>
                    {/* Quick Actions */}
                    <Col xs={24} md={12}>
                        <Card variant="borderless" style={{ borderRadius: 12, height: '100%' }}>
                            <Title level={5} style={{ marginBottom: 16 }}>Quick Actions</Title>
                            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                                <Link href="/book" style={{ width: '100%' }}>
                                    <Button type="primary" icon={<CalendarOutlined />} block size="large" style={{ height: 48 }}>
                                        Book Appointment
                                    </Button>
                                </Link>
                                <Link href="/queue" style={{ width: '100%' }}>
                                    <Button icon={<OrderedListOutlined />} block size="large" style={{ height: 48 }}>
                                        View Live Queue
                                    </Button>
                                </Link>
                            </Space>
                        </Card>
                    </Col>

                    {/* Latest Token */}
                    <Col xs={24} md={12}>
                        {latestAppointment ? (
                            <TokenDisplay
                                tokenNumber={latestAppointment.tokenNumber}
                                doctorName={latestAppointment.doctorId?.name}
                                estimatedWaitTime={latestAppointment.estimatedWaitTime}
                            />
                        ) : (
                            <Card variant="borderless" style={{ borderRadius: 12, textAlign: 'center', padding: 32, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <div>
                                    <Title level={5} type="secondary">No Token Yet</Title>
                                    <Text type="secondary">Book an appointment to receive your digital token</Text>
                                </div>
                            </Card>
                        )}
                    </Col>
                </Row>

                {/* Appointments List */}
                {appointments.length > 0 && (
                    <Card variant="borderless" style={{ borderRadius: 12, marginTop: 24 }}>
                        <Title level={5}>Today&apos;s Appointments</Title>
                        {appointments.map((app) => (
                            <Card key={app._id} size="small" style={{ marginBottom: 8, borderRadius: 8 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <Text strong>Token #{app.tokenNumber}</Text>
                                        <Text type="secondary" style={{ marginLeft: 12 }}>
                                            Dr. {app.doctorId?.name || 'N/A'}
                                        </Text>
                                    </div>
                                    <Text type={app.status === 'completed' ? 'success' : app.status === 'in-progress' ? 'warning' : 'secondary'} strong style={{ textTransform: 'capitalize' }}>
                                        {app.status}
                                    </Text>
                                </div>
                            </Card>
                        ))}
                    </Card>
                )}
            </Content>
        </>
    );
}
