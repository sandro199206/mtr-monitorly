export interface HopData {
  hop: number;
  host: string;
  loss: number;
  sent: number;
  last: number;
  avg: number;
  best: number;
  worst: number;
  stdev: number;
}

export interface MtrResult {
  target: string;
  timestamp: number;
  hops: HopData[];
}