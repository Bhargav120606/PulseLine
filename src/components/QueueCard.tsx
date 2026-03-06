"use client";

import { Card, Tag, List, Typography, Progress, Statistic, Row, Col } from 'antd';
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
                    <Card bordered={false} style={{ borderRadius: 12 }}>
                        <Statistic
                            title="Waiting"
                            value={waitingPatients}
                            prefix={<UserOutlined />}
                            valueStyle={{ color: '#fa8c16' }}
                        />
                    </Card>
                </Col>
                <Col xs={12}>
                    <Card bordered={false} style={{ borderRadius: 12 }}>
                        <Statistic
                            title="Est. Wait"
                            value={estimatedWaitTime}
                            suffix="min"
                            prefix={<ClockCircleOutlined />}
                            valueStyle={{ color: '#722ed1' }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Progress */}
            <Card bordered={false} style={{ borderRadius: 12, marginBottom: 24 }}>
                <Title level={5}>Queue Progress</Title>
                <Progress percent={progressPercent} status="active" strokeColor="#1677ff" />
            </Card>

            {/* Next In Queue */}
            <Card bordered={false} style={{ borderRadius: 12 }}>
                <Title level={5}>Next In Line</Title>
                {nextTokens.length === 0 ? (
                    <Text type="secondary">No patients waiting</Text>
                ) : (
                    <List
                        size="small"
                        dataSource={nextTokens.slice(0, 10)}
                        renderItem={(token, index) => (
                            <List.Item>
                                <Tag color={index === 0 ? 'blue' : 'default'}>Token #{token}</Tag>
                                {index === 0 && <Tag color="green">Next</Tag>}
                            </List.Item>
                        )}
                    />
                )}
            </Card>
        </div>
    );
}
