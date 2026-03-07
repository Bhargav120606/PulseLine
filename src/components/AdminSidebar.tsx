"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const menuItems = [
    { key: '/admin', icon: 'grid_view', label: 'Dashboard' },
    { key: '/admin/doctors', icon: 'medical_services', label: 'Doctors' },
    { key: '/admin/reports', icon: 'bar_chart', label: 'Reports' },
];

export default function AdminSidebar() {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/');
        router.refresh();
    };

    return (
        <aside style={{
            width: 256,
            borderRight: '1px solid #e2e8f0',
            background: '#ffffff',
            display: 'flex',
            flexDirection: 'column',
            flexShrink: 0,
        }}>
            {/* Header */}
            <div style={{ padding: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                        background: '#26c6da',
                        borderRadius: 8,
                        padding: 6,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        <span className="material-symbols-outlined" style={{ color: '#ffffff', fontSize: 20 }}>monitoring</span>
                    </div>
                    <div>
                        <h1 style={{ fontSize: 18, fontWeight: 700, color: '#26c6da', margin: 0, lineHeight: 1.2 }}>PulseLine</h1>
                        <p style={{ fontSize: 12, color: '#94a3b8', fontWeight: 500, margin: 0 }}>Admin Panel</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav style={{ flex: 1, padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 4 }}>
                {menuItems.map((item) => {
                    const isActive = pathname === item.key;
                    return (
                        <Link
                            key={item.key}
                            href={item.key}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 12,
                                padding: '10px 12px',
                                borderRadius: 8,
                                background: isActive ? 'rgba(38, 198, 218, 0.1)' : 'transparent',
                                color: isActive ? '#26c6da' : '#64748b',
                                fontWeight: isActive ? 700 : 600,
                                fontSize: 14,
                                textDecoration: 'none',
                                transition: 'all 0.2s',
                            }}
                        >
                            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>{item.icon}</span>
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            {/* Logout */}
            <div style={{ padding: 16, marginTop: 'auto' }}>
                <button
                    onClick={handleLogout}
                    style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 8,
                        padding: '10px 16px',
                        borderRadius: 8,
                        background: '#ffffff',
                        border: '1px solid #fecaca',
                        color: '#ef4444',
                        fontWeight: 700,
                        fontSize: 14,
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                        transition: 'background 0.2s',
                    }}
                >
                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>logout</span>
                    Logout
                </button>
            </div>
        </aside>
    );
}
