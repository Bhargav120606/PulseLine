"use client";

import { Button, Space, Typography, Dropdown, Badge, notification } from 'antd';
import { UserOutlined, LogoutOutlined, DashboardOutlined, BellOutlined, CalendarOutlined, LineChartOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

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
                const apptsRes = await fetch('/api/appointments');
                const apptsData = await apptsRes.json();
                if (!apptsData.appointments) return;

                const myActiveTokens = apptsData.appointments
                    .filter((a: any) => a.status === 'waiting' || a.status === 'in-progress')
                    .map((a: any) => a.tokenNumber);

                if (myActiveTokens.length === 0) return;

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

        const interval = setInterval(checkQueue, 10000);
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
                    <div style={{ padding: '4px 0', width: 250, whiteSpace: 'normal' as const, opacity: n.read ? 0.6 : 1 }}>
                        <Text strong={!n.read} style={{ display: 'block', marginBottom: 4 }}>{n.message}</Text>
                        <Text type="secondary" style={{ fontSize: 12 }}>{n.time}</Text>
                    </div>
                )
            })),
            { type: 'divider' as const },
            { key: 'mark-read', label: 'Mark all as read', onClick: markAllRead, style: { textAlign: 'center' as const, color: '#26c6da' } }
        ]
        : [{ key: 'empty', label: <Text type="secondary">No notifications yet</Text> }];

    const isAdminPage = pathname?.startsWith('/admin');

    return (
        <header
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                whiteSpace: 'nowrap',
                borderBottom: '1px solid rgba(255, 255, 255, 0.4)',
                padding: '0 24px',
                background: 'rgba(255, 255, 255, 0.6)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                position: 'sticky',
                top: 0,
                zIndex: 1000,
                height: 64,
            }}
        >
            <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 8,
                    background: '#26c6da',
                    padding: 6,
                    color: '#ffffff'
                }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 20 }}>pulse_alert</span>
                </div>
                <span style={{ fontSize: 20, fontWeight: 700, color: '#0f172a', letterSpacing: '-0.02em' }}>
                    PulseLine
                </span>
            </Link>

            <div style={{ display: 'flex', flex: 1, justifyContent: 'flex-end', gap: 32, alignItems: 'center' }}>
                {/* Nav Links for app pages */}
                {isAppPage && user && user.role !== 'admin' && (
                    <nav style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
                        <Link href="/dashboard" style={{
                            fontSize: 14,
                            fontWeight: pathname === '/dashboard' ? 600 : 500,
                            color: pathname === '/dashboard' ? '#26c6da' : '#64748b',
                            textDecoration: 'none',
                            transition: 'color 0.2s',
                        }}>
                            Dashboard
                        </Link>
                        <Link href="/book" style={{
                            fontSize: 14,
                            fontWeight: pathname === '/book' ? 600 : 500,
                            color: pathname === '/book' ? '#26c6da' : '#64748b',
                            textDecoration: 'none',
                            transition: 'color 0.2s',
                        }}>
                            Book Appointment
                        </Link>
                        <Link href="/queue" style={{
                            fontSize: 14,
                            fontWeight: pathname === '/queue' ? 600 : 500,
                            color: pathname === '/queue' ? '#26c6da' : '#64748b',
                            textDecoration: 'none',
                            transition: 'color 0.2s',
                        }}>
                            Live Queue
                        </Link>
                    </nav>
                )}

                {/* Non-app page nav links */}
                {!isAppPage && !isAdminPage && !user && (
                    <nav style={{ display: 'flex', alignItems: 'center', gap: 36 }}>
                        <Link href="/" style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', textDecoration: 'none' }}>Home</Link>
                        <Link href="#features" style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', textDecoration: 'none' }}>Features</Link>
                        <Link href="#" style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', textDecoration: 'none' }}>About</Link>
                    </nav>
                )}

                {user ? (
                    <Space size="middle" align="center">
                        {user.role !== 'admin' && (
                            <Dropdown menu={{ items: notificationItems }} placement="bottomRight" trigger={['click']} onOpenChange={(open) => { if (open && unreadCount > 0) markAllRead(); }}>
                                <Badge count={unreadCount} size="small" style={{ backgroundColor: '#ef4444' }}>
                                    <button style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        width: 40,
                                        height: 40,
                                        borderRadius: 8,
                                        background: '#f1f5f9',
                                        border: 'none',
                                        cursor: 'pointer',
                                        color: '#475569',
                                        transition: 'background 0.2s',
                                    }}>
                                        <span className="material-symbols-outlined" style={{ fontSize: 20 }}>notifications</span>
                                    </button>
                                </Badge>
                            </Dropdown>
                        )}
                        <Dropdown menu={{ items: menuItems }} placement="bottomRight">
                            <button style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8,
                                padding: '6px 14px',
                                borderRadius: 8,
                                background: '#f1f5f9',
                                border: '1px solid #e2e8f0',
                                cursor: 'pointer',
                                color: '#0f172a',
                                fontWeight: 600,
                                fontSize: 14,
                                fontFamily: 'inherit',
                            }}>
                                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>person</span>
                                {user.name}
                            </button>
                        </Dropdown>
                    </Space>
                ) : (
                    <Link href="/login" style={{ textDecoration: 'none' }}>
                        <button style={{
                            display: 'flex',
                            minWidth: 90,
                            cursor: 'pointer',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: 8,
                            height: 40,
                            padding: '0 20px',
                            background: '#26c6da',
                            color: '#ffffff',
                            fontSize: 14,
                            fontWeight: 700,
                            border: 'none',
                            fontFamily: 'inherit',
                            transition: 'all 0.2s',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                        }}>
                            Login
                        </button>
                    </Link>
                )}
            </div>
        </header>
    );
}
