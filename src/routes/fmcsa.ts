import { Router, Request, Response } from 'express';
import { FMCSAService } from '../services/fmcsa.service';
import { FMCSAVerifyRequest } from '../types';

const router = Router();
const fmcsaService = new FMCSAService();

// POST /api/fmcsa/verify
router.post('/verify', async (req: Request, res: Response) => {
  try {
    const { mc_number }: FMCSAVerifyRequest = req.body;
    
    // Validate input
    if (!mc_number) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'MC number is required'
      });
    }
    
    // Validate MC number format (should be numeric)
    if (!/^\d+$/.test(mc_number)) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'MC number must contain only digits'
      });
    }
    
    // Verify carrier with FMCSA
    const result = await fmcsaService.verifyCarrier(mc_number);
    
    res.json(result);
  } catch (error) {
    console.error('Error verifying carrier:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to verify carrier'
    });
  }
});

export default router;
