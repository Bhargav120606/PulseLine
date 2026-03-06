"use client";

import { Typography, Button, Row, Col, Card, Space, Modal } from 'antd';
import {
  CalendarOutlined,
  NumberOutlined,
  LineChartOutlined,
  TeamOutlined,
  SettingOutlined,
  BarChartOutlined,
  CheckCircleOutlined,
  MailOutlined,
  PhoneOutlined,
} from '@ant-design/icons';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const { Title, Paragraph, Text } = Typography;

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

      {/* Hero Section */}
      <section className="hero-section">
        <div style={{ maxWidth: 800, padding: '0 24px' }}>
          <h1 style={{ color: '#fff', fontSize: '2.8rem', fontWeight: 700, marginBottom: 16 }}>
            PulseLine – Digital Queue Management for Clinics
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.2rem', maxWidth: 600, margin: '0 auto 32px' }}>
            Manage patient appointments and reduce waiting time with a smart digital queue system.
          </p>
          <Space size="large">
            <Link href="/register">
              <Button type="primary" size="large" className="pop-up-btn" style={{ height: 48, fontSize: 16, padding: '0 32px', background: '#FF7043', borderColor: '#FF7043' }}>
                Start Free Trial
              </Button>
            </Link>
            <Link href="/login">
              <Button ghost size="large" className="hero-signin-btn pop-up-btn" style={{ height: 48, fontSize: 16, padding: '0 32px' }}>
                Sign In
              </Button>
            </Link>
          </Space>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="section" style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <Title level={2} style={{ fontSize: '2.5rem', marginBottom: 16 }}>Features for Everyone</Title>
            <Paragraph type="secondary" style={{ fontSize: 20 }}>Everything your clinic needs in one place</Paragraph>
          </div>

          <Title level={4} style={{ textAlign: 'center', marginBottom: 32, color: '#00bcd4', fontSize: '1.75rem' }}>For Patients</Title>
          <Row gutter={[24, 24]} style={{ marginBottom: 48 }}>
            <Col xs={24} sm={8}>
              <Card className="feature-card" variant="borderless">
                <CalendarOutlined className="feature-icon" />
                <Title level={5}>Book Appointment</Title>
                <Text type="secondary">Schedule appointments online with your preferred doctor</Text>
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card className="feature-card" variant="borderless">
                <NumberOutlined className="feature-icon" />
                <Title level={5}>Get Digital Token</Title>
                <Text type="secondary">Receive a digital token instantly after booking</Text>
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card className="feature-card" variant="borderless">
                <LineChartOutlined className="feature-icon" />
                <Title level={5}>Track Live Queue</Title>
                <Text type="secondary">Monitor your position in the queue in real time</Text>
              </Card>
            </Col>
          </Row>

          <Title level={4} style={{ textAlign: 'center', marginBottom: 32, marginTop: 16, color: '#4dd0e1', fontSize: '1.75rem' }}>For Clinic Admin</Title>
          <Row gutter={[24, 24]}>
            <Col xs={24} sm={8}>
              <Card className="feature-card" variant="borderless">
                <TeamOutlined className="feature-icon" />
                <Title level={5}>Manage Schedules</Title>
                <Text type="secondary">Add doctors and set their working hours</Text>
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card className="feature-card" variant="borderless">
                <SettingOutlined className="feature-icon" />
                <Title level={5}>Update Queue</Title>
                <Text type="secondary">Manually manage the queue with skip and complete actions</Text>
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card className="feature-card" variant="borderless">
                <BarChartOutlined className="feature-icon" />
                <Title level={5}>View Reports</Title>
                <Text type="secondary">Track daily analytics and clinic performance</Text>
              </Card>
            </Col>
          </Row>
        </div>
      </section>

      {/* How It Works */}
      <section className="section section-alt" style={{ padding: '80px 24px', background: 'linear-gradient(180deg, #fff 0%, #f0fbff 100%)' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <Title level={2} style={{ fontSize: '2.5rem', marginBottom: 16 }}>Seamless Workflow</Title>
            <Paragraph type="secondary" style={{ fontSize: 20 }}>How PulseLine transforms your clinic in four simple steps</Paragraph>
          </div>
          <Row gutter={[32, 32]} justify="center">
            {[
              { step: 1, title: 'Book Online', text: 'Patients schedule their appointments instantly through the accessible portal.' },
              { step: 2, title: 'Digital Token', text: 'A unique digital token is generated, securing their place in the clinic.' },
              { step: 3, title: 'Track Live', text: 'Patients monitor their real-time queue status from anywhere, reducing physical waiting.' },
              { step: 4, title: 'Consultation', text: 'The admin easily calls in patients smoothly using the dashboard interface.' },
            ].map((item) => (
              <Col xs={24} sm={24} md={12} key={item.step}>
                <div className="step-container" style={{ padding: '16px' }}>
                  <Card className="step-card" variant="borderless" style={{ height: '100%', padding: '24px' }}>
                    <div className="step-number" style={{ width: 56, height: 56, fontSize: 24, marginBottom: 16 }}>{item.step}</div>
                    <Title level={4} style={{ marginBottom: 16, color: '#111827' }}>{item.title}</Title>
                    <Paragraph style={{ fontSize: 16, margin: 0, color: '#4b5563', lineHeight: 1.6 }}>{item.text}</Paragraph>
                  </Card>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'linear-gradient(135deg, #00bcd4, #4dd0e1)', padding: '80px 24px', textAlign: 'center' }}>
        <Title level={2} style={{ color: '#fff', marginBottom: 12 }}>Ready to modernize your clinic?</Title>
        <Paragraph style={{ color: 'rgba(255,255,255,0.85)', fontSize: 18, marginBottom: 32 }}>
          Join hundreds of clinics using PulseLine
        </Paragraph>
        <Link href="/register">
          <Button size="large" className="pop-up-btn" style={{ height: 48, fontSize: 16, padding: '0 40px', background: '#FF7043', borderColor: '#FF7043', color: '#fff' }}>
            Start Free Trial
          </Button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="footer-container">
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <Row gutter={[32, 32]}>
            {/* Left Section */}
            <Col xs={24} sm={24} md={8}>
              <div style={{ marginBottom: 16 }}>
                <Text style={{ fontSize: 24, fontWeight: 700, color: '#ffffff' }}>PulseLine</Text>
              </div>
              <Text strong style={{ display: 'block', marginBottom: 12, color: '#00bcd4' }}>Digital Queue Management for Clinics</Text>
              <Paragraph style={{ color: '#9ca3af', fontSize: 15, lineHeight: 1.6 }}>
                Helping clinics manage patient queues efficiently with digital token systems, real-time updates, and improved patient flow.
              </Paragraph>
            </Col>

            {/* Middle Section (Quick Links) */}
            <Col xs={12} sm={8} md={5}>
              <Title level={5} style={{ color: '#ffffff', marginBottom: 20 }}>Quick Links</Title>
              <ul className="footer-links">
                <li><Link href="/" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Home</Link></li>
                <li><Link href="#features">Features</Link></li>
                <li><Link href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Pricing</Link></li>
              </ul>
            </Col>

            {/* Right Section (For Clinics) */}
            <Col xs={12} sm={8} md={6}>
              <Title level={5} style={{ color: '#ffffff', marginBottom: 20 }}>For Clinics</Title>
              <ul className="footer-links">
                <li><Link href="/demo">Book a Demo</Link></li>
                <li><Link href="/login">Clinic Login</Link></li>
                <li><Link href="/queue">Patient Queue Display</Link></li>
                <li><Link href="#" onClick={(e) => e.preventDefault()}>Help Center</Link></li>
              </ul>
            </Col>

            {/* Contact Section */}
            <Col xs={24} sm={8} md={5}>
              <Title level={5} style={{ color: '#ffffff', marginBottom: 20 }}>Contact</Title>
              <Space orientation="vertical" size="middle" style={{ width: '100%' }}>
                <div className="footer-contact-item">
                  <MailOutlined style={{ color: '#00bcd4', fontSize: 18 }} />
                  <a href="mailto:support@pulseline.com">support@pulseline.com</a>
                </div>
                <div className="footer-contact-item">
                  <PhoneOutlined style={{ color: '#00bcd4', fontSize: 18 }} />
                  <a href="tel:+91XXXXXXXXXX">+91-XXXXXXXXXX</a>
                </div>
              </Space>
            </Col>
          </Row>

          <div className="footer-bottom">
            <Text style={{ color: '#9ca3af', fontSize: 14 }}>© 2026 PulseLine. All rights reserved.</Text>
          </div>
        </div>
      </footer>
    </>
  );
}
