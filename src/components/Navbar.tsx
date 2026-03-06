"use client";

import { Layout, Button, Space, Typography, Dropdown } from 'antd';
import { UserOutlined, LogoutOutlined, DashboardOutlined, MenuOutlined, HeartOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const { Header } = Layout;
const { Text } = Typography;

export default function Navbar() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        fetch('/api/user/me')
            .then((res) => res.json())
            .then((data) => {
                if (data.authenticated) setUser(data.user);
            })
            .catch(() => { });
    }, []);

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        setUser(null);
        router.push('/');
        router.refresh();
    };

    const menuItems = user
        ? [
            ...(user.role === 'admin'
                ? [{ key: 'admin', label: <Link href="/admin">Admin Dashboard</Link>, icon: <DashboardOutlined /> }]
                : [
                    { key: 'dashboard', label: <Link href="/dashboard">Dashboard</Link>, icon: <DashboardOutlined /> },
                ]),
            { key: 'logout', label: 'Logout', icon: <LogoutOutlined />, onClick: handleLogout },
        ]
        : [];

    return (
        <Header
            style={{
                background: 'rgba(255, 255, 255, 0.85)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: '1px solid rgba(255, 255, 255, 0.6)',
                position: 'sticky',
                top: 16,
                zIndex: 100,
                boxShadow: '0 8px 32px rgba(31, 38, 135, 0.05)',
                height: 64,
                margin: '16px 24px',
                borderRadius: 16,
                padding: '0 32px',
            }}
        >
            <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
                <HeartOutlined style={{ fontSize: 32, color: '#10b981' }} />
                <Text strong style={{ fontSize: 24, color: '#111827', margin: 0, fontWeight: 700 }}>
                    PulseLine
                </Text>
            </Link>

            <Space size="large" align="center">
                {user ? (
                    <Dropdown menu={{ items: menuItems }} placement="bottomRight">
                        <Button icon={<UserOutlined />}>{user.name}</Button>
                    </Dropdown>
                ) : (
                    <>
                        <Link href="/login" style={{ textDecoration: 'none' }}>
                            <Button type="text" style={{ color: '#4b5563', fontWeight: 500, fontSize: 14 }}>
                                Sign In
                            </Button>
                        </Link>
                        <Link href="/register" style={{ textDecoration: 'none' }}>
                            <Button type="primary" style={{ background: '#00bcd4', borderRadius: 6, fontWeight: 500, fontSize: 14, padding: '0 16px', height: 36, borderColor: '#00bcd4' }}>
                                Get Started
                            </Button>
                        </Link>
                    </>
                )}
            </Space>
        </Header >
    );
}
