import mongoose, { Schema, Document } from 'mongoose';

export interface IAppointment extends Document {
    patientId: mongoose.Types.ObjectId;
    patientName: string;
    phoneNumber: string;
    age: number;
    doctorId: mongoose.Types.ObjectId;
    date: string;
    tokenNumber: number;
    status: 'waiting' | 'in-progress' | 'completed' | 'skipped' | 'cancelled';
    estimatedWaitTime: number; // minutes
    createdAt: Date;
    updatedAt: Date;
}

const AppointmentSchema: Schema = new Schema(
    {
        patientId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        patientName: { type: String, required: true },
        phoneNumber: { type: String, required: true },
        age: { type: Number, required: true },
        doctorId: { type: Schema.Types.ObjectId, ref: 'Doctor', required: true },
        date: { type: String, required: true },
        tokenNumber: { type: Number, required: true },
        status: {
            type: String,
            enum: ['waiting', 'in-progress', 'completed', 'skipped', 'cancelled'],
            default: 'waiting',
        },
        estimatedWaitTime: { type: Number, default: 15 },
    },
    { timestamps: true }
);

export default mongoose.models.Appointment ||
    mongoose.model<IAppointment>('Appointment', AppointmentSchema);
