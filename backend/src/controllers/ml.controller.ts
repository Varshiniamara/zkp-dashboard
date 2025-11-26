import { Request, Response } from 'express';
import { mlService } from '../services/mlService';
import { ErrorResponse } from '../middleware/error.middleware';

/**
 * Predict credit score using ML model
 */
export const predictCreditScore = async (req: Request, res: Response) => {
  try {
    const { age, salary, balance, txCount, country } = req.body;

    // Validate required fields
    if (age === undefined || salary === undefined || balance === undefined || txCount === undefined) {
      throw new ErrorResponse('Missing required fields: age, salary, balance, txCount', 400);
    }

    const prediction = await mlService.predictCreditScore({
      age,
      salary,
      balance,
      txCount,
      country,
    });

    res.status(200).json({
      success: true,
      data: prediction,
    });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message || 'Error predicting credit score',
    });
  }
};

/**
 * Batch predict credit scores
 */
export const batchPredictCreditScore = async (req: Request, res: Response) => {
  try {
    const { inputs } = req.body;

    if (!Array.isArray(inputs) || inputs.length === 0) {
      throw new ErrorResponse('Inputs must be a non-empty array', 400);
    }

    const predictions = await mlService.batchPredictCreditScores(inputs);

    res.status(200).json({
      success: true,
      count: predictions.length,
      data: predictions,
    });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message || 'Error batch predicting credit scores',
    });
  }
};

/**
 * Detect fraud in user data
 */
export const detectFraud = async (req: Request, res: Response) => {
  try {
    const { age, salary, balance, txCount } = req.body;

    // Validate required fields
    if (age === undefined || salary === undefined || balance === undefined || txCount === undefined) {
      throw new ErrorResponse('Missing required fields: age, salary, balance, txCount', 400);
    }

    const fraudResult = await mlService.detectFraud({
      age,
      salary,
      balance,
      txCount,
    });

    res.status(200).json({
      success: true,
      data: fraudResult,
    });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message || 'Error detecting fraud',
    });
  }
};

