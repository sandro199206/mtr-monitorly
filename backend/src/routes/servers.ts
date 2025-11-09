/**
 * Server management routes
 */
import { Router, Response } from 'express';
import { z } from 'zod';
import { ServerModel } from '../models/Server';
import { MtrService } from '../services/mtr';
import { authenticateToken } from '../middleware/auth';
import { AuthRequest } from '../types';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// Validation schema
const serverSchema = z.object({
  name: z.string().min(1),
  host: z.string().min(1),
  port: z.number().min(1).max(65535).default(22),
  username: z.string().min(1),
  auth_type: z.enum(['password', 'key']),
  password: z.string().optional(),
  private_key: z.string().optional(),
  location: z.string().optional(),
  is_active: z.boolean().default(true),
});

/**
 * GET /api/servers
 * Get all servers for the authenticated user
 */
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const servers = ServerModel.findByUserId(req.user!.id);

    // Remove sensitive data before sending
    const sanitizedServers = servers.map(s => ({
      ...s,
      password: undefined,
      private_key: undefined,
    }));

    res.json(sanitizedServers);
  } catch (error: any) {
    console.error('Error fetching servers:', error);
    res.status(500).json({ error: 'Failed to fetch servers' });
  }
});

/**
 * POST /api/servers
 * Create a new server
 */
router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const data = serverSchema.parse(req.body);

    const server = ServerModel.create({
      ...data,
      user_id: req.user!.id,
    });

    res.status(201).json({
      ...server,
      password: undefined,
      private_key: undefined,
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation failed', details: error.errors });
    }
    console.error('Error creating server:', error);
    res.status(500).json({ error: 'Failed to create server' });
  }
});

/**
 * PUT /api/servers/:id
 * Update a server
 */
router.put('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const data = serverSchema.partial().parse(req.body);

    const server = ServerModel.update(id, req.user!.id, data);

    if (!server) {
      return res.status(404).json({ error: 'Server not found' });
    }

    res.json({
      ...server,
      password: undefined,
      private_key: undefined,
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation failed', details: error.errors });
    }
    console.error('Error updating server:', error);
    res.status(500).json({ error: 'Failed to update server' });
  }
});

/**
 * DELETE /api/servers/:id
 * Delete a server
 */
router.delete('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const success = ServerModel.delete(id, req.user!.id);

    if (!success) {
      return res.status(404).json({ error: 'Server not found' });
    }

    res.status(204).send();
  } catch (error: any) {
    console.error('Error deleting server:', error);
    res.status(500).json({ error: 'Failed to delete server' });
  }
});

/**
 * POST /api/servers/:id/test
 * Test SSH connection to a server
 */
router.post('/:id/test', async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const server = ServerModel.findById(id);

    if (!server || server.user_id !== req.user!.id) {
      return res.status(404).json({ error: 'Server not found' });
    }

    const result = await MtrService.testConnection(server);
    res.json(result);
  } catch (error: any) {
    console.error('Error testing connection:', error);
    res.status(500).json({ error: 'Failed to test connection' });
  }
});

export default router;
