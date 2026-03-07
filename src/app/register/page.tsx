"use client";

import { Form, Input, Button, Typography, App } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const { Text } = Typography;

export default function RegisterPage() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { message } = App.useApp();

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
            <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, minHeight: 'calc(100vh - 64px)', background: '#f6f6f8' }}>
                <div style={{
                    width: '100%',
                    maxWidth: 480,
                    background: 'rgba(255, 255, 255, 0.6)',
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                    borderRadius: 12,
                    boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.4)',
                    overflow: 'hidden',
                }}>
                    {/* Tabs Header */}
                    <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0' }}>
                        <Link href="/login" style={{
                            flex: 1,
                            padding: '16px 0',
                            textAlign: 'center',
                            fontSize: 14,
                            fontWeight: 700,
                            borderBottom: '2px solid transparent',
                            color: '#94a3b8',
                            textDecoration: 'none',
                        }}>
                            Login
                        </Link>
                        <div style={{
                            flex: 1,
                            padding: '16px 0',
                            textAlign: 'center',
                            fontSize: 14,
                            fontWeight: 700,
                            borderBottom: '2px solid #26c6da',
                            color: '#26c6da',
                        }}>
                            Register
                        </div>
                    </div>

                    <div style={{ padding: 32 }}>
                        <div style={{ marginBottom: 32 }}>
                            <h2 style={{ fontSize: 24, fontWeight: 900, color: '#0f172a', margin: '0 0 4px', lineHeight: 1.2 }}>Create Account</h2>
                            <p style={{ color: '#94a3b8', fontSize: 14, margin: 0 }}>Join PulseLine to manage your clinic visits</p>
                        </div>

                        <Form layout="vertical" onFinish={handleRegister} size="large">
                            <Form.Item name="name" label={<span style={{ fontSize: 14, fontWeight: 600, color: '#334155' }}>Full Name</span>} rules={[{ required: true, message: 'Enter your name' }]}>
                                <Input placeholder="Enter your full name" style={{ height: 48, background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8 }} />
                            </Form.Item>

                            <Form.Item name="email" label={<span style={{ fontSize: 14, fontWeight: 600, color: '#334155' }}>Email Address</span>} rules={[{ required: true, type: 'email', message: 'Enter a valid email' }]}>
                                <Input placeholder="name@hospital.com" style={{ height: 48, background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8 }} />
                            </Form.Item>

                            <Form.Item name="password" label={<span style={{ fontSize: 14, fontWeight: 600, color: '#334155' }}>Password</span>} rules={[{ required: true, min: 6, message: 'Password must be at least 6 characters' }]}>
                                <Input.Password placeholder="Create a password" style={{ height: 48, background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8 }} />
                            </Form.Item>

                            <Form.Item
                                name="confirmPassword"
                                label={<span style={{ fontSize: 14, fontWeight: 600, color: '#334155' }}>Confirm Password</span>}
                                dependencies={['password']}
                                rules={[
                                    { required: true, message: 'Please confirm your password' },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (!value || getFieldValue('password') === value) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(new Error('The passwords do not match!'));
                                        },
                                    }),
                                ]}
                            >
                                <Input.Password placeholder="Confirm your password" style={{ height: 48, background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8 }} />
                            </Form.Item>

                            <Form.Item style={{ paddingTop: 8 }}>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    block
                                    loading={loading}
                                    style={{
                                        height: 48,
                                        borderRadius: 8,
                                        fontWeight: 700,
                                        fontSize: 15,
                                        boxShadow: '0 8px 16px rgba(38, 198, 218, 0.1)',
                                    }}
                                >
                                    Sign Up
                                    <span className="material-symbols-outlined" style={{ fontSize: 18, marginLeft: 8 }}>arrow_forward</span>
                                </Button>
                            </Form.Item>
                        </Form>

                        <div style={{ marginTop: 32, paddingTop: 24, borderTop: '1px solid #f1f5f9', textAlign: 'center' }}>
                            <p style={{ fontSize: 14, color: '#94a3b8', margin: 0 }}>
                                Already have an account?
                                <Link href="/login" style={{ color: '#26c6da', fontWeight: 700, marginLeft: 4 }}>Sign In</Link>
                            </p>
                        </div>
                    </div>

                    {/* Security Footer */}
                    <div style={{
                        background: 'rgba(255, 255, 255, 0.3)',
                        padding: '12px 16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 16,
                        fontSize: 10,
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        color: '#94a3b8',
                        fontWeight: 700,
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <span className="material-symbols-outlined" style={{ fontSize: 12 }}>encrypted</span>
                            End-to-end encrypted
                        </div>
                        <span style={{ color: '#cbd5e1' }}>•</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <span className="material-symbols-outlined" style={{ fontSize: 12 }}>gpp_good</span>
                            Security Audited 2024
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
