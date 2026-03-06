"use client";

import { Layout, Menu, ConfigProvider } from 'antd';
import {
    DashboardOutlined,
    TeamOutlined,
    MedicineBoxOutlined,
    BarChartOutlined,
    LogoutOutlined,
} from '@ant-design/icons';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const { Sider } = Layout;

export default function AdminSidebar() {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/');
        router.refresh();
    };

    const menuItems = [
        {
            key: '/admin',
            icon: <DashboardOutlined />,
            label: <Link href="/admin">Dashboard</Link>,
        },
        {
            key: '/admin/doctors',
            icon: <MedicineBoxOutlined />,
            label: <Link href="/admin/doctors">Doctors</Link>,
        },
        {
            key: '/admin/reports',
            icon: <BarChartOutlined />,
            label: <Link href="/admin/reports">Reports</Link>,
        },
        {
            key: 'logout',
            icon: <LogoutOutlined />,
            label: 'Logout',
            onClick: handleLogout,
            danger: true,
        },
    ];

    return (
        <Sider
            breakpoint="lg"
            collapsedWidth="80"
            style={{ minHeight: 'calc(100vh - 64px)', background: '#001529', borderRight: '1px solid #001529' }}
        >
            <ConfigProvider
                theme={{
                    components: {
                        Menu: {
                            itemSelectedBg: '#00bcd4',
                            itemSelectedColor: '#ffffff',
                            itemColor: 'rgba(255, 255, 255, 0.65)',
                            itemHoverColor: '#ffffff',
                            itemHoverBg: 'rgba(255,255,255,0.08)'
                        },
                    },
                }}
            >
                <Menu
                    mode="inline"
                    selectedKeys={[pathname]}
                    style={{ borderRight: 0, paddingTop: 16, background: 'transparent' }}
                    items={menuItems}
                />
            </ConfigProvider>
        </Sider>
    );
}
