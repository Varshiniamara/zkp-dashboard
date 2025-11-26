import { Router } from 'express';
import { protect } from '../middleware/auth.middleware';
import {
  predictCreditScore,
  batchPredictCreditScore,
  detectFraud,
} from '../controllers/ml.controller';

const router = Router();

// ML routes - can be public or protected depending on use case
// For now, making them public but you can add protect middleware if needed
router.post('/predict/credit-score', predictCreditScore);
router.post('/predict/credit-score/batch', batchPredictCreditScore);
router.post('/detect/fraud', detectFraud);

export default router;

