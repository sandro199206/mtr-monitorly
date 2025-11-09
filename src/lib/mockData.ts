import { HopData } from "./types";
import type { ServerId } from "./constants";

/**
 * Generates mock trace data for development/testing
 * This should only be used in development mode
 * @param target - The target hostname/IP
 * @param serverId - The server ID to generate data for
 * @returns Array of hop data
 */
export const generateMockTrace = (target: string, serverId: ServerId): HopData[] => {
  const baseLatency: Record<ServerId, number> = {
    "us-west": 20,
    "us-east": 25,
    "eu-central": 35,
    "ap-east": 45,
  };

  const base = baseLatency[serverId] || 30;

  return Array.from({ length: 8 }, (_, i) => ({
    hop: i + 1,
    host: i === 7 ? target : `${serverId}-router-${i + 1}.net`,
    loss: Math.random() * 5,
    sent: 10,
    last: base + (i * 5) + Math.random() * 30,
    avg: base + (i * 5) + Math.random() * 20,
    best: base + (i * 5) + Math.random() * 10,
    worst: base + (i * 5) + Math.random() * 40,
    stdev: 2 + Math.random() * 3,
  }));
};
