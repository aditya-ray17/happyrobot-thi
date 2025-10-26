import { Router, Request, Response } from 'express';
import { prisma } from '../services/prisma';
import { CallRecordRequest, CallRecordResponse } from '../types';

const router = Router();

// POST /api/calls/record
router.post('/record', async (req: Request, res: Response) => {
  try {
    const callData: CallRecordRequest = req.body;
    
    // Validate required fields
    if (!callData.call_id || !callData.mc_number) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'call_id and mc_number are required'
      });
    }
    
    // Check if call record already exists
    const existingCall = await prisma.callRecord.findUnique({
      where: { call_id: callData.call_id }
    });
    
    if (existingCall) {
      return res.status(409).json({
        error: 'Conflict',
        message: 'Call record already exists'
      });
    }
    
    // Create new call record
    const callRecord = await prisma.callRecord.create({
      data: {
        call_id: callData.call_id,
        mc_number: callData.mc_number,
        carrier_name: callData.carrier_name,
        transcript: callData.transcript,
        classification: callData.classification,
        sentiment: callData.sentiment,
        negotiated_price: callData.negotiated_price,
        loadboard_rate: callData.loadboard_rate,
        load_id: callData.load_id,
        duration: callData.duration,
        negotiation_rounds: callData.negotiation_rounds
      }
    });
    
    const response: CallRecordResponse = {
      success: true,
      call_id: callRecord.call_id
    };
    
    res.status(201).json(response);
  } catch (error) {
    console.error('Error recording call:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to record call'
    });
  }
});

export default router;
