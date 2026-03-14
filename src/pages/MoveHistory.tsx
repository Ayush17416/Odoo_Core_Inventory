import { store, type MoveEntry, type OperationType } from "@/lib/inventory-data";
import { DataTable } from "@/components/DataTable";
import { FilterBar } from "@/components/FilterBar";
import { useState } from "react";

const MoveHistory = () => {
  const [typeFilter, setTypeFilter] = useState("");
  const moves = store.getMoveHistory();
  const filtered = typeFilter ? moves.filter(m => m.type === typeFilter) : moves;

  const columns = [
    { key: "date", header: "Date", render: (m: MoveEntry) => <span className="data-text">{m.date}</span> },
    { key: "ref", header: "Reference", render: (m: MoveEntry) => <span className="data-text">{m.reference}</span> },
    { key: "type", header: "Type", render: (m: MoveEntry) => <span className="text-sm">{m.type}</span> },
    { key: "product", header: "Product", render: (m: MoveEntry) => <span className="text-sm font-medium">{m.product}</span> },
    { key: "sku", header: "SKU", render: (m: MoveEntry) => <span className="data-text">{m.sku}</span> },
    { key: "from", header: "From", render: (m: MoveEntry) => <span className="text-sm text-muted-foreground">{m.from}</span> },
    { key: "to", header: "To", render: (m: MoveEntry) => <span className="text-sm text-muted-foreground">{m.to}</span> },
    { key: "qty", header: "Qty", render: (m: MoveEntry) => (
      <span className={`data-text ${m.quantity >= 0 ? 'text-success' : 'text-destructive'}`}>
        {m.quantity > 0 ? '+' : ''}{m.quantity}
      </span>
    )},
  ];

  return (
    <div className="p-6 space-y-4">
      <h1 className="page-header">Move History (Ledger)</h1>
      <FilterBar filters={[{
        label: "Type",
        options: (["Receipt", "Delivery", "Transfer", "Adjustment"] as OperationType[]).map(t => ({ label: t, value: t })),
        value: typeFilter,
        onChange: setTypeFilter,
      }]} />
      <DataTable data={filtered} columns={columns} />
    </div>
  );
};

export default MoveHistory;
