import { useState, useCallback } from "react";
import MtrForm from "@/components/MtrForm";
import TraceResults from "@/components/TraceResults";
import LatencyChart from "@/components/LatencyChart";
import { HopData } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { SERVERS, ServerId, TIMING } from "@/lib/constants";
import { generateMockTrace } from "@/lib/mockData";
import { toast } from "sonner";

/**
 * Main page component for MTR monitoring application
 * Handles trace execution, server selection, and results display
 */
const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<HopData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedServer, setSelectedServer] = useState<ServerId>(SERVERS[0].id);
  const [lastTarget, setLastTarget] = useState<string>("");

  /**
   * Handles trace execution with error handling
   * Memoized to prevent unnecessary re-renders
   */
  const handleTrace = useCallback(async (target: string) => {
    setIsLoading(true);
    setError(null);
    setLastTarget(target);

    try {
      // TODO: Replace with actual API call when backend is ready
      // const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.trace}`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ target, serverId: selectedServer }),
      // });
      // if (!response.ok) throw new Error('Trace failed');
      // const data = await response.json();

      // Simulate network request with the selected server
      await new Promise((resolve) => setTimeout(resolve, TIMING.mockDelay));

      const data = generateMockTrace(target, selectedServer);
      setResults(data);
      toast.success(`Trace completed successfully for ${target}`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to execute trace";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Trace error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [selectedServer]);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold">MTR Monitoring</h1>
          <p className="text-muted-foreground">
            Network diagnostics tool to analyze latency and packet loss across network hops
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>New Trace</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="w-full sm:w-48">
                <Select
                  value={selectedServer}
                  onValueChange={(value) => setSelectedServer(value as ServerId)}
                  disabled={isLoading}
                >
                  <SelectTrigger aria-label="Select server location">
                    <SelectValue placeholder="Select server" />
                  </SelectTrigger>
                  <SelectContent>
                    {SERVERS.map((server) => (
                      <SelectItem key={server.id} value={server.id}>
                        {server.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <MtrForm onSubmit={handleTrace} isLoading={isLoading} />
              </div>
            </div>
          </CardContent>
        </Card>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {results.length > 0 && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>
                  Latency Overview
                  {lastTarget && <span className="text-sm font-normal text-muted-foreground ml-2">({lastTarget})</span>}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <LatencyChart hops={results} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Detailed Results</CardTitle>
              </CardHeader>
              <CardContent>
                <TraceResults hops={results} />
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default Index;