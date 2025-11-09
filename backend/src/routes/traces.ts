/**
 * MTR Trace routes
 */
import { Router, Response } from 'express';
import { z } from 'zod';
import { ServerModel } from '../models/Server';
import { TraceResultModel } from '../models/TraceResult';
import { MtrService } from '../services/mtr';
import { authenticateToken } from '../middleware/auth';
import { AuthRequest } from '../types';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// Validation schema
const traceSchema = z.object({
  target: z.string().min(1),
  server_ids: z.array(z.number()).min(1),
  count: z.number().min(1).max(100).default(10),
});

/**
 * POST /api/traces
 * Execute MTR trace from one or multiple servers
 */
router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const { target, server_ids, count } = traceSchema.parse(req.body);

    // Fetch all servers
    const servers = server_ids.map(id => ServerModel.findById(id))
      .filter(s => s && s.user_id === req.user!.id && s.is_active) as any[];

    if (servers.length === 0) {
      return res.status(400).json({ error: 'No valid servers found' });
    }

    // Execute MTR on all servers in parallel
    const results = await MtrService.executeParallel(servers, target, count);

    // Save results to database
    const savedResults = [];
    for (const server of servers) {
      const hops = results.get(server.id);

      if (hops) {
        const traceResult = TraceResultModel.create(req.user!.id, server.id, target);
        const completed = TraceResultModel.complete(traceResult.id, hops, 'completed');
        savedResults.push({
          server: {
            id: server.id,
            name: server.name,
            location: server.location,
          },
          result: completed,
        });
      } else {
        const traceResult = TraceResultModel.create(req.user!.id, server.id, target);
        TraceResultModel.complete(traceResult.id, [], 'failed', 'MTR execution failed');
        savedResults.push({
          server: {
            id: server.id,
            name: server.name,
            location: server.location,
          },
          result: {
            ...traceResult,
            status: 'failed',
            error_message: 'MTR execution failed',
          },
        });
      }
    }

    res.json({
      target,
      results: savedResults,
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation failed', details: error.errors });
    }
    console.error('Error executing trace:', error);
    res.status(500).json({ error: 'Failed to execute trace', message: error.message });
  }
});

/**
 * GET /api/traces
 * Get trace history
 */
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 50;
    const traces = TraceResultModel.findByUserId(req.user!.id, limit);

    // Enrich with server information
    const enrichedTraces = traces.map(trace => {
      const server = trace.server_id ? ServerModel.findById(trace.server_id) : null;
      return {
        ...trace,
        server: server ? {
          id: server.id,
          name: server.name,
          location: server.location,
        } : null,
      };
    });

    res.json(enrichedTraces);
  } catch (error: any) {
    console.error('Error fetching trace history:', error);
    res.status(500).json({ error: 'Failed to fetch trace history' });
  }
});

/**
 * GET /api/traces/:id
 * Get a specific trace result
 */
router.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const trace = TraceResultModel.findById(id);

    if (!trace || trace.user_id !== req.user!.id) {
      return res.status(404).json({ error: 'Trace not found' });
    }

    // Enrich with server information
    const server = trace.server_id ? ServerModel.findById(trace.server_id) : null;

    res.json({
      ...trace,
      server: server ? {
        id: server.id,
        name: server.name,
        location: server.location,
      } : null,
    });
  } catch (error: any) {
    console.error('Error fetching trace:', error);
    res.status(500).json({ error: 'Failed to fetch trace' });
  }
});

/**
 * GET /api/traces/stats
 * Get trace statistics
 */
router.get('/stats/summary', async (req: AuthRequest, res: Response) => {
  try {
    const stats = TraceResultModel.getStats(req.user!.id);
    res.json(stats);
  } catch (error: any) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

/**
 * POST /api/traces/:id/export
 * Export trace result
 */
router.post('/:id/export', async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const format = req.body.format || 'json';

    const trace = TraceResultModel.findById(id);

    if (!trace || trace.user_id !== req.user!.id) {
      return res.status(404).json({ error: 'Trace not found' });
    }

    if (format === 'csv') {
      // Generate CSV
      let csv = 'Hop,Host,Loss %,Sent,Last (ms),Avg (ms),Best (ms),Worst (ms),StDev\n';
      trace.hops.forEach(hop => {
        csv += `${hop.hop},${hop.host},${hop.loss},${hop.sent},${hop.last},${hop.avg},${hop.best},${hop.worst},${hop.stdev}\n`;
      });

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="trace-${id}.csv"`);
      res.send(csv);
    } else {
      // JSON export
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename="trace-${id}.json"`);
      res.json(trace);
    }
  } catch (error: any) {
    console.error('Error exporting trace:', error);
    res.status(500).json({ error: 'Failed to export trace' });
  }
});

export default router;
