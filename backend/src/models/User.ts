/**
 * User model and database operations
 */
import db from '../config/database';
import bcrypt from 'bcryptjs';
import { User } from '../types';
import { AUTH_CONFIG } from '../config/auth';

export class UserModel {
  /**
   * Create a new user
   */
  static create(username: string, email: string, password: string): User {
    const passwordHash = bcrypt.hashSync(password, AUTH_CONFIG.saltRounds);

    const stmt = db.prepare(`
      INSERT INTO users (username, email, password_hash)
      VALUES (?, ?, ?)
    `);

    const result = stmt.run(username, email, passwordHash);

    return this.findById(result.lastInsertRowid as number)!;
  }

  /**
   * Find user by ID
   */
  static findById(id: number): User | undefined {
    const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
    return stmt.get(id) as User | undefined;
  }

  /**
   * Find user by username
   */
  static findByUsername(username: string): User | undefined {
    const stmt = db.prepare('SELECT * FROM users WHERE username = ?');
    return stmt.get(username) as User | undefined;
  }

  /**
   * Find user by email
   */
  static findByEmail(email: string): User | undefined {
    const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
    return stmt.get(email) as User | undefined;
  }

  /**
   * Verify password
   */
  static verifyPassword(password: string, hash: string): boolean {
    return bcrypt.compareSync(password, hash);
  }
}
