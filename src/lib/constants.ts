/**
 * Application-wide constants
 */

// Server configurations
export const SERVERS = [
  { id: "us-west" as const, name: "US West (San Francisco)" },
  { id: "us-east" as const, name: "US East (New York)" },
  { id: "eu-central" as const, name: "EU Central (Frankfurt)" },
  { id: "ap-east" as const, name: "AP East (Tokyo)" },
] as const;

export type ServerId = typeof SERVERS[number]["id"];

// Chart configuration
export const CHART_CONFIG = {
  height: 300,
  margin: { top: 20, right: 30, left: 20, bottom: 20 },
  colors: {
    avg: "#2563eb",
    best: "#16a34a",
    worst: "#dc2626",
  },
} as const;

// Timing constants
export const TIMING = {
  mockDelay: 2000,
  defaultTimeout: 30000,
} as const;

// Validation patterns
export const VALIDATION = {
  // Matches valid hostnames and domains
  hostname: /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)*[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?$/,
  // Matches IPv4 addresses
  ipv4: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
  // Matches IPv6 addresses
  ipv6: /^(?:[a-fA-F0-9]{1,4}:){7}[a-fA-F0-9]{1,4}$|^::(?:[a-fA-F0-9]{1,4}:){0,6}[a-fA-F0-9]{1,4}$|^[a-fA-F0-9]{1,4}::(?:[a-fA-F0-9]{1,4}:){0,5}[a-fA-F0-9]{1,4}$/,
} as const;

// API configuration
export const API_CONFIG = {
  baseUrl: import.meta.env.VITE_API_BASE_URL || '/api',
  endpoints: {
    trace: '/trace',
    servers: '/servers',
  },
} as const;
