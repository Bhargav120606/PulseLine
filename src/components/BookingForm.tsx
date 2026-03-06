"use client";

import { Form, Input, Select, Button, InputNumber, App } from 'antd';
import { useEffect, useState } from 'react';

interface BookingFormProps {
    onSuccess: (appointment: any) => void;
}

export default function BookingForm({ onSuccess }: BookingFormProps) {
    const [form] = Form.useForm();
    const [doctors, setDoctors] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const { message } = App.useApp();

    useEffect(() => {
        fetch('/api/doctors')
            .then((res) => res.json())
            .then((data) => setDoctors(data.doctors || []))
            .catch(() => { });
    }, []);

    const handleSubmit = async (values: any) => {
        setLoading(true);
        try {
            const res = await fetch('/api/appointments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values),
            });
            const data = await res.json();
            if (res.ok) {
                message.success('Appointment booked successfully!');
                form.resetFields();
                onSuccess(data.appointment);
            } else {
                message.error(data.message || 'Failed to book');
            }
        } catch {
            message.error('Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Form form={form} layout="vertical" onFinish={handleSubmit} size="large">
            <Form.Item name="patientName" label="Patient Name" rules={[{ required: true, message: 'Enter patient name' }]}>
                <Input placeholder="Enter full name" />
            </Form.Item>

            <Form.Item name="phoneNumber" label="Phone Number" rules={[{ required: true, message: 'Enter phone number' }]}>
                <Input placeholder="Enter phone number" />
            </Form.Item>

            <Form.Item name="age" label="Age" rules={[{ required: true, message: 'Enter age' }]}>
                <InputNumber min={1} max={120} placeholder="Enter age" style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item name="doctorId" label="Select Doctor" rules={[{ required: true, message: 'Select a doctor' }]}>
                <Select placeholder="Choose a doctor">
                    {doctors.filter((d) => d.isAvailable).map((doc) => (
                        <Select.Option key={doc._id} value={doc._id}>
                            {doc.name} — {doc.specialty}
                        </Select.Option>
                    ))}
                </Select>
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit" block loading={loading}>
                    Book Appointment
                </Button>
            </Form.Item>
        </Form>
    );
}
