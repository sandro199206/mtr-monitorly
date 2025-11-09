import { VALIDATION } from "./constants";

/**
 * Validates if a string is a valid hostname
 * @param hostname - The hostname to validate
 * @returns true if valid hostname, false otherwise
 */
export const isValidHostname = (hostname: string): boolean => {
  return VALIDATION.hostname.test(hostname);
};

/**
 * Validates if a string is a valid IPv4 address
 * @param ip - The IP address to validate
 * @returns true if valid IPv4, false otherwise
 */
export const isValidIPv4 = (ip: string): boolean => {
  return VALIDATION.ipv4.test(ip);
};

/**
 * Validates if a string is a valid IPv6 address
 * @param ip - The IP address to validate
 * @returns true if valid IPv6, false otherwise
 */
export const isValidIPv6 = (ip: string): boolean => {
  return VALIDATION.ipv6.test(ip);
};

/**
 * Validates if a string is a valid target (hostname, IPv4, or IPv6)
 * @param target - The target to validate
 * @returns Object with validation result and error message if invalid
 */
export const validateTarget = (target: string): { valid: boolean; error?: string } => {
  if (!target || target.trim().length === 0) {
    return { valid: false, error: "Please enter a target host or IP address" };
  }

  const trimmedTarget = target.trim();

  if (isValidHostname(trimmedTarget) || isValidIPv4(trimmedTarget) || isValidIPv6(trimmedTarget)) {
    return { valid: true };
  }

  return {
    valid: false,
    error: "Please enter a valid hostname or IP address (e.g., google.com or 8.8.8.8)"
  };
};
