"use client";

import { useEffect, useState } from 'react';
import { Typography, Card, Row, Col, Spin } from 'antd';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import DashboardStats from '@/components/DashboardStats';

const { Title } = Typography;

const COLORS = ['#00bcd4', '#52c41a', '#fa8c16', '#ff4d4f'];

export default function ReportsPage() {
    const [reportData, setReportData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/reports')
            .then((res) => res.json())
            .then((data) => setReportData(data))
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <Spin size="large" />;

    const barData = [
        { name: 'Total', value: reportData?.totalToday || 0 },
        { name: 'Completed', value: reportData?.completed || 0 },
        { name: 'Waiting', value: reportData?.waiting || 0 },
        { name: 'Skipped', value: reportData?.skipped || 0 },
    ];

    const pieData = [
        { name: 'Completed', value: reportData?.completed || 0 },
        { name: 'Waiting', value: reportData?.waiting || 0 },
        { name: 'In Progress', value: reportData?.inProgress || 0 },
        { name: 'Skipped', value: reportData?.skipped || 0 },
    ].filter((d) => d.value > 0);

    return (
        <div>
            <Title level={3}>Daily Reports</Title>

            <DashboardStats
                totalToday={reportData?.totalToday || 0}
                waiting={reportData?.waiting || 0}
                completed={reportData?.completed || 0}
                averageWaitTime={reportData?.averageWaitTime || 0}
            />

            <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
                <Col xs={24} md={14}>
                    <Card variant="borderless" style={{ borderRadius: 12 }}>
                        <Title level={5}>Patient Summary</Title>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={barData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis allowDecimals={false} />
                                <Tooltip />
                                <Bar dataKey="value" fill="#00bcd4" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>

                <Col xs={24} md={10}>
                    <Card variant="borderless" style={{ borderRadius: 12 }}>
                        <Title level={5}>Status Breakdown</Title>
                        {pieData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={100}
                                        label={({ name, value }) => `${name}: ${value}`}
                                    >
                                        {pieData.map((_, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div style={{ textAlign: 'center', padding: 48, color: '#999' }}>No data to display</div>
                        )}
                    </Card>
                </Col>
            </Row>
        </div>
    );
}
