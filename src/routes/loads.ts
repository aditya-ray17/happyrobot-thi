import { Router, Request, Response } from 'express';
import { prisma } from '../services/prisma';
import { LoadSearchRequest, LoadSearchResponse } from '../types';

const router = Router();

// POST /api/loads/search
router.post('/search', async (req: Request, res: Response) => {
  try {
    const searchParams: LoadSearchRequest = req.body;
    
    // Build where clause for Prisma query
    const whereClause: any = {};
    
    if (searchParams.origin) {
      whereClause.origin = {
        contains: searchParams.origin,
        mode: 'insensitive'
      };
    }
    
    if (searchParams.destination) {
      whereClause.destination = {
        contains: searchParams.destination,
        mode: 'insensitive'
      };
    }
    
    if (searchParams.equipment_type) {
      whereClause.equipment_type = {
        contains: searchParams.equipment_type,
        mode: 'insensitive'
      };
    }
    
    if (searchParams.pickup_after) {
      whereClause.pickup_datetime = {
        ...whereClause.pickup_datetime,
        gte: new Date(searchParams.pickup_after)
      };
    }
    
    if (searchParams.pickup_before) {
      whereClause.pickup_datetime = {
        ...whereClause.pickup_datetime,
        lte: new Date(searchParams.pickup_before)
      };
    }
    
    // Query loads from database
    const loads = await prisma.load.findMany({
      where: whereClause,
      orderBy: {
        pickup_datetime: 'asc'
      }
    });
    
    const response: LoadSearchResponse = {
      loads,
      total: loads.length
    };
    
    res.json(response);
  } catch (error) {
    console.error('Error searching loads:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to search loads'
    });
  }
});

export default router;
