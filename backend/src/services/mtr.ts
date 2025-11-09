/**
 * MTR Service - Executes MTR commands on remote servers via SSH
 */
import { Client } from 'ssh2';
import { Server, HopData } from '../types';

export class MtrService {
  /**
   * Execute MTR on a remote server via SSH
   */
  static async executeMtr(server: Server, target: string, count: number = 10): Promise<HopData[]> {
    return new Promise((resolve, reject) => {
      const conn = new Client();
      let output = '';

      conn.on('ready', () => {
        // Execute MTR command with JSON output
        const command = `mtr --report --report-cycles ${count} --json ${target}`;

        conn.exec(command, (err, stream) => {
          if (err) {
            conn.end();
            return reject(new Error(`Failed to execute command: ${err.message}`));
          }

          stream.on('close', (code: number, signal: string) => {
            conn.end();

            if (code !== 0) {
              return reject(new Error(`MTR command exited with code ${code}`));
            }

            try {
              const hops = this.parseMtrOutput(output);
              resolve(hops);
            } catch (parseError: any) {
              reject(new Error(`Failed to parse MTR output: ${parseError.message}`));
            }
          });

          stream.on('data', (data: Buffer) => {
            output += data.toString();
          });

          stream.stderr.on('data', (data: Buffer) => {
            console.error('MTR stderr:', data.toString());
          });
        });
      });

      conn.on('error', (err) => {
        reject(new Error(`SSH connection failed: ${err.message}`));
      });

      // Connect to server
      const connectionConfig: any = {
        host: server.host,
        port: server.port,
        username: server.username,
        readyTimeout: 30000,
      };

      if (server.auth_type === 'password' && server.password) {
        connectionConfig.password = server.password;
      } else if (server.auth_type === 'key' && server.private_key) {
        connectionConfig.privateKey = server.private_key;
      } else {
        return reject(new Error('Invalid authentication configuration'));
      }

      conn.connect(connectionConfig);
    });
  }

  /**
   * Parse MTR JSON output into HopData array
   */
  private static parseMtrOutput(output: string): HopData[] {
    try {
      const data = JSON.parse(output);

      if (!data.report || !data.report.hubs) {
        throw new Error('Invalid MTR JSON structure');
      }

      const hops: HopData[] = data.report.hubs.map((hub: any, index: number) => ({
        hop: index + 1,
        host: hub.host || '???',
        loss: parseFloat(hub.Loss || 0),
        sent: parseInt(hub.Snt || 0, 10),
        last: parseFloat(hub.Last || 0),
        avg: parseFloat(hub.Avg || 0),
        best: parseFloat(hub.Best || 0),
        worst: parseFloat(hub.Wrst || 0),
        stdev: parseFloat(hub.StDev || 0),
      }));

      return hops;
    } catch (error: any) {
      // Fallback: Try to parse legacy text output
      return this.parseMtrTextOutput(output);
    }
  }

  /**
   * Fallback parser for text-based MTR output
   */
  private static parseMtrTextOutput(output: string): HopData[] {
    const lines = output.split('\n').filter(line => line.trim().length > 0);
    const hops: HopData[] = [];

    // Skip header lines and parse data rows
    let dataStarted = false;

    for (const line of lines) {
      if (line.includes('Host') && line.includes('Loss')) {
        dataStarted = true;
        continue;
      }

      if (!dataStarted) continue;

      // Parse line format: "  1. hostname  0.0%  10  1.2  1.5  1.1  2.0  0.3"
      const match = line.match(/^\s*(\d+)\.\s+(\S+)\s+([\d.]+)%\s+(\d+)\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)/);

      if (match) {
        hops.push({
          hop: parseInt(match[1], 10),
          host: match[2],
          loss: parseFloat(match[3]),
          sent: parseInt(match[4], 10),
          last: parseFloat(match[5]),
          avg: parseFloat(match[6]),
          best: parseFloat(match[7]),
          worst: parseFloat(match[8]),
          stdev: parseFloat(match[9]),
        });
      }
    }

    if (hops.length === 0) {
      throw new Error('No hop data found in MTR output');
    }

    return hops;
  }

  /**
   * Execute MTR on multiple servers in parallel
   */
  static async executeParallel(servers: Server[], target: string, count: number = 10): Promise<Map<number, HopData[]>> {
    const results = new Map<number, HopData[]>();

    const promises = servers.map(async (server) => {
      try {
        const hops = await this.executeMtr(server, target, count);
        results.set(server.id, hops);
      } catch (error: any) {
        console.error(`Failed to execute MTR on server ${server.name}:`, error.message);
        // Don't add to results if failed - calling code can check for missing IDs
      }
    });

    await Promise.all(promises);
    return results;
  }

  /**
   * Test SSH connection to a server
   */
  static async testConnection(server: Server): Promise<{ success: boolean; message: string }> {
    return new Promise((resolve) => {
      const conn = new Client();

      const timeout = setTimeout(() => {
        conn.end();
        resolve({ success: false, message: 'Connection timeout' });
      }, 10000);

      conn.on('ready', () => {
        clearTimeout(timeout);
        conn.end();
        resolve({ success: true, message: 'Connection successful' });
      });

      conn.on('error', (err) => {
        clearTimeout(timeout);
        resolve({ success: false, message: err.message });
      });

      const connectionConfig: any = {
        host: server.host,
        port: server.port,
        username: server.username,
        readyTimeout: 10000,
      };

      if (server.auth_type === 'password' && server.password) {
        connectionConfig.password = server.password;
      } else if (server.auth_type === 'key' && server.private_key) {
        connectionConfig.privateKey = server.private_key;
      }

      conn.connect(connectionConfig);
    });
  }
}
