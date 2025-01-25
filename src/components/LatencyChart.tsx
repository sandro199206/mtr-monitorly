import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { HopData } from "@/lib/types";

interface LatencyChartProps {
  hops: HopData[];
}

const LatencyChart = ({ hops }: LatencyChartProps) => {
  if (!hops.length) return null;

  const data = hops.map((hop) => ({
    hop: hop.hop,
    avg: hop.avg,
    best: hop.best,
    worst: hop.worst,
  }));

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <XAxis dataKey="hop" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="avg" stroke="#2563eb" strokeWidth={2} />
          <Line type="monotone" dataKey="best" stroke="#16a34a" strokeWidth={1} />
          <Line type="monotone" dataKey="worst" stroke="#dc2626" strokeWidth={1} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LatencyChart;