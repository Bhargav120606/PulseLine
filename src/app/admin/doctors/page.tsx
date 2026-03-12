"use client";

import { useEffect, useState } from 'react';
import { Typography, Table, Button, Form, Input, TimePicker, Switch, Modal, Space, Tag, App } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { Title } = Typography;

export default function DoctorsPage() {
    const [doctors, setDoctors] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingDoctor, setEditingDoctor] = useState<any>(null);
    const [form] = Form.useForm();
    const { message } = App.useApp();

    const fetchDoctors = async () => {
        try {
            const res = await fetch('/api/doctors');
            if (res.ok) {
                const data = await res.json();
                setDoctors(data.doctors || []);
            }
        } catch {
            console.error('Failed to fetch doctors');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDoctors();
    }, []);

    const handleSubmit = async (values: any) => {
        try {
            const payload = {
                name: values.name,
                specialty: values.specialty,
                workingHoursStart: values.workingHoursStart || '09:00',
                workingHoursEnd: values.workingHoursEnd || '17:00',
                isAvailable: values.isAvailable !== undefined ? values.isAvailable : true,
            };

            let res;
            if (editingDoctor) {
                res = await fetch(`/api/doctors/${editingDoctor._id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });
            } else {
                res = await fetch('/api/doctors', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });
            }

            if (res.ok) {
                message.success(editingDoctor ? 'Doctor updated' : 'Doctor added');
                setModalOpen(false);
                setEditingDoctor(null);
                form.resetFields();
                fetchDoctors();
            } else {
                const data = await res.json();
                message.error(data.message || 'Operation failed');
            }
        } catch {
            message.error('Something went wrong');
        }
    };

    const handleDelete = async (id: string) => {
        try {
            const res = await fetch(`/api/doctors/${id}`, { method: 'DELETE' });
            if (res.ok) {
                message.success('Doctor deleted');
                fetchDoctors();
            }
        } catch {
            message.error('Failed to delete doctor');
        }
    };

    const handleToggleAvailability = async (id: string, currentStatus: boolean) => {
        try {
            await fetch(`/api/doctors/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isAvailable: !currentStatus }),
            });
            fetchDoctors();
        } catch {
            message.error('Failed to toggle availability');
        }
    };

    const openEditModal = (doctor: any) => {
        setEditingDoctor(doctor);
        form.setFieldsValue({
            name: doctor.name,
            specialty: doctor.specialty,
            workingHoursStart: doctor.workingHoursStart,
            workingHoursEnd: doctor.workingHoursEnd,
            isAvailable: doctor.isAvailable,
        });
        setModalOpen(true);
    };

    const columns = [
        { title: 'Name', dataIndex: 'name', key: 'name' },
        { title: 'Specialty', dataIndex: 'specialty', key: 'specialty' },
        {
            title: 'Hours',
            key: 'hours',
            render: (_: any, r: any) => `${r.workingHoursStart} – ${r.workingHoursEnd}`,
        },
        {
            title: 'Available',
            dataIndex: 'isAvailable',
            key: 'isAvailable',
            render: (val: boolean, record: any) => (
                <Switch
                    checked={val}
                    onChange={() => handleToggleAvailability(record._id, val)}
                    checkedChildren="Yes"
                    unCheckedChildren="No"
                />
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: any) => (
                <Space>
                    <Button size="small" icon={<EditOutlined />} onClick={() => openEditModal(record)}>Edit</Button>
                    <Button size="small" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record._id)}>Delete</Button>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
                <Title level={3}>Doctor Schedule Management</Title>
                <Button
                    type="primary"
                    style={{ background: '#26c6da', borderColor: '#26c6da' }}
                    icon={<PlusOutlined />}
                    onClick={() => {
                        setEditingDoctor(null);
                        form.resetFields();
                        setModalOpen(true);
                    }}
                >
                    Add Doctor
                </Button>
            </div>

            <Table
                dataSource={doctors}
                columns={columns}
                rowKey="_id"
                loading={loading}
                bordered
                style={{ borderRadius: 8, overflow: 'hidden' }}
            />

            <Modal
                title={editingDoctor ? 'Edit Doctor' : 'Add Doctor'}
                open={modalOpen}
                onCancel={() => { setModalOpen(false); setEditingDoctor(null); form.resetFields(); }}
                onOk={() => form.submit()}
                okText={editingDoctor ? 'Update' : 'Add'}
            >
                <Form form={form} layout="vertical" onFinish={handleSubmit}>
                    <Form.Item name="name" label="Doctor Name" rules={[
                        { required: true, message: 'Please enter the doctor\'s name' },
                        { min: 3, message: 'Name must be at least 3 characters long' },
                        { pattern: /^[a-zA-Z\s.,-]+$/, message: 'Name can only contain letters, spaces, and basic punctuation' }
                    ]}>
                        <Input placeholder="Dr. John Smith" />
                    </Form.Item>
                    <Form.Item name="specialty" label="Specialty" rules={[
                        { required: true, message: 'Please enter the doctor\'s specialty' },
                        { min: 2, message: 'Specialty must be at least 2 characters long' }
                    ]}>
                        <Input placeholder="Cardiology" />
                    </Form.Item>
                    <Form.Item name="workingHoursStart" label="Start Time" initialValue="09:00" rules={[
                        { required: true, message: 'Start time is required' },
                        { pattern: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, message: 'Time must be in HH:MM format (24-hour)' }
                    ]}>
                        <Input placeholder="09:00" />
                    </Form.Item>
                    <Form.Item name="workingHoursEnd" label="End Time" initialValue="17:00" rules={[
                        { required: true, message: 'End time is required' },
                        { pattern: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, message: 'Time must be in HH:MM format (24-hour)' }
                    ]}>
                        <Input placeholder="17:00" />
                    </Form.Item>
                    <Form.Item name="isAvailable" label="Available" valuePropName="checked" initialValue={true}>
                        <Switch checkedChildren="Yes" unCheckedChildren="No" />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}
