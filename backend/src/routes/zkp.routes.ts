import { Router } from 'express';
import { optionalAuth } from '../middleware/optionalAuth.middleware';
import {
  generateProof,
  verifyProof,
  getProofHistory,
  runHybridFlow
} from '../controllers/zkp.controller';
import { getCircuitCode } from '../controllers/circuit.controller';

const router = Router();

// Use optional auth - works with or without authentication
// Allows demo usage but also supports authenticated users
router.use(optionalAuth);

// ZKP routes
router.post('/generate', generateProof);
router.post('/verify', verifyProof);
router.post('/hybrid', runHybridFlow);
router.get('/history', getProofHistory);
router.get('/circuit/:circuitName', getCircuitCode);

export default router;
