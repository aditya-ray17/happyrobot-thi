import axios from 'axios';
import { FMCSAVerifyRequest, FMCSAVerifyResponse } from '../types';

const FMCSA_BASE_URL = 'https://mobile.fmcsa.dot.gov/qc/services/carriers/docket-number';

export class FMCSAService {
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.FMCSA_API_KEY || '';
    if (!this.apiKey) {
      throw new Error('FMCSA_API_KEY environment variable is required');
    }
  }

  async verifyCarrier(mcNumber: string): Promise<FMCSAVerifyResponse> {
    try {
      const url = `${FMCSA_BASE_URL}/${mcNumber}?webKey=${this.apiKey}`;
      
      const response = await axios.get(url, {
        timeout: 10000, // 10 second timeout
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'HappyRobot-CarrierSales/1.0'
        }
      });

      const data = response.data;
      
      // Check if carrier is allowed to operate
      const allowedToOperate = data.allowedToOperate === 'Y';
      const carrierName = data.legalName || data.dbaName || 'Unknown Carrier';
      
      return {
        eligible: allowedToOperate,
        carrier_name: carrierName,
        reason: allowedToOperate ? undefined : 'Carrier not authorized to operate'
      };
    } catch (error) {
      console.error('FMCSA API Error:', error);
      
      // Handle different types of errors
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          return {
            eligible: false,
            carrier_name: 'Unknown',
            reason: 'MC number not found in FMCSA database'
          };
        }
        
        if (error.response?.status === 400) {
          return {
            eligible: false,
            carrier_name: 'Unknown',
            reason: 'Invalid MC number format'
          };
        }
      }
      
      // For any other errors, return a generic failure
      return {
        eligible: false,
        carrier_name: 'Unknown',
        reason: 'Unable to verify carrier - service unavailable'
      };
    }
  }
}
