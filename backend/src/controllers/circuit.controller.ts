import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { ErrorResponse } from '../middleware/error.middleware';

export const getCircuitCode = async (req: Request, res: Response) => {
    try {
        const { circuitName } = req.params;

        // Sanitize circuit name to prevent directory traversal
        const safeName = circuitName.replace(/[^a-zA-Z0-9_]/g, '');

        const circuitPath = path.join(__dirname, '../../../circuits/snark', `${safeName}.circom`);

        if (!fs.existsSync(circuitPath)) {
            throw new ErrorResponse('Circuit not found', 404);
        }

        const code = fs.readFileSync(circuitPath, 'utf-8');

        res.status(200).json({
            success: true,
            data: {
                name: safeName,
                code
            }
        });
    } catch (error: any) {
        res.status(error.statusCode || 500).json({
            success: false,
            error: error.message || 'Error fetching circuit code'
        });
    }
};
