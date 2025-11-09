/**
 * Server model and database operations
 */
import db from '../config/database';
import { Server } from '../types';

export class ServerModel {
  /**
   * Create a new server
   */
  static create(data: Omit<Server, 'id' | 'created_at' | 'updated_at'>): Server {
    const stmt = db.prepare(`
      INSERT INTO servers (
        user_id, name, host, port, username, auth_type,
        password, private_key, location, is_active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      data.user_id,
      data.name,
      data.host,
      data.port || 22,
      data.username,
      data.auth_type || 'password',
      data.password || null,
      data.private_key || null,
      data.location || null,
      data.is_active ? 1 : 0
    );

    return this.findById(result.lastInsertRowid as number)!;
  }

  /**
   * Find server by ID
   */
  static findById(id: number): Server | undefined {
    const stmt = db.prepare('SELECT * FROM servers WHERE id = ?');
    return stmt.get(id) as Server | undefined;
  }

  /**
   * Find all servers for a user
   */
  static findByUserId(userId: number): Server[] {
    const stmt = db.prepare('SELECT * FROM servers WHERE user_id = ? ORDER BY created_at DESC');
    return stmt.all(userId) as Server[];
  }

  /**
   * Find active servers for a user
   */
  static findActiveByUserId(userId: number): Server[] {
    const stmt = db.prepare('SELECT * FROM servers WHERE user_id = ? AND is_active = 1 ORDER BY created_at DESC');
    return stmt.all(userId) as Server[];
  }

  /**
   * Update server
   */
  static update(id: number, userId: number, data: Partial<Server>): Server | undefined {
    const fields: string[] = [];
    const values: any[] = [];

    if (data.name !== undefined) {
      fields.push('name = ?');
      values.push(data.name);
    }
    if (data.host !== undefined) {
      fields.push('host = ?');
      values.push(data.host);
    }
    if (data.port !== undefined) {
      fields.push('port = ?');
      values.push(data.port);
    }
    if (data.username !== undefined) {
      fields.push('username = ?');
      values.push(data.username);
    }
    if (data.auth_type !== undefined) {
      fields.push('auth_type = ?');
      values.push(data.auth_type);
    }
    if (data.password !== undefined) {
      fields.push('password = ?');
      values.push(data.password);
    }
    if (data.private_key !== undefined) {
      fields.push('private_key = ?');
      values.push(data.private_key);
    }
    if (data.location !== undefined) {
      fields.push('location = ?');
      values.push(data.location);
    }
    if (data.is_active !== undefined) {
      fields.push('is_active = ?');
      values.push(data.is_active ? 1 : 0);
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    fields.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id, userId);

    const stmt = db.prepare(`
      UPDATE servers
      SET ${fields.join(', ')}
      WHERE id = ? AND user_id = ?
    `);

    stmt.run(...values);
    return this.findById(id);
  }

  /**
   * Delete server
   */
  static delete(id: number, userId: number): boolean {
    const stmt = db.prepare('DELETE FROM servers WHERE id = ? AND user_id = ?');
    const result = stmt.run(id, userId);
    return result.changes > 0;
  }
}
