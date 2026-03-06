"use client";

import { Form, Input, Button, Card, Typography, message, Divider } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Navbar from '@/components/Navbar';

const { Title, Text } = Typography;

export default function RegisterPage() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleRegister = async (values: any) => {
        setLoading(true);
        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            // Auto-login
            const loginRes = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: values.email, password: values.password }),
            });
            const loginData = await loginRes.json();

            if (loginRes.ok) {
                message.success('Account created successfully!');
                if (loginData.user?.role === 'admin') {
                    router.push('/admin');
                } else {
                    router.push('/dashboard');
                }
                router.refresh();
            } else {
                router.push('/login');
            }
        } catch (err: any) {
            message.error(err.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            <div className="auth-container">
                <Card className="auth-card" bordered={false} style={{ borderRadius: 16, boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}>
                    <div style={{ textAlign: 'center', marginBottom: 24 }}>
                        <Title level={3} style={{ margin: 0 }}>Create Account</Title>
                        <Text type="secondary">Join Pulseline to manage your clinic visits</Text>
                    </div>

                    <Form layout="vertical" onFinish={handleRegister} size="large">
                        <Form.Item name="name" rules={[{ required: true, message: 'Enter your name' }]}>
                            <Input prefix={<UserOutlined />} placeholder="Full Name" />
                        </Form.Item>

                        <Form.Item name="email" rules={[{ required: true, type: 'email', message: 'Enter a valid email' }]}>
                            <Input prefix={<MailOutlined />} placeholder="Email" />
                        </Form.Item>

                        <Form.Item name="password" rules={[{ required: true, min: 6, message: 'Password must be at least 6 characters' }]}>
                            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" block loading={loading} style={{ height: 44 }}>
                                Sign Up
                            </Button>
                        </Form.Item>
                    </Form>

                    <Divider plain>
                        <Text type="secondary">Already have an account?</Text>
                    </Divider>

                    <Link href="/login">
                        <Button block style={{ height: 44 }}>Sign In</Button>
                    </Link>
                </Card>
            </div>
        </>
    );
}
