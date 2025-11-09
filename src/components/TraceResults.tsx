import { useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { HopData } from "@/lib/types";

interface TraceResultsProps {
  hops: HopData[];
}

/**
 * Component displaying detailed MTR trace results in a table format
 * Shows all hop metrics including latency and packet loss statistics
 */
const TraceResults = ({ hops }: TraceResultsProps) => {
  // Memoize formatted rows for performance
  const formattedHops = useMemo(() => {
    return hops.map((hop) => ({
      ...hop,
      lossFormatted: `${hop.loss.toFixed(1)}%`,
      lastFormatted: `${hop.last.toFixed(2)} ms`,
      avgFormatted: `${hop.avg.toFixed(2)} ms`,
      bestFormatted: `${hop.best.toFixed(2)} ms`,
      worstFormatted: `${hop.worst.toFixed(2)} ms`,
      stdevFormatted: hop.stdev.toFixed(2),
    }));
  }, [hops]);

  if (!hops.length) return null;

  return (
    <div className="w-full overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Hop</TableHead>
            <TableHead>Host</TableHead>
            <TableHead>Loss %</TableHead>
            <TableHead>Sent</TableHead>
            <TableHead>Last</TableHead>
            <TableHead>Avg</TableHead>
            <TableHead>Best</TableHead>
            <TableHead>Worst</TableHead>
            <TableHead>StDev</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {formattedHops.map((hop) => (
            <TableRow key={hop.hop}>
              <TableCell className="font-medium">{hop.hop}</TableCell>
              <TableCell className="font-mono text-sm">{hop.host}</TableCell>
              <TableCell className={hop.loss > 1 ? "text-destructive font-semibold" : ""}>
                {hop.lossFormatted}
              </TableCell>
              <TableCell>{hop.sent}</TableCell>
              <TableCell>{hop.lastFormatted}</TableCell>
              <TableCell className="font-medium">{hop.avgFormatted}</TableCell>
              <TableCell className="text-green-600 dark:text-green-400">{hop.bestFormatted}</TableCell>
              <TableCell className="text-red-600 dark:text-red-400">{hop.worstFormatted}</TableCell>
              <TableCell>{hop.stdevFormatted}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TraceResults;