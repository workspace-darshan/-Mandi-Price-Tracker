export interface MandiRecord {
  market: string
  district: string
  state: string
  commodity: string
  variety: string
  min_price: number
  max_price: number
  modal_price: number
  unit: string
  date: string
}

export interface Prediction {
  trend: 'UP' | 'DOWN' | 'STABLE'
  predicted_price: number
  reason: string
  confidence: 'HIGH' | 'MEDIUM' | 'LOW'
}
