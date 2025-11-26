import { Router } from 'express';
import { getDataset, getDatasetEntry } from '../controllers/dataset.controller';

const router = Router();

// Dataset routes - public access
router.get('/', getDataset);
router.get('/:id', getDatasetEntry);

export default router;

