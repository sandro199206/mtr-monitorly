/**
 * Dashboard - Main application page with server management and trace execution
 */
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import TraceResults from '@/components/TraceResults';
import LatencyChart from '@/components/LatencyChart';
import { HopData } from '@/lib/types';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [servers, setServers] = useState<any[]>([]);
  const [selectedServers, setSelectedServers] = useState<number[]>([]);
  const [target, setTarget] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  useEffect(() => {
    loadServers();
  }, []);

  const loadServers = async () => {
    try {
      const data = await apiClient.getServers();
      setServers(data.filter((s: any) => s.is_active));
    } catch (error: any) {
      toast.error('Failed to load servers');
    }
  };

  const handleServerToggle = (id: number) => {
    setSelectedServers(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const handleTrace = async () => {
    if (!target.trim()) {
      toast.error('Please enter a target');
      return;
    }

    if (selectedServers.length === 0) {
      toast.error('Please select at least one server');
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiClient.executeTrace(target, selectedServers);
      setResults(response.results);
      toast.success(`Trace completed from ${response.results.length} server(s)!`);
    } catch (error: any) {
      toast.error(error.message || 'Trace failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">MTR Monitoring</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Welcome, {user?.username || 'User'}
            </span>
            <Link to="/servers">
              <Button variant="outline" size="sm">Manage Servers</Button>
            </Link>
            <Link to="/history">
              <Button variant="outline" size="sm">History</Button>
            </Link>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Trace Execution */}
        <Card>
          <CardHeader>
            <CardTitle>Execute MTR Trace</CardTitle>
            <CardDescription>
              Select one or more servers and enter a target to trace
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {servers.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">
                  No servers configured yet
                </p>
                <Link to="/servers">
                  <Button>Add Your First Server</Button>
                </Link>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Select Servers:</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {servers.map((server) => (
                      <div
                        key={server.id}
                        className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-accent cursor-pointer"
                        onClick={() => handleServerToggle(server.id)}
                      >
                        <Checkbox
                          checked={selectedServers.includes(server.id)}
                          onCheckedChange={() => handleServerToggle(server.id)}
                        />
                        <div>
                          <div className="font-medium">{server.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {server.location || server.host}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4">
                  <Input
                    placeholder="Enter target (e.g., google.com or 8.8.8.8)"
                    value={target}
                    onChange={(e) => setTarget(e.target.value)}
                    disabled={isLoading}
                    onKeyDown={(e) => e.key === 'Enter' && handleTrace()}
                  />
                  <Button onClick={handleTrace} disabled={isLoading}>
                    {isLoading ? 'Tracing...' : 'Start Trace'}
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Results */}
        {results.map((result, index) => (
          <div key={index}>
            {result.result.status === 'completed' && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {result.server.name}
                      {result.server.location && (
                        <span className="text-sm font-normal text-muted-foreground ml-2">
                          ({result.server.location})
                        </span>
                      )}
                    </CardTitle>
                    <CardDescription>Trace to {target}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <LatencyChart hops={result.result.hops} />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Detailed Hops</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <TraceResults hops={result.result.hops} />
                  </CardContent>
                </Card>
              </>
            )}
            {result.result.status === 'failed' && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-destructive">
                    {result.server.name} - Failed
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {result.result.error_message || 'Trace execution failed'}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
