"use client";

import { Modal, Button } from 'antd';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/user/me')
      .then(res => res.json())
      .then(data => {
        if (data.authenticated) {
          setUser(data.user);
          setShowLogoutModal(true);
        }
      })
      .catch(() => { });
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setShowLogoutModal(false);
    setUser(null);
    window.location.reload();
  };

  return (
    <>
      <Navbar />

      <Modal
        title="Active Session Detected"
        open={showLogoutModal}
        closable={false}
        mask={{ closable: false }}
        centered
        footer={[
          <Button key="dashboard" onClick={() => router.push(user?.role === 'admin' ? '/admin' : '/dashboard')}>
            Return to Dashboard
          </Button>,
          <Button key="logout" type="primary" danger onClick={handleLogout}>
            Log Out
          </Button>
        ]}
      >
        <p>You are currently logged in as <strong>{user?.name}</strong>.</p>
        <p>Would you like to log out to view the home page, or return to your dashboard?</p>
      </Modal>

      <main style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        {/* Hero Section */}
        <div style={{ maxWidth: 1280, margin: '0 auto', width: '100%', padding: '0 24px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 40, padding: '48px 0 96px' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 40, alignItems: 'center' }}>
              {/* Left content */}
              <div style={{ flex: '1 1 480px', display: 'flex', flexDirection: 'column', gap: 32 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    alignSelf: 'flex-start',
                    borderRadius: 999,
                    background: 'rgba(38, 198, 218, 0.1)',
                    padding: '8px 16px',
                    color: '#26c6da',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}>
                    Healthcare Redefined
                  </span>
                  <h1 style={{
                    fontSize: 'clamp(2.5rem, 5vw, 3.75rem)',
                    fontWeight: 900,
                    lineHeight: 1.1,
                    letterSpacing: '-0.02em',
                    color: '#0f172a',
                    margin: 0,
                  }}>
                    Modern Healthcare Solutions with <span style={{ color: '#26c6da' }}>PulseLine</span>
                  </h1>
                  <p style={{
                    fontSize: 18,
                    fontWeight: 500,
                    lineHeight: 1.7,
                    color: '#475569',
                    maxWidth: 540,
                    margin: 0,
                  }}>
                    Experience seamless clinic management with live tracking, instant tokens, and effortless booking. We put patients first.
                  </p>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
                  <Link href="/register">
                    <button style={{
                      display: 'flex',
                      minWidth: 140,
                      cursor: 'pointer',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 12,
                      height: 56,
                      padding: '0 32px',
                      background: '#26c6da',
                      color: '#ffffff',
                      fontSize: 16,
                      fontWeight: 700,
                      border: 'none',
                      fontFamily: 'inherit',
                      boxShadow: '0 8px 24px rgba(38, 198, 218, 0.2)',
                      transition: 'transform 0.2s',
                      textDecoration: 'none',
                    }}>
                      Get Started
                    </button>
                  </Link>
                  <Link href="/login">
                    <button style={{
                      display: 'flex',
                      minWidth: 140,
                      cursor: 'pointer',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 12,
                      height: 56,
                      padding: '0 32px',
                      background: '#ffffff',
                      color: '#0f172a',
                      fontSize: 16,
                      fontWeight: 700,
                      border: '1px solid #e2e8f0',
                      fontFamily: 'inherit',
                      transition: 'background 0.2s',
                      gap: 8,
                    }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 20 }}>play_circle</span>
                      Watch Demo
                    </button>
                  </Link>
                </div>
              </div>
              {/* Right image */}
              <div style={{ flex: '1 1 400px' }}>
                <div style={{
                  position: 'relative',
                  borderRadius: 16,
                  overflow: 'hidden',
                  boxShadow: '0 25px 50px rgba(0, 0, 0, 0.12)',
                  aspectRatio: '4/3',
                  background: 'linear-gradient(135deg, #26c6da 0%, #4DD0E1 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Image
                    src="/reception2.jpg"
                    alt="PulseLine Reception"
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <section id="features" style={{
          background: '#ffffff',
          padding: '80px 0',
          borderTop: '1px solid #f1f5f9',
          borderBottom: '1px solid #f1f5f9',
        }}>
          <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
            <div style={{ marginBottom: 64 }}>
              <h2 style={{
                fontSize: 'clamp(1.8rem, 3vw, 2.5rem)',
                fontWeight: 700,
                lineHeight: 1.2,
                color: '#0f172a',
                margin: '0 0 16px',
              }}>
                Why Choose PulseLine?
              </h2>
              <p style={{
                fontSize: 18,
                color: '#64748b',
                maxWidth: 720,
                margin: 0,
              }}>
                Our platform is designed to streamline your healthcare experience using cutting-edge technology and patient-centric design.
              </p>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: 32,
            }}>
              {[
                { icon: 'monitoring', title: 'Live Tracking', desc: 'Monitor your queue status in real-time from anywhere. No more waiting in crowded rooms for hours.' },
                { icon: 'calendar_month', title: 'Easy Booking', desc: 'Schedule appointments with your preferred doctors in just a few clicks with our intuitive interface.' },
                { icon: 'confirmation_number', title: 'Instant Tokens', desc: 'Get your digital consultation token immediately upon booking. Secure, paperless, and convenient.' },
              ].map((feature) => (
                <div
                  key={feature.title}
                  className="feature-card"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 24,
                    padding: 32,
                    borderRadius: 16,
                    border: '1px solid #e2e8f0',
                    background: '#f6f6f8',
                    transition: 'all 0.3s ease',
                  }}
                >
                  <div className="feature-icon-box">
                    <span className="material-symbols-outlined" style={{ fontSize: 28 }}>{feature.icon}</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <h3 style={{ fontSize: 20, fontWeight: 700, margin: 0, color: '#0f172a' }}>{feature.title}</h3>
                    <p style={{ fontSize: 15, color: '#64748b', lineHeight: 1.6, margin: 0 }}>{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section style={{ padding: '80px 0' }}>
          <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
            <div style={{
              position: 'relative',
              overflow: 'hidden',
              borderRadius: 24,
              background: 'rgba(38, 198, 218, 0.7)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              padding: '64px 40px',
              textAlign: 'center',
              boxShadow: '0 25px 50px rgba(38, 198, 218, 0.25)',
            }}>
              {/* Dot pattern overlay */}
              <div style={{
                position: 'absolute',
                inset: 0,
                opacity: 0.1,
                backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                backgroundSize: '32px 32px',
              }} />
              <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 32 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <h2 style={{
                    fontSize: 'clamp(1.8rem, 4vw, 3.75rem)',
                    fontWeight: 900,
                    letterSpacing: '-0.02em',
                    color: '#ffffff',
                    margin: 0,
                    lineHeight: 1.1,
                  }}>
                    Ready to transform your clinic experience?
                  </h2>
                  <p style={{
                    margin: '0 auto',
                    maxWidth: 640,
                    fontSize: 18,
                    color: '#cbd5e1',
                    opacity: 0.9,
                  }}>
                    Join thousands of users and hundreds of clinics who trust PulseLine for their daily healthcare needs.
                  </p>
                </div>
                <Link href="/register">
                  <button style={{
                    display: 'flex',
                    minWidth: 200,
                    cursor: 'pointer',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 12,
                    height: 56,
                    padding: '0 32px',
                    background: '#ffffff',
                    color: '#26c6da',
                    fontSize: 18,
                    fontWeight: 700,
                    border: 'none',
                    fontFamily: 'inherit',
                    transition: 'transform 0.2s',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
                  }}>
                    Get Started Now
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </>
  );
}
