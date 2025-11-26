import mongoose, { Document, Schema } from 'mongoose';

export interface IProof extends Document {
  proofId: string;
  userId: mongoose.Types.ObjectId;
  circuitType: string;
  status: 'generated' | 'verified' | 'verification_failed' | 'error';
  proofData: any; // Store the actual proof data
  verified: boolean;
  verifiedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const proofSchema = new Schema<IProof>(
  {
    proofId: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: Schema.Types.Mixed, // Allow both ObjectId and string (for demo users)
      ref: 'User',
      required: true,
    },
    circuitType: {
      type: String,
      required: true,
      enum: ['snark', 'stark', 'rollup', 'credit_score', 'age_verification', 'kyc', 'custom'],
    },
    status: {
      type: String,
      required: true,
      enum: ['generated', 'verified', 'verification_failed', 'error'],
      default: 'generated',
    },
    proofData: {
      type: Schema.Types.Mixed,
      required: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    verifiedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
proofSchema.index({ userId: 1, status: 1 });
proofSchema.index({ proofId: 1 }, { unique: true });

const Proof = mongoose.model<IProof>('Proof', proofSchema);
export default Proof;
