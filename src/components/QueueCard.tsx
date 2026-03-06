"use client";

import { Card, Tag, Typography, Progress, Statistic, Row, Col } from 'antd';
import { ClockCircleOutlined, UserOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface QueueCardProps {
    currentToken: number | null;
    nextTokens: number[];
    waitingPatients: number;
    estimatedWaitTime: number;
}

export default function QueueCard({ currentToken, nextTokens, waitingPatients, estimatedWaitTime }: QueueCardProps) {
    const progressPercent = waitingPatients > 0 ? Math.min(100, Math.round(((20 - waitingPatients) / 20) * 100)) : 100;

    return (
        <div>
            {/* Current Token */}
            <div className="queue-current" style={{ marginBottom: 24 }}>
                <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 16 }}>Now Serving</Text>
                <div className="token-big" style={{ color: '#fff' }}>
                    {currentToken ? `#${currentToken}` : '--'}
                </div>
            </div>

            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col xs={12}>
                    <Card variant="borderless" style={{ borderRadius: 12 }}>
                        <Statistic
                            title="Waiting"
                            value={waitingPatients}
                            prefix={<UserOutlined />}
                            styles={{ content: { color: '#fa8c16' } }}
                        />
                    </Card>
                </Col>
                <Col xs={12}>
                    <Card variant="borderless" style={{ borderRadius: 12 }}>
                        <Statistic
                            title="Est. Wait"
                            value={estimatedWaitTime}
                            suffix="min"
                            prefix={<ClockCircleOutlined />}
                            styles={{ content: { color: '#722ed1' } }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Progress */}
            <Card variant="borderless" style={{ borderRadius: 12, marginBottom: 24 }}>
                <Title level={5}>Queue Progress</Title>
                <Progress percent={progressPercent} status="active" strokeColor="#00bcd4" />
            </Card>

            {/* Next In Queue */}
            <Card variant="borderless" style={{ borderRadius: 12 }}>
                <Title level={5}>Next In Line</Title>
                {nextTokens.length === 0 ? (
                    <Text type="secondary">No patients waiting</Text>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {nextTokens.slice(0, 10).map((token, index) => (
                            <div key={token} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', borderBottom: index < Math.min(nextTokens.length, 10) - 1 ? '1px solid #f0f0f0' : 'none' }}>
                                <div>
                                    <Tag color={index === 0 ? 'blue' : 'default'} style={{ margin: 0 }}>Token #{token}</Tag>
                                </div>
                                {index === 0 && <Tag color="green" style={{ margin: 0 }}>Next</Tag>}
                            </div>
                        ))}
                    </div>
                )}
            </Card>
        </div>
    );
}
