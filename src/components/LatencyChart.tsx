import { useMemo } from "react";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend, CartesianGrid } from "recharts";
import { HopData } from "@/lib/types";
import { CHART_CONFIG } from "@/lib/constants";

interface LatencyChartProps {
  hops: HopData[];
}

/**
 * Chart component displaying latency metrics across network hops
 * Shows average, best, and worst latency with proper accessibility features
 */
const LatencyChart = ({ hops }: LatencyChartProps) => {
  // Memoize chart data transformation for performance
  const chartData = useMemo(() => {
    return hops.map((hop) => ({
      hop: hop.hop,
      "Average": hop.avg,
      "Best": hop.best,
      "Worst": hop.worst,
    }));
  }, [hops]);

  if (!hops.length) return null;

  return (
    <div
      className="w-full"
      style={{ height: CHART_CONFIG.height }}
      role="img"
      aria-label="Latency chart showing network hop performance"
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={CHART_CONFIG.margin}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis
            dataKey="hop"
            label={{ value: 'Hop Number', position: 'insideBottom', offset: -10 }}
            aria-label="Hop number"
          />
          <YAxis
            label={{ value: 'Latency (ms)', angle: -90, position: 'insideLeft' }}
            aria-label="Latency in milliseconds"
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--background))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '6px'
            }}
          />
          <Legend
            verticalAlign="top"
            height={36}
            wrapperStyle={{ paddingBottom: '10px' }}
          />
          <Line
            type="monotone"
            dataKey="Average"
            stroke={CHART_CONFIG.colors.avg}
            strokeWidth={2}
            name="Average Latency"
            dot={{ r: 3 }}
          />
          <Line
            type="monotone"
            dataKey="Best"
            stroke={CHART_CONFIG.colors.best}
            strokeWidth={1}
            name="Best Latency"
            dot={{ r: 2 }}
          />
          <Line
            type="monotone"
            dataKey="Worst"
            stroke={CHART_CONFIG.colors.worst}
            strokeWidth={1}
            name="Worst Latency"
            dot={{ r: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LatencyChart;