/**
 * Trace History Page
 */
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiClient } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Download, ExternalLink } from 'lucide-react';

export default function History() {
  const [traces, setTraces] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const data = await apiClient.getTraceHistory();
      setTraces(data);
    } catch (error) {
      toast.error('Failed to load history');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = async (id: number, format: 'json' | 'csv') => {
    try {
      await apiClient.exportTrace(id, format);
      toast.success(`Exported as ${format.toUpperCase()}`);
    } catch (error) {
      toast.error('Export failed');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Trace History</h1>
          <Link to="/dashboard">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6 space-y-4">
        {isLoading ? (
          <p className="text-center text-muted-foreground">Loading...</p>
        ) : traces.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-muted-foreground">No trace history yet</p>
            </CardContent>
          </Card>
        ) : (
          traces.map((trace) => (
            <Card key={trace.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      Trace to {trace.target}
                      <Badge variant={trace.status === 'completed' ? 'default' : 'destructive'}>
                        {trace.status}
                      </Badge>
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {trace.server?.name || 'Unknown Server'} • {new Date(trace.started_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleExport(trace.id, 'csv')}>
                      <Download className="w-4 h-4 mr-1" /> CSV
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleExport(trace.id, 'json')}>
                      <Download className="w-4 h-4 mr-1" /> JSON
                    </Button>
                  </div>
                </div>
              </CardHeader>
              {trace.status === 'completed' && (
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {trace.hops.length} hops • Avg latency: {(trace.hops.reduce((sum: number, h: any) => sum + h.avg, 0) / trace.hops.length).toFixed(2)}ms
                  </p>
                </CardContent>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
