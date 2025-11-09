/**
 * Authentication configuration
 */

export const AUTH_CONFIG = {
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
  jwtExpiresIn: '7d',
  saltRounds: 10,
};
