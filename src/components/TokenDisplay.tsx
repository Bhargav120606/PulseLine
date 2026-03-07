"use client";

interface TokenDisplayProps {
    tokenNumber: number;
    doctorName?: string;
    estimatedWaitTime?: number;
}

export default function TokenDisplay({ tokenNumber, doctorName, estimatedWaitTime }: TokenDisplayProps) {
    return (
        <div style={{
            background: 'rgba(255, 255, 255, 0.6)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            borderRadius: 12,
            padding: 32,
            border: '1px solid rgba(255, 255, 255, 0.4)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            textAlign: 'center',
        }}>
            <p style={{ color: '#94a3b8', fontSize: 14, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>
                Current Token Number
            </p>
            <h1 style={{ color: '#26c6da', fontSize: 72, fontWeight: 900, lineHeight: 1, margin: '0 0 16px' }}>
                #{tokenNumber}
            </h1>
            {estimatedWaitTime !== undefined && (
                <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '6px 16px',
                    borderRadius: 999,
                    background: 'rgba(38, 198, 218, 0.1)',
                    color: '#26c6da',
                    fontSize: 14,
                    fontWeight: 600,
                }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>schedule</span>
                    Estimated wait: {estimatedWaitTime} mins
                </div>
            )}
            {doctorName && (
                <p style={{ color: '#64748b', fontSize: 16, marginTop: 16, fontWeight: 500 }}>
                    Doctor: <strong style={{ color: '#0f172a' }}>{doctorName}</strong>
                </p>
            )}
        </div>
    );
}
