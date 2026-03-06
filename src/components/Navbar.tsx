"use client";

import { Layout, Button, Space, Typography, Dropdown, Badge, notification } from 'antd';
import { UserOutlined, LogoutOutlined, DashboardOutlined, HeartOutlined, BellOutlined, CalendarOutlined, LineChartOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const { Header } = Layout;
const { Text } = Typography;

export default function Navbar() {
    const router = useRouter();
    const pathname = usePathname();
    const [user, setUser] = useState<any>(null);
    const [notifications, setNotifications] = useState<{ id: string, message: string, time: string, read: boolean }[]>([]);
    const [notifiedTokens, setNotifiedTokens] = useState<Set<string>>(new Set());

    useEffect(() => {
        fetch('/api/user/me')
            .then((res) => res.json())
            .then((data) => {
                if (data.authenticated) setUser(data.user);
            })
            .catch(() => { });
    }, []);

    // Polling logic for notifications
    useEffect(() => {
        if (!user || user.role === 'admin') return;

        const checkQueue = async () => {
            try {
                // Fetch user's active appointments
                const apptsRes = await fetch('/api/appointments');
                const apptsData = await apptsRes.json();
                if (!apptsData.appointments) return;

                const myActiveTokens = apptsData.appointments
                    .filter((a: any) => a.status === 'waiting' || a.status === 'in-progress')
                    .map((a: any) => a.tokenNumber);

                if (myActiveTokens.length === 0) return;

                // Fetch live queue status
                const queueRes = await fetch('/api/queue');
                const queueData = await queueRes.json();

                myActiveTokens.forEach((token: number) => {
                    const notifyId = `${token}-${queueData.currentToken === token ? 'serve' : 'next'}`;

                    if (!notifiedTokens.has(notifyId)) {
                        if (queueData.currentToken === token) {
                            notification.success({
                                message: 'It\'s Your Turn!',
                                description: `Doctor is calling you in now! Token #${token}`,
                                duration: 10,
                            });
                            addNotification(`Doctor is calling you in now! Token #${token}`);
                            setNotifiedTokens(prev => new Set(prev).add(notifyId));
                        } else if (queueData.nextTokens && queueData.nextTokens[0] === token) {
                            notification.info({
                                message: 'You are next!',
                                description: `Please get ready. Token #${token} is next in line.`,
                                duration: 10,
                            });
                            addNotification(`Please get ready. Token #${token} is next in line.`);
                            setNotifiedTokens(prev => new Set(prev).add(notifyId));
                        }
                    }
                });
            } catch (err) { }
        };

        const interval = setInterval(checkQueue, 10000); // Check every 10 seconds
        return () => clearInterval(interval);
    }, [user, notifiedTokens]);

    const addNotification = (message: string) => {
        setNotifications(prev => [
            { id: Date.now().toString(), message, time: new Date().toLocaleTimeString(), read: false },
            ...prev
        ]);
    };

    const markAllRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

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

    const isAppPage = pathname === '/dashboard' || pathname === '/book' || pathname === '/queue';
    const unreadCount = notifications.filter(n => !n.read).length;

    const notificationItems = notifications.length > 0
        ? [
            ...notifications.map(n => ({
                key: n.id,
                label: (
                    <div style={{ padding: '4px 0', width: 250, whiteSpace: 'normal', opacity: n.read ? 0.6 : 1 }}>
                        <Text strong={!n.read} style={{ display: 'block', marginBottom: 4 }}>{n.message}</Text>
                        <Text type="secondary" style={{ fontSize: 12 }}>{n.time}</Text>
                    </div>
                )
            })),
            { type: 'divider' as const },
            { key: 'mark-read', label: 'Mark all as read', onClick: markAllRead, style: { textAlign: 'center' as const, color: '#00bcd4' } }
        ]
        : [{ key: 'empty', label: <Text type="secondary">No notifications yet</Text> }];

    const isAdminPage = pathname?.startsWith('/admin');

    return (
        <Header
            style={{
                background: isAdminPage ? 'rgba(0, 21, 41, 0.85)' : 'rgba(255, 255, 255, 0.85)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: isAdminPage ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(255, 255, 255, 0.6)',
                position: 'sticky',
                top: 16,
                zIndex: 1000,
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
                height: 64,
                margin: '16px 24px',
                borderRadius: 16,
                padding: '0 32px',
            }}
        >
            <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
                <HeartOutlined style={{ fontSize: 32, color: '#10b981' }} />
                <Text strong style={{ fontSize: 24, color: isAdminPage ? '#ffffff' : '#111827', margin: 0, fontWeight: 700 }}>
                    PulseLine
                </Text>
            </Link>

            <Space size="large" align="center">
                {isAppPage && user && user.role !== 'admin' && (
                    <Space size="middle" style={{ marginRight: 16 }}>
                        <Link href="/dashboard">
                            <Button
                                type={pathname === '/dashboard' ? 'primary' : 'text'}
                                ghost={pathname === '/dashboard'}
                                icon={<DashboardOutlined />}
                                className="pop-up-btn"
                                style={{
                                    color: pathname === '/dashboard' ? '#00bcd4' : '#4b5563',
                                    borderColor: pathname === '/dashboard' ? '#00bcd4' : 'transparent',
                                    fontWeight: 500
                                }}
                            >
                                Dashboard
                            </Button>
                        </Link>
                        <Link href="/book">
                            <Button
                                type={pathname === '/book' ? 'primary' : 'text'}
                                ghost={pathname === '/book'}
                                icon={<CalendarOutlined />}
                                className="pop-up-btn"
                                style={{
                                    color: pathname === '/book' ? '#00bcd4' : '#4b5563',
                                    borderColor: pathname === '/book' ? '#00bcd4' : 'transparent',
                                    fontWeight: 500
                                }}
                            >
                                Book Appointment
                            </Button>
                        </Link>
                        <Link href="/queue">
                            <Button
                                type={pathname === '/queue' ? 'primary' : 'text'}
                                ghost={pathname === '/queue'}
                                icon={<LineChartOutlined />}
                                className="pop-up-btn"
                                style={{
                                    color: pathname === '/queue' ? '#00bcd4' : '#4b5563',
                                    borderColor: pathname === '/queue' ? '#00bcd4' : 'transparent',
                                    fontWeight: 500
                                }}
                            >
                                Live Queue
                            </Button>
                        </Link>
                    </Space>
                )}

                {user ? (
                    <Space size="middle" align="center">
                        {user.role !== 'admin' && (
                            <Dropdown menu={{ items: notificationItems }} placement="bottomRight" trigger={['click']} onOpenChange={(open) => { if (open && unreadCount > 0) markAllRead(); }}>
                                <Badge count={unreadCount} size="small" style={{ backgroundColor: '#ff4d4f' }}>
                                    <Button type="text" shape="circle" icon={<BellOutlined style={{ fontSize: 18, color: '#4b5563' }} />} />
                                </Badge>
                            </Dropdown>
                        )}
                        <Dropdown menu={{ items: menuItems }} placement="bottomRight">
                            <Button
                                icon={<UserOutlined />}
                                style={isAdminPage ? {
                                    background: 'rgba(255, 255, 255, 0.1)',
                                    color: '#ffffff',
                                    borderColor: 'rgba(255, 255, 255, 0.2)'
                                } : {}}
                            >
                                {user.name}
                            </Button>
                        </Dropdown>
                    </Space>
                ) : (
                    <>
                        <Link href="/login" style={{ textDecoration: 'none' }}>
                            <Button type="text" className="pop-up-btn navbar-signin-btn" style={{ color: '#4b5563', fontWeight: 500, fontSize: 14 }}>
                                Sign In
                            </Button>
                        </Link>
                        <Link href="/register" style={{ textDecoration: 'none' }}>
                            <Button type="primary" className="pop-up-btn get-started-btn" style={{ borderRadius: 6, fontWeight: 500, fontSize: 14, padding: '0 16px', height: 36 }}>
                                Get Started
                            </Button>
                        </Link>
                    </>
                )}
            </Space>
        </Header >
    );
}
