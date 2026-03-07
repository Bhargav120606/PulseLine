"use client";

import Link from 'next/link';

export default function Footer() {
    return (
        <footer style={{ borderTop: '1px solid rgba(255, 255, 255, 0.4)', background: 'rgba(255, 255, 255, 0.6)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', width: '100%', flexShrink: 0 }}>
            <div style={{ maxWidth: 1280, margin: '0 auto', padding: '48px 24px' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 32 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: 8,
                            background: '#26c6da',
                            padding: 6,
                            color: '#ffffff',
                        }}>
                            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>pulse_alert</span>
                        </div>
                        <span style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em', color: '#0f172a' }}>PulseLine</span>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 32 }}>
                        <Link href="#" style={{ color: '#64748b', fontSize: 14, fontWeight: 500, textDecoration: 'none' }}>Privacy Policy</Link>
                        <Link href="#" style={{ color: '#64748b', fontSize: 14, fontWeight: 500, textDecoration: 'none' }}>Terms of Service</Link>
                        <Link href="#" style={{ color: '#64748b', fontSize: 14, fontWeight: 500, textDecoration: 'none' }}>Support</Link>
                    </div>
                </div>
                <div style={{ textAlign: 'center', color: '#94a3b8', fontSize: 14, borderTop: '1px solid #f1f5f9', paddingTop: 40, marginTop: 40 }}>
                    <p style={{ margin: 0 }}>© 2026 PulseLine Healthcare. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
