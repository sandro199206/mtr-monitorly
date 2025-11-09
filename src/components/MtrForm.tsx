import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { validateTarget } from "@/lib/validation";

interface MtrFormProps {
  onSubmit: (target: string) => void;
  isLoading: boolean;
}

/**
 * Form component for initiating MTR trace requests
 * Validates input for valid hostnames and IP addresses
 */
const MtrForm = ({ onSubmit, isLoading }: MtrFormProps) => {
  const [target, setTarget] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validateTarget(target);
    if (!validation.valid) {
      toast.error(validation.error);
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
        placeholder="Enter host or IP (e.g., google.com or 8.8.8.8)"
        className="flex-1"
        disabled={isLoading}
        aria-label="Target host or IP address"
      />
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Tracing..." : "Start Trace"}
      </Button>
    </form>
  );
};

export default MtrForm;