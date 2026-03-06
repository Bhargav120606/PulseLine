"use client";

import { ConfigProvider } from 'antd';

export default function AntdProvider({ children }: { children: React.ReactNode }) {
    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: '#1677ff',
                    borderRadius: 8,
                    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                },
            }}
        >
            {children}
        </ConfigProvider>
    );
}
