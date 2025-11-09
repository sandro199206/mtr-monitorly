/**
 * Trace Result model and database operations
 */
import db from '../config/database';
import { TraceResult, HopData } from '../types';

export class TraceResultModel {
  /**
   * Create a new trace result
   */
  static create(
    userId: number,
    serverId: number | null,
    target: string
  ): TraceResult {
    const stmt = db.prepare(`
      INSERT INTO trace_results (user_id, server_id, target, hops, status)
      VALUES (?, ?, ?, ?, 'running')
    `);

    const result = stmt.run(userId, serverId, target, '[]');
    return this.findById(result.lastInsertRowid as number)!;
  }

  /**
   * Find trace result by ID
   */
  static findById(id: number): TraceResult | undefined {
    const stmt = db.prepare('SELECT * FROM trace_results WHERE id = ?');
    const row = stmt.get(id) as any;

    if (!row) return undefined;

    return {
      ...row,
      hops: JSON.parse(row.hops),
    };
  }

  /**
   * Find all trace results for a user
   */
  static findByUserId(userId: number, limit: number = 50): TraceResult[] {
    const stmt = db.prepare(`
      SELECT * FROM trace_results
      WHERE user_id = ?
      ORDER BY started_at DESC
      LIMIT ?
    `);

    const rows = stmt.all(userId, limit) as any[];
    return rows.map(row => ({
      ...row,
      hops: JSON.parse(row.hops),
    }));
  }

  /**
   * Update trace result with hops data
   */
  static complete(
    id: number,
    hops: HopData[],
    status: 'completed' | 'failed' = 'completed',
    errorMessage?: string
  ): TraceResult | undefined {
    const stmt = db.prepare(`
      UPDATE trace_results
      SET hops = ?, status = ?, completed_at = CURRENT_TIMESTAMP, error_message = ?
      WHERE id = ?
    `);

    stmt.run(JSON.stringify(hops), status, errorMessage || null, id);
    return this.findById(id);
  }

  /**
   * Delete old trace results (older than X days)
   */
  static deleteOld(days: number = 30): number {
    const stmt = db.prepare(`
      DELETE FROM trace_results
      WHERE started_at < datetime('now', '-${days} days')
    `);

    const result = stmt.run();
    return result.changes;
  }

  /**
   * Get trace statistics for a user
   */
  static getStats(userId: number) {
    const stmt = db.prepare(`
      SELECT
        COUNT(*) as total_traces,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as successful_traces,
        COUNT(CASE WHEN status = 'failed' THEN 1 END) as failed_traces,
        COUNT(CASE WHEN started_at >= datetime('now', '-24 hours') THEN 1 END) as traces_24h
      FROM trace_results
      WHERE user_id = ?
    `);

    return stmt.get(userId);
  }
}
