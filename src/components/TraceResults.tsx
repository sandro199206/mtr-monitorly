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

const TraceResults = ({ hops }: TraceResultsProps) => {
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
          {hops.map((hop) => (
            <TableRow key={hop.hop}>
              <TableCell>{hop.hop}</TableCell>
              <TableCell>{hop.host}</TableCell>
              <TableCell>{hop.loss.toFixed(1)}%</TableCell>
              <TableCell>{hop.sent}</TableCell>
              <TableCell>{hop.last.toFixed(2)} ms</TableCell>
              <TableCell>{hop.avg.toFixed(2)} ms</TableCell>
              <TableCell>{hop.best.toFixed(2)} ms</TableCell>
              <TableCell>{hop.worst.toFixed(2)} ms</TableCell>
              <TableCell>{hop.stdev.toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TraceResults;