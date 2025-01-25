import { useState } from "react";
import MtrForm from "@/components/MtrForm";
import TraceResults from "@/components/TraceResults";
import LatencyChart from "@/components/LatencyChart";
import { HopData } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Temporary mock data for demonstration
const mockTrace = (target: string): HopData[] => {
  return Array.from({ length: 8 }, (_, i) => ({
    hop: i + 1,
    host: i === 7 ? target : `router-${i + 1}.net`,
    loss: Math.random() * 5,
    sent: 10,
    last: 20 + Math.random() * 30,
    avg: 25 + Math.random() * 20,
    best: 15 + Math.random() * 10,
    worst: 40 + Math.random() * 20,
    stdev: 2 + Math.random() * 3,
  }));
};

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<HopData[]>([]);

  const handleTrace = async (target: string) => {
    setIsLoading(true);
    // Simulate network request
    setTimeout(() => {
      const data = mockTrace(target);
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
          <CardContent>
            <MtrForm onSubmit={handleTrace} isLoading={isLoading} />
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