"use client";

import { Form, Input, Button, Card, Typography, App, Divider } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Navbar from '@/components/Navbar';

const { Title, Text } = Typography;

export default function LoginPage() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { message } = App.useApp();

    const handleLogin = async (values: any) => {
        setLoading(true);
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            message.success('Login successful!');
            if (data.user?.role === 'admin') {
                router.push('/admin');
            } else {
                router.push('/dashboard');
            }
            router.refresh();
        } catch (err: any) {
            message.error(err.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            <div className="auth-container">
                <Card className="auth-card" variant="borderless" style={{ borderRadius: 16, boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}>
                    <div style={{ textAlign: 'center', marginBottom: 24 }}>
                        <Title level={3} style={{ margin: 0 }}>Welcome Back</Title>
                        <Text type="secondary">Sign in to your PulseLine account</Text>
                    </div>

                    <Form layout="vertical" onFinish={handleLogin} size="large">
                        <Form.Item name="email" rules={[{ required: true, type: 'email', message: 'Enter a valid email' }]}>
                            <Input prefix={<MailOutlined />} placeholder="Email" />
                        </Form.Item>

                        <Form.Item name="password" rules={[{ required: true, message: 'Enter your password' }]}>
                            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" block loading={loading} style={{ height: 44 }}>
                                Sign In
                            </Button>
                        </Form.Item>
                    </Form>

                    <Divider plain>
                        <Text type="secondary">Don&apos;t have an account?</Text>
                    </Divider>

                    <Link href="/register">
                        <Button block style={{ height: 44 }}>Create Account</Button>
                    </Link>
                </Card>
            </div>
        </>
    );
}
