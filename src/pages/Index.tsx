import { useState } from "react";
import MtrForm from "@/components/MtrForm";
import TraceResults from "@/components/TraceResults";
import LatencyChart from "@/components/LatencyChart";
import { HopData } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Mock servers data
const SERVERS = [
  { id: "us-west", name: "US West (San Francisco)" },
  { id: "us-east", name: "US East (New York)" },
  { id: "eu-central", name: "EU Central (Frankfurt)" },
  { id: "ap-east", name: "AP East (Tokyo)" },
];

// Temporary mock data for demonstration with server-specific latency patterns
const mockTrace = (target: string, serverId: string): HopData[] => {
  const baseLatency = {
    "us-west": 20,
    "us-east": 25,
    "eu-central": 35,
    "ap-east": 45,
  }[serverId] || 30;

  return Array.from({ length: 8 }, (_, i) => ({
    hop: i + 1,
    host: i === 7 ? target : `${serverId}-router-${i + 1}.net`,
    loss: Math.random() * 5,
    sent: 10,
    last: baseLatency + (i * 5) + Math.random() * 30,
    avg: baseLatency + (i * 5) + Math.random() * 20,
    best: baseLatency + (i * 5) + Math.random() * 10,
    worst: baseLatency + (i * 5) + Math.random() * 40,
    stdev: 2 + Math.random() * 3,
  }));
};

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<HopData[]>([]);
  const [selectedServer, setSelectedServer] = useState(SERVERS[0].id);

  const handleTrace = async (target: string) => {
    setIsLoading(true);
    // Simulate network request with the selected server
    setTimeout(() => {
      const data = mockTrace(target, selectedServer);
      setResults(data);
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <h1 className="text-4xl font-bold mb-8">MTR Monitoring</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>New Trace</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="w-full sm:w-48">
                <Select
                  value={selectedServer}
                  onValueChange={setSelectedServer}
                >
                  <SelectTrigger>
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

        {results.length > 0 && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Latency Overview</CardTitle>
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