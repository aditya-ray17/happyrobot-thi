// API Request/Response Types

export interface LoadSearchRequest {
  origin?: string;
  destination?: string;
  equipment_type?: string;
  pickup_after?: string;
  pickup_before?: string;
}

export interface LoadSearchResponse {
  loads: Load[];
  total: number;
}

export interface Load {
  id: number;
  load_id: string;
  origin: string;
  destination: string;
  pickup_datetime: Date;
  delivery_datetime: Date;
  equipment_type: string;
  loadboard_rate: number;
  notes?: string | null;
  weight: number;
  commodity_type: string;
  num_of_pieces: number;
  miles: number;
  dimensions: string;
  created_at: Date;
  updated_at: Date;
}

export interface FMCSAVerifyRequest {
  mc_number: string;
}

export interface FMCSAVerifyResponse {
  eligible: boolean;
  carrier_name: string;
  reason?: string;
}

export interface CallRecordRequest {
  call_id: string;
  mc_number: string;
  carrier_name?: string;
  transcript?: string;
  classification?: string;
  sentiment?: string;
  negotiated_price?: number;
  loadboard_rate?: number;
  load_id?: string;
  duration?: number;
  extracted_data?: any;
}

export interface CallRecordResponse {
  success: boolean;
  call_id: string;
}

export interface MetricsResponse {
  total_calls: number;
  successful_bookings: number;
  conversion_rate: number;
  average_call_duration: number;
  sentiment_distribution: {
    positive: number;
    neutral: number;
    negative: number;
  };
  counter_offer_rate: number;
  average_negotiation_rounds: number;
  popular_routes: Array<{
    route: string;
    count: number;
  }>;
  popular_equipment: Array<{
    equipment_type: string;
    count: number;
  }>;
  recent_calls: Array<{
    call_id: string;
    mc_number: string;
    carrier_name?: string | null;
    classification?: string | null;
    sentiment?: string | null;
    timestamp: Date;
  }>;
}
