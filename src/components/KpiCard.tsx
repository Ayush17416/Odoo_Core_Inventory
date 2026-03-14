import { LucideIcon } from "lucide-react";

interface KpiCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  trend?: string;
  alert?: boolean;
}

export function KpiCard({ label, value, icon: Icon, trend, alert }: KpiCardProps) {
  return (
    <div className="kpi-card">
      <div className="flex items-center justify-between">
        <p className="label-text">{label}</p>
        <Icon className={`h-4 w-4 ${alert ? 'text-warning' : 'text-muted-foreground'}`} />
      </div>
      <h2 className={`kpi-value mt-2 ${alert ? 'text-warning' : ''}`}>{value}</h2>
      {trend && (
        <div className="mt-3 text-[12px] text-success font-medium">{trend}</div>
      )}
    </div>
  );
}
