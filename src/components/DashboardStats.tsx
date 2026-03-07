"use client";

interface DashboardStatsProps {
    totalToday: number;
    waiting: number;
    completed: number;
    averageWaitTime?: number;
}

export default function DashboardStats({ totalToday, waiting, completed, averageWaitTime }: DashboardStatsProps) {
    const stats = [
        { label: 'Total Today', value: totalToday, icon: 'group', color: '#26c6da' },
        { label: 'Waiting', value: waiting, icon: 'hourglass_top', color: '#f59e0b' },
        { label: 'Completed', value: completed, icon: 'check_circle', color: '#22c55e' },
        ...(averageWaitTime !== undefined ? [{ label: 'Avg Wait', value: `${averageWaitTime} min`, icon: 'schedule', color: '#8b5cf6' }] : []),
    ];

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
            {stats.map((stat) => (
                <div key={stat.label} style={{
                    background: 'rgba(255, 255, 255, 0.6)',
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                    borderRadius: 12,
                    padding: 20,
                    border: '1px solid rgba(255, 255, 255, 0.4)',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                        <span style={{ fontSize: 12, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.label}</span>
                        <span className="material-symbols-outlined" style={{ fontSize: 20, color: stat.color, opacity: 0.7 }}>{stat.icon}</span>
                    </div>
                    <p style={{ fontSize: 28, fontWeight: 700, color: '#0f172a', margin: 0 }}>{stat.value}</p>
                </div>
            ))}
        </div>
    );
}
