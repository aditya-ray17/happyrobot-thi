import { Router, Request, Response } from 'express';
import { prisma } from '../services/prisma';
import { MetricsResponse } from '../types';

const router = Router();

// GET /api/metrics
router.get('/', async (req: Request, res: Response) => {
  try {
    // Get total calls
    const totalCalls = await prisma.callRecord.count();
    
    // Get successful bookings (calls with classification 'booked')
    const successfulBookings = await prisma.callRecord.count({
      where: { classification: 'booked' }
    });
    
    // Calculate conversion rate
    const conversionRate = totalCalls > 0 ? (successfulBookings / totalCalls) * 100 : 0;
    
    // Get average call duration
    const avgDurationResult = await prisma.callRecord.aggregate({
      _avg: {
        duration: true
      },
      where: {
        duration: { not: null }
      }
    });
    const averageCallDuration = avgDurationResult._avg.duration || 0;
    
    // Get sentiment distribution
    const sentimentDistribution = await prisma.callRecord.groupBy({
      by: ['sentiment'],
      _count: {
        sentiment: true
      },
      where: {
        sentiment: { not: null }
      }
    });
    
    const sentimentDist = {
      positive: 0,
      neutral: 0,
      negative: 0
    };
    
    sentimentDistribution.forEach(item => {
      if (item.sentiment === 'positive') sentimentDist.positive = item._count.sentiment;
      if (item.sentiment === 'neutral') sentimentDist.neutral = item._count.sentiment;
      if (item.sentiment === 'negative') sentimentDist.negative = item._count.sentiment;
    });
    
    // Get counter-offer rate (calls with negotiated_price different from loadboard_rate)
    const counterOfferCalls = await prisma.callRecord.count({
      where: {
        AND: [
          { negotiated_price: { not: null } },
          { loadboard_rate: { not: null } },
          {
            NOT: {
              negotiated_price: { equals: prisma.callRecord.fields.loadboard_rate }
            }
          }
        ]
      }
    });
    const counterOfferRate = totalCalls > 0 ? (counterOfferCalls / totalCalls) * 100 : 0;
    
    // Calculate average negotiation rounds
    const avgNegotiationResult = await prisma.callRecord.aggregate({
      _avg: {
        negotiation_rounds: true
      },
      where: {
        negotiation_rounds: { not: null }
      }
    });
    const averageNegotiationRounds = avgNegotiationResult._avg.negotiation_rounds || 0;
    
    // Get popular routes from actual calls (via load relationship)
    const callsWithLoads = await prisma.callRecord.findMany({
      where: {
        load_id: { not: null }
      },
      include: {
        load: {
          select: {
            origin: true,
            destination: true,
            equipment_type: true
          }
        }
      }
    });
    
    // Aggregate routes from calls
    const routeMap = new Map<string, number>();
    callsWithLoads.forEach(call => {
      if (call.load) {
        const route = `${call.load.origin} → ${call.load.destination}`;
        routeMap.set(route, (routeMap.get(route) || 0) + 1);
      }
    });
    
    const routes = Array.from(routeMap.entries())
      .map(([route, count]) => ({ route, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
    
    // Aggregate equipment types from calls
    const equipmentMap = new Map<string, number>();
    callsWithLoads.forEach(call => {
      if (call.load?.equipment_type) {
        const eq = call.load.equipment_type;
        equipmentMap.set(eq, (equipmentMap.get(eq) || 0) + 1);
      }
    });
    
    const equipment = Array.from(equipmentMap.entries())
      .map(([equipment_type, count]) => ({ equipment_type, count }))
      .sort((a, b) => b.count - a.count);
    
    // Get recent calls
    const recentCalls = await prisma.callRecord.findMany({
      orderBy: {
        timestamp: 'desc'
      },
      take: 20,
      select: {
        call_id: true,
        mc_number: true,
        carrier_name: true,
        classification: true,
        sentiment: true,
        timestamp: true
      }
    });
    
    const response: MetricsResponse = {
      total_calls: totalCalls,
      successful_bookings: successfulBookings,
      conversion_rate: Math.round(conversionRate * 100) / 100,
      average_call_duration: Math.round(averageCallDuration),
      sentiment_distribution: sentimentDist,
      counter_offer_rate: Math.round(counterOfferRate * 100) / 100,
      average_negotiation_rounds: Math.round(averageNegotiationRounds * 100) / 100,
      popular_routes: routes,
      popular_equipment: equipment,
      recent_calls: recentCalls
    };
    
    res.json(response);
  } catch (error) {
    console.error('Error fetching metrics:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch metrics'
    });
  }
});

export default router;