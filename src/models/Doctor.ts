import mongoose, { Schema, Document } from 'mongoose';

export interface IDoctor extends Document {
    name: string;
    specialty: string;
    workingHoursStart: string;
    workingHoursEnd: string;
    isAvailable: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const DoctorSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        specialty: { type: String, required: true },
        workingHoursStart: { type: String, default: '09:00' },
        workingHoursEnd: { type: String, default: '17:00' },
        isAvailable: { type: Boolean, default: true },
    },
    { timestamps: true }
);

export default mongoose.models.Doctor || mongoose.model<IDoctor>('Doctor', DoctorSchema);
