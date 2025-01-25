import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface MtrFormProps {
  onSubmit: (target: string) => void;
  isLoading: boolean;
}

const MtrForm = ({ onSubmit, isLoading }: MtrFormProps) => {
  const [target, setTarget] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!target.trim()) {
      toast.error("Please enter a target host or IP");
      return;
    }
    onSubmit(target.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-4 w-full max-w-md">
      <Input
        type="text"
        value={target}
        onChange={(e) => setTarget(e.target.value)}
        placeholder="Enter host or IP (e.g., google.com)"
        className="flex-1"
        disabled={isLoading}
      />
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Tracing..." : "Start Trace"}
      </Button>
    </form>
  );
};

export default MtrForm;