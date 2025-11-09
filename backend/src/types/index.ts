/**
 * Type definitions for MTR Monitoring Backend
 */

export interface User {
  id: number;
  username: string;
  email: string;
  password_hash: string;
  created_at: string;
}

export interface Server {
  id: number;
  user_id: number;
  name: string;
  host: string;
  port: number;
  username: string;
  auth_type: 'password' | 'key';
  password?: string;
  private_key?: string;
  location?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface TraceResult {
  id: number;
  user_id: number;
  server_id: number;
  target: string;
  hops: HopData[];
  started_at: string;
  completed_at: string;
  status: 'running' | 'completed' | 'failed';
  error_message?: string;
}

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

export interface AuthRequest extends Express.Request {
  user?: {
    id: number;
    username: string;
    email: string;
  };
}
