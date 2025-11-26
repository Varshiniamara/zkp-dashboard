import { Request, Response } from 'express';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs';
import Proof from '../models/Proof';
import { ErrorResponse } from '../middleware/error.middleware';

const execPromise = promisify(exec);

// Directory paths
const CIRCUITS_DIR = path.join(__dirname, '../../circuits');
const BUILD_DIR = path.join(__dirname, '../../build');

// Ensure build directory exists
if (!fs.existsSync(BUILD_DIR)) {
  fs.mkdirSync(BUILD_DIR, { recursive: true });
}

import { snarkService } from '../services/snarkService';
import { starkService } from '../services/starkService';
import { rollupService } from '../services/rollupService';
import { hybridService } from '../services/hybridService';

// Generate a zero-knowledge proof
export const generateProof = async (req: Request, res: Response) => {
  try {
    const { circuitType, inputs } = req.body;
    // Handle demo user or real user
    const userId = req.user?._id || 'demo_user';

    // Validate inputs
    if (!circuitType || !inputs) {
      throw new ErrorResponse('Circuit type and inputs are required', 400);
    }

    let proofData;
    let proofType = circuitType;

    switch (circuitType) {
      case 'snark':
      case 'credit_score':
        proofData = await snarkService.generateProof('credit_score', inputs);
        proofType = 'snark';
        break;
      case 'stark':
        proofData = await starkService.generateProof(inputs);
        break;
      case 'rollup':
        // For rollup, inputs might be a batch of transactions
        proofData = await rollupService.processBatch(inputs.transactions || []);
        break;
      default:
        throw new ErrorResponse('Invalid circuit type', 400);
    }

    // Save proof to database
    const proofId = 'proofId' in proofData ? proofData.proofId : (proofData as any).batchId;
    const savedProof = await Proof.create({
      proofId,
      userId,
      circuitType: proofType,
      status: 'generated',
      proofData,
      verified: proofData.isValid
    });

    res.status(201).json({
      success: true,
      data: savedProof
    });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message || 'Error generating proof'
    });
  }
};

// Verify a zero-knowledge proof
export const verifyProof = async (req: Request, res: Response) => {
  try {
    const { proofId, circuitType, proofData } = req.body;
    // Handle demo user or real user
    const userId = req.user?._id || 'demo_user';

    // If proofData is provided directly (for verification only without DB)
    if (proofData) {
      let isValid = false;
      switch (circuitType) {
        case 'snark':
          isValid = await snarkService.verifyProof(proofData);
          break;
        case 'stark':
          isValid = await starkService.verifyProof(proofData);
          break;
        case 'rollup':
          isValid = await rollupService.verifyBatch(proofData);
          break;
        default:
          throw new ErrorResponse('Invalid circuit type', 400);
      }
      return res.status(200).json({ success: true, data: { verified: isValid } });
    }

    // Find the proof in DB
    const proof = await Proof.findOne({ proofId, userId });

    if (!proof) {
      throw new ErrorResponse('Proof not found', 404);
    }

    let isValid = false;
    switch (proof.circuitType) {
      case 'snark':
        isValid = await snarkService.verifyProof(proof.proofData);
        break;
      case 'stark':
        isValid = await starkService.verifyProof(proof.proofData);
        break;
      case 'rollup':
        isValid = await rollupService.verifyBatch(proof.proofData);
        break;
    }

    // Update proof status
    proof.verified = isValid;
    proof.status = isValid ? 'verified' : 'verification_failed';
    proof.verifiedAt = new Date();
    await proof.save();

    res.status(200).json({
      success: true,
      data: {
        proofId: proof.proofId,
        verified: proof.verified,
        status: proof.status,
        verifiedAt: proof.verifiedAt
      }
    });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message || 'Error verifying proof'
    });
  }
};

// Run Hybrid Flow
export const runHybridFlow = async (req: Request, res: Response) => {
  try {
    const { userCount = 10 } = req.body;
    const result = await hybridService.runHybridFlow(userCount);

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Error running hybrid flow'
    });
  }
};

// Get user's proof history
export const getProofHistory = async (req: Request, res: Response) => {
  try {
    // Handle demo user or real user
    const userId = req.user?._id || 'demo_user';
    const { limit = 10, page = 1 } = req.query;

    const pageNumber = parseInt(page as string, 10);
    const limitNumber = parseInt(limit as string, 10);
    const skip = (pageNumber - 1) * limitNumber;

    // Get total count for pagination
    const total = await Proof.countDocuments({ userId });
    const proofs = await Proof.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNumber);

    res.status(200).json({
      success: true,
      count: proofs.length,
      total,
      page: pageNumber,
      pages: Math.ceil(total / limitNumber),
      data: proofs
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Error fetching proof history'
    });
  }
};
