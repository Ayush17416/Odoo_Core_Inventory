import { cn } from "@/lib/utils";

interface FilterOption {
  label: string;
  value: string;
}

interface FilterBarProps {
  filters: { label: string; options: FilterOption[]; value: string; onChange: (v: string) => void }[];
}

export function FilterBar({ filters }: FilterBarProps) {
  return (
    <div className="flex flex-wrap gap-3">
      {filters.map(filter => (
        <div key={filter.label} className="flex items-center gap-2">
          <span className="label-text">{filter.label}</span>
          <div className="flex gap-1">
            {filter.options.map(opt => (
              <button
                key={opt.value}
                onClick={() => filter.onChange(filter.value === opt.value ? "" : opt.value)}
                className={cn(
                  "px-2.5 py-1 text-[12px] rounded-sm border transition-colors duration-100",
                  filter.value === opt.value
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card text-muted-foreground border-border hover:bg-muted"
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
