import { cn } from "@/lib/utils";
import type { OperationStatus } from "@/lib/inventory-data";

const statusStyles: Record<OperationStatus, string> = {
  Draft: "bg-muted text-muted-foreground border-border",
  Waiting: "bg-warning/10 text-warning border-warning/30",
  Ready: "bg-primary/10 text-primary border-primary/30",
  Done: "bg-success/10 text-success border-success/30",
  Canceled: "bg-destructive/10 text-destructive border-destructive/30",
};

export function StatusPill({ status }: { status: OperationStatus }) {
  return (
    <span className={cn("status-pill border", statusStyles[status])}>
      {status}
    </span>
  );
}
