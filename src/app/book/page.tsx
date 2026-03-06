"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Layout, Typography, Row, Col, Card, Spin, Alert } from 'antd';
import Navbar from '@/components/Navbar';
import BookingForm from '@/components/BookingForm';
import TokenDisplay from '@/components/TokenDisplay';

const { Content } = Layout;
const { Title, Text } = Typography;

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
            <Content className="dashboard-container" style={{ maxWidth: 900, margin: '0 auto' }}>
                <Title level={3} style={{ marginBottom: 8 }}>Book Appointment</Title>
                <Text type="secondary" style={{ marginBottom: 24, display: 'block' }}>Fill in the details to book your appointment</Text>

                <Row gutter={[24, 24]}>
                    <Col xs={24} md={14}>
                        <Card className="glass-panel" variant="borderless" style={{ borderRadius: 12 }}>
                            <BookingForm onSuccess={(appointment) => setBookedAppointment(appointment)} />
                        </Card>
                    </Col>

                    <Col xs={24} md={10}>
                        {bookedAppointment ? (
                            <>
                                <Alert
                                    message="Appointment Booked!"
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
                            <Card className="glass-panel" variant="borderless" style={{ borderRadius: 12, textAlign: 'center', padding: 32, background: 'linear-gradient(135deg, rgba(230, 244, 255, 0.7), rgba(240, 245, 255, 0.7))' }}>
                                <Title level={5} type="secondary">Your Token</Title>
                                <Text type="secondary">Submit the form to receive your digital token</Text>
                            </Card>
                        )}
                    </Col>
                </Row>
            </Content>
        </>
    );
}
