"use client";

interface QueueCardProps {
    currentToken: number | null;
    nextTokens: number[];
    waitingPatients: number;
    estimatedWaitTime: number;
}

export default function QueueCard({ currentToken, nextTokens, waitingPatients, estimatedWaitTime }: QueueCardProps) {
    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 32 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
                {/* Currently Serving - Big Card */}
                <div style={{
                    background: 'rgba(38, 198, 218, 0.7)',
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                    borderRadius: 12,
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    padding: '40px 48px',
                    color: '#ffffff',
                    boxShadow: '0 25px 50px rgba(38, 198, 218, 0.3)',
                    position: 'relative',
                    overflow: 'hidden',
                }}>
                    {/* Background icon */}
                    <div style={{ position: 'absolute', top: 0, right: 0, padding: 32, opacity: 0.1 }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 120 }}>notifications_active</span>
                    </div>
                    <div style={{ position: 'relative', zIndex: 10 }}>
                        {/* Live badge */}
                        <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 8,
                            background: 'rgba(255,255,255,0.2)',
                            padding: '6px 16px',
                            borderRadius: 999,
                            marginBottom: 24,
                        }}>
                            <span style={{
                                position: 'relative',
                                display: 'inline-flex',
                                width: 12,
                                height: 12,
                            }}>
                                <span className="pulse-dot" style={{
                                    position: 'absolute',
                                    display: 'inline-flex',
                                    width: '100%',
                                    height: '100%',
                                    borderRadius: '50%',
                                    background: '#4ade80',
                                    opacity: 0.75,
                                }} />
                                <span style={{
                                    position: 'relative',
                                    display: 'inline-flex',
                                    width: 12,
                                    height: 12,
                                    borderRadius: '50%',
                                    background: '#22c55e',
                                }} />
                            </span>
                            <span style={{ fontSize: 14, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Now Serving</span>
                        </div>

                        <h2 style={{
                            fontSize: 'clamp(64px, 12vw, 128px)',
                            fontWeight: 900,
                            letterSpacing: '-0.05em',
                            margin: '0 0 16px',
                            lineHeight: 1,
                        }}>
                            {currentToken ? `#${currentToken}` : '--'}
                        </h2>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 16, borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: 24, marginTop: 16 }}>
                            <div style={{
                                width: 48,
                                height: 48,
                                borderRadius: '50%',
                                background: 'rgba(255,255,255,0.1)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: '2px solid rgba(255,255,255,0.3)',
                            }}>
                                <span className="material-symbols-outlined" style={{ fontSize: 24 }}>stethoscope</span>
                            </div>
                            <div>
                                <p style={{ fontWeight: 500, opacity: 0.8, margin: 0, fontSize: 16 }}>Estimated wait: ~{estimatedWaitTime} min</p>
                                <p style={{ fontWeight: 700, fontSize: 20, margin: 0 }}>{waitingPatients} patients waiting</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Next in Line */}
                {nextTokens.length > 0 && (
                    <div style={{
                        background: 'rgba(255, 255, 255, 0.6)',
                        backdropFilter: 'blur(16px)',
                        WebkitBackdropFilter: 'blur(16px)',
                        border: '1px solid rgba(255, 255, 255, 0.4)',
                        borderRadius: 12,
                        padding: 32,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}>
                        <div>
                            <span style={{ color: '#94a3b8', fontSize: 14, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: 8 }}>Next in Line</span>
                            <h3 style={{ fontSize: 48, fontWeight: 900, color: '#26c6da', margin: 0 }}>#{nextTokens[0]}</h3>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8, color: '#26c6da', marginBottom: 4 }}>
                                <span className="material-symbols-outlined">hourglass_top</span>
                                <span style={{ fontSize: 20, fontWeight: 700 }}>~ 5 mins</span>
                            </div>
                            <p style={{ color: '#94a3b8', fontWeight: 500, margin: 0 }}>Please be ready at the lobby</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Upcoming Tokens List */}
            {nextTokens.length > 1 && (
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 8, margin: 0 }}>
                            <span className="material-symbols-outlined" style={{ color: '#26c6da' }}>format_list_numbered</span>
                            Upcoming Tokens
                        </h2>
                        <span style={{ background: '#e2e8f0', color: '#64748b', padding: '4px 12px', borderRadius: 4, fontSize: 14, fontWeight: 700 }}>
                            {waitingPatients} Waiting
                        </span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {nextTokens.slice(1, 8).map((token, index) => (
                            <div key={token} style={{
                                background: 'rgba(255, 255, 255, 0.6)',
                                backdropFilter: 'blur(16px)',
                                WebkitBackdropFilter: 'blur(16px)',
                                padding: 20,
                                borderRadius: 8,
                                border: '1px solid rgba(255, 255, 255, 0.4)',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                opacity: index > 3 ? 0.6 : 1,
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                                    <span style={{ fontSize: 24, fontWeight: 700, color: '#0f172a' }}>#{token}</span>
                                    <div style={{ height: 32, width: 1, background: '#e2e8f0' }} />
                                    <div>
                                        <span style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Estimated Wait</span>
                                        <span style={{ display: 'block', color: '#475569', fontWeight: 600 }}>{(index + 2) * 8} mins</span>
                                    </div>
                                </div>
                                <div style={{ color: 'rgba(38, 198, 218, 0.3)' }}>
                                    <span className="material-symbols-outlined">arrow_forward_ios</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
