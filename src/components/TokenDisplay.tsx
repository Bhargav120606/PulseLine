"use client";

import { Card, Typography } from 'antd';
import { NumberOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface TokenDisplayProps {
    tokenNumber: number;
    doctorName?: string;
    estimatedWaitTime?: number;
}

export default function TokenDisplay({ tokenNumber, doctorName, estimatedWaitTime }: TokenDisplayProps) {
    return (
        <Card className="token-display" variant="borderless">
            <NumberOutlined style={{ fontSize: 32, color: '#00bcd4', marginBottom: 8 }} />
            <Title level={5} style={{ margin: '8px 0', color: '#666' }}>Your Digital Token</Title>
            <div className="token-number">#{tokenNumber}</div>
            {doctorName && (
                <Text type="secondary" style={{ display: 'block', marginTop: 12, fontSize: 16 }}>
                    Doctor: <strong>{doctorName}</strong>
                </Text>
            )}
            {estimatedWaitTime !== undefined && (
                <Text type="secondary" style={{ display: 'block', marginTop: 4, fontSize: 14 }}>
                    Estimated wait: ~{estimatedWaitTime} min
                </Text>
            )}
        </Card>
    );
}
