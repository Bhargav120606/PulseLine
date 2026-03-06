"use client";

import { Typography, Button, Row, Col, Card, Space } from 'antd';
import {
  CalendarOutlined,
  NumberOutlined,
  LineChartOutlined,
  TeamOutlined,
  SettingOutlined,
  BarChartOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

const { Title, Paragraph, Text } = Typography;

export default function Home() {
  return (
    <>
      <Navbar />

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
              <Button type="primary" size="large" style={{ height: 48, fontSize: 16, padding: '0 32px', background: '#52c41a', borderColor: '#52c41a' }}>
                Start Free Trial
              </Button>
            </Link>
            <Link href="/login">
              <Button ghost size="large" style={{ height: 48, fontSize: 16, padding: '0 32px' }}>
                Sign In
              </Button>
            </Link>
          </Space>
        </div>
      </section>

      {/* Features Section */}
      <section className="section" style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <Title level={2}>Features for Everyone</Title>
            <Paragraph type="secondary" style={{ fontSize: 16 }}>Everything your clinic needs in one place</Paragraph>
          </div>

          <Title level={4} style={{ textAlign: 'center', marginBottom: 24, color: '#00bcd4' }}>For Patients</Title>
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

          <Title level={4} style={{ textAlign: 'center', marginBottom: 24, color: '#4dd0e1' }}>For Clinic Admin</Title>
          <Row gutter={[24, 24]}>
            <Col xs={24} sm={8}>
              <Card className="feature-card" variant="borderless">
                <TeamOutlined className="feature-icon" style={{ color: '#4dd0e1' }} />
                <Title level={5}>Manage Schedules</Title>
                <Text type="secondary">Add doctors and set their working hours</Text>
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card className="feature-card" variant="borderless">
                <SettingOutlined className="feature-icon" style={{ color: '#4dd0e1' }} />
                <Title level={5}>Update Queue</Title>
                <Text type="secondary">Manually manage the queue with skip and complete actions</Text>
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card className="feature-card" variant="borderless">
                <BarChartOutlined className="feature-icon" style={{ color: '#4dd0e1' }} />
                <Title level={5}>View Reports</Title>
                <Text type="secondary">Track daily analytics and clinic performance</Text>
              </Card>
            </Col>
          </Row>
        </div>
      </section>

      {/* How It Works */}
      <section className="section section-alt" style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
          <Title level={2} style={{ marginBottom: 48 }}>How It Works</Title>
          <Row gutter={[24, 24]}>
            {[
              { step: 1, text: 'Patient books an appointment online' },
              { step: 2, text: 'System generates a digital token' },
              { step: 3, text: 'Patient tracks live queue status' },
              { step: 4, text: 'Admin manages schedule and queue' },
            ].map((item) => (
              <Col xs={24} sm={12} key={item.step}>
                <Card className="step-card" variant="borderless">
                  <div className="step-number">{item.step}</div>
                  <Paragraph style={{ fontSize: 16, margin: 0 }}>{item.text}</Paragraph>
                </Card>
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
          <Button size="large" style={{ height: 48, fontSize: 16, padding: '0 40px', background: '#52c41a', borderColor: '#52c41a', color: '#fff' }}>
            Start Free Trial
          </Button>
        </Link>
      </section>

      {/* Footer */}
      <footer style={{ padding: '24px', textAlign: 'center', background: '#001529', color: 'rgba(255,255,255,0.5)' }}>
        <Text style={{ color: 'rgba(255,255,255,0.5)' }}>© 2026 PulseLine. All rights reserved.</Text>
      </footer>
    </>
  );
}
