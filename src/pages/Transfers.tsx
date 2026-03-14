import { useState } from "react";
import { Plus } from "lucide-react";
import { store, type Operation, type OperationStatus } from "@/lib/inventory-data";
import { DataTable } from "@/components/DataTable";
import { StatusPill } from "@/components/StatusPill";
import { ActionDrawer } from "@/components/ActionDrawer";
import { FilterBar } from "@/components/FilterBar";

const Transfers = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");
  const [, setRefresh] = useState(0);

  const products = store.getProducts();
  const warehouses = store.getWarehouses();
  const operations = store.getOperations().filter(o => o.type === "Transfer");
  const filtered = statusFilter ? operations.filter(o => o.status === statusFilter) : operations;

  const [form, setForm] = useState({ productId: "", quantity: "", source: "Main Warehouse", dest: "Production Floor" });

  const handleCreate = () => {
    if (!form.productId || !form.quantity) return;
    const product = products.find(p => p.id === form.productId);
    if (!product) return;
    store.addOperation({
      id: store.generateId(),
      type: "Transfer",
      reference: store.generateRef("Transfer"),
      status: "Draft",
      date: new Date().toISOString().slice(0, 10),
      partner: "Internal",
      products: [{ productId: form.productId, productName: product.name, quantity: Number(form.quantity) }],
      sourceWarehouse: form.source,
      destWarehouse: form.dest,
    });
    setForm({ productId: "", quantity: "", source: "Main Warehouse", dest: "Production Floor" });
    setDrawerOpen(false);
    setRefresh(r => r + 1);
  };

  const handleValidate = (op: Operation) => {
    if (op.status !== "Done" && op.status !== "Canceled") {
      store.updateOperationStatus(op.id, op.status === "Ready" ? "Done" : op.status === "Waiting" ? "Ready" : "Waiting");
      setRefresh(r => r + 1);
    }
  };

  const columns = [
    { key: "ref", header: "Reference", render: (op: Operation) => <span className="data-text">{op.reference}</span> },
    { key: "status", header: "Status", render: (op: Operation) => <StatusPill status={op.status} /> },
    { key: "date", header: "Date", render: (op: Operation) => <span className="data-text">{op.date}</span> },
    { key: "from", header: "From", render: (op: Operation) => <span className="text-sm">{op.sourceWarehouse}</span> },
    { key: "to", header: "To", render: (op: Operation) => <span className="text-sm">{op.destWarehouse}</span> },
    { key: "items", header: "Items", render: (op: Operation) => <span className="data-text">{op.products.map(p => `${p.productName} ×${p.quantity}`).join(", ")}</span> },
    { key: "action", header: "", render: (op: Operation) => (
      op.status !== "Done" && op.status !== "Canceled" ? (
        <button onClick={(e) => { e.stopPropagation(); handleValidate(op); }} className="text-[12px] text-primary font-medium hover:underline">
          {op.status === "Ready" ? "Validate" : "Advance →"}
        </button>
      ) : null
    )},
  ];

  const inputClass = "w-full px-3 py-2 text-sm border border-border rounded-sm bg-background focus:outline-none focus:ring-1 focus:ring-primary";

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="page-header">Internal Transfers</h1>
        <button onClick={() => setDrawerOpen(true)} className="action-btn flex items-center gap-2">
          <Plus className="h-4 w-4" /> New Transfer
        </button>
      </div>

      <FilterBar filters={[{
        label: "Status",
        options: (["Draft", "Waiting", "Ready", "Done", "Canceled"] as OperationStatus[]).map(s => ({ label: s, value: s })),
        value: statusFilter,
        onChange: setStatusFilter,
      }]} />

      <DataTable data={filtered} columns={columns} />

      <ActionDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} title="New Internal Transfer">
        <div className="space-y-4">
          <div><label className="label-text mb-1 block">Product</label>
            <select className={inputClass} value={form.productId} onChange={e => setForm({ ...form, productId: e.target.value })}>
              <option value="">Select product</option>
              {products.map(p => <option key={p.id} value={p.id}>{p.name} ({p.sku})</option>)}
            </select>
          </div>
          <div><label className="label-text mb-1 block">Quantity</label><input className={inputClass + " font-mono"} type="number" value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })} placeholder="30" /></div>
          <div><label className="label-text mb-1 block">Source Warehouse</label>
            <select className={inputClass} value={form.source} onChange={e => setForm({ ...form, source: e.target.value })}>
              {warehouses.map(w => <option key={w.id} value={w.name}>{w.name}</option>)}
            </select>
          </div>
          <div><label className="label-text mb-1 block">Destination Warehouse</label>
            <select className={inputClass} value={form.dest} onChange={e => setForm({ ...form, dest: e.target.value })}>
              {warehouses.map(w => <option key={w.id} value={w.name}>{w.name}</option>)}
            </select>
          </div>
          <button onClick={handleCreate} className="action-btn w-full mt-4">Create Transfer</button>
        </div>
      </ActionDrawer>
    </div>
  );
};

export default Transfers;
