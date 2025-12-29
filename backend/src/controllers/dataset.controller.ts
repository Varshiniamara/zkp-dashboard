import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { ErrorResponse } from '../middleware/error.middleware';

const DATA_DIR = path.join(__dirname, '../../../');
const USERS_JSON = path.join(DATA_DIR, 'test/data/users.json');

/**
 * Get dataset entries with pagination
 */
export const getDataset = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;

    // Read dataset from file
    let users: any[] = [];
    console.log('Dataset path:', USERS_JSON);
    console.log('File exists:', fs.existsSync(USERS_JSON));
    if (fs.existsSync(USERS_JSON)) {
      const fileContent = fs.readFileSync(USERS_JSON, 'utf-8');
      users = JSON.parse(fileContent);
    } else {
      // Return empty if file doesn't exist
      return res.status(200).json({
        success: true,
        count: 0,
        total: 0,
        page,
        pages: 0,
        data: [],
      });
    }

    const total = users.length;
    const pages = Math.ceil(total / limit);
    const skip = (page - 1) * limit;
    const paginatedUsers = users.slice(skip, skip + limit);

    res.status(200).json({
      success: true,
      count: paginatedUsers.length,
      total,
      page,
      pages,
      data: paginatedUsers,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Error fetching dataset',
    });
  }
};

/**
 * Get single dataset entry by ID
 */
export const getDatasetEntry = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Read dataset from file
    let users: any[] = [];
    if (fs.existsSync(USERS_JSON)) {
      const fileContent = fs.readFileSync(USERS_JSON, 'utf-8');
      users = JSON.parse(fileContent);
    }

    const user = users.find((u: any) => u.user_id === parseInt(id));

    if (!user) {
      throw new ErrorResponse('Dataset entry not found', 404);
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message || 'Error fetching dataset entry',
    });
  }
};

