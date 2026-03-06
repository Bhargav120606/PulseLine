"use client";

import { Card, Statistic, Row, Col } from 'antd';
import { TeamOutlined, ClockCircleOutlined, CheckCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

interface DashboardStatsProps {
    totalToday: number;
    waiting: number;
    completed: number;
    averageWaitTime?: number;
}

export default function DashboardStats({ totalToday, waiting, completed, averageWaitTime }: DashboardStatsProps) {
    return (
        <Row gutter={[16, 16]}>
            <Col xs={12} sm={6}>
                <Card variant="borderless" style={{ borderRadius: 12, background: '#e6f7ff' }}>
                    <Statistic
                        title="Total Today"
                        value={totalToday}
                        prefix={<TeamOutlined style={{ color: '#00bcd4' }} />}
                        styles={{ content: { color: '#00bcd4' } }}
                    />
                </Card>
            </Col>
            <Col xs={12} sm={6}>
                <Card variant="borderless" style={{ borderRadius: 12, background: '#e6f7ff' }}>
                    <Statistic
                        title="Waiting"
                        value={waiting}
                        prefix={<ExclamationCircleOutlined style={{ color: '#fa8c16' }} />}
                        styles={{ content: { color: '#fa8c16' } }}
                    />
                </Card>
            </Col>
            <Col xs={12} sm={6}>
                <Card variant="borderless" style={{ borderRadius: 12, background: '#e6f7ff' }}>
                    <Statistic
                        title="Completed"
                        value={completed}
                        prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
                        styles={{ content: { color: '#52c41a' } }}
                    />
                </Card>
            </Col>
            {averageWaitTime !== undefined && (
                <Col xs={12} sm={6}>
                    <Card variant="borderless" style={{ borderRadius: 12, background: '#e6f7ff' }}>
                        <Statistic
                            title="Avg Wait"
                            value={averageWaitTime}
                            suffix="min"
                            prefix={<ClockCircleOutlined style={{ color: '#722ed1' }} />}
                            styles={{ content: { color: '#722ed1' } }}
                        />
                    </Card>
                </Col>
            )}
        </Row>
    );
}
