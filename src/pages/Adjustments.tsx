import { useState } from "react";
import { Plus } from "lucide-react";
import { store, type Operation, type OperationStatus } from "@/lib/inventory-data";
import { DataTable } from "@/components/DataTable";
import { StatusPill } from "@/components/StatusPill";
import { ActionDrawer } from "@/components/ActionDrawer";

const Adjustments = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [, setRefresh] = useState(0);

  const products = store.getProducts();
  const operations = store.getOperations().filter(o => o.type === "Adjustment");

  const [form, setForm] = useState({ productId: "", physicalCount: "", notes: "" });

  const handleCreate = () => {
    if (!form.productId || form.physicalCount === "") return;
    const product = products.find(p => p.id === form.productId);
    if (!product) return;
    const delta = Number(form.physicalCount) - product.stock;
    const op: Operation = {
      id: store.generateId(),
      type: "Adjustment",
      reference: store.generateRef("Adjustment"),
      status: "Done",
      date: new Date().toISOString().slice(0, 10),
      partner: "System",
      products: [{ productId: form.productId, productName: product.name, quantity: delta }],
      notes: form.notes || `Physical count: ${form.physicalCount}, System: ${product.stock}, Delta: ${delta > 0 ? '+' : ''}${delta}`,
    };
    store.addOperation(op);
    setForm({ productId: "", physicalCount: "", notes: "" });
    setDrawerOpen(false);
    setRefresh(r => r + 1);
  };

  const selectedProduct = products.find(p => p.id === form.productId);

  const columns = [
    { key: "ref", header: "Reference", render: (op: Operation) => <span className="data-text">{op.reference}</span> },
    { key: "status", header: "Status", render: (op: Operation) => <StatusPill status={op.status} /> },
    { key: "date", header: "Date", render: (op: Operation) => <span className="data-text">{op.date}</span> },
    { key: "product", header: "Product", render: (op: Operation) => <span className="text-sm">{op.products.map(p => p.productName).join(", ")}</span> },
    { key: "delta", header: "Delta", render: (op: Operation) => {
      const delta = op.products.reduce((s, p) => s + p.quantity, 0);
      return <span className={`data-text ${delta >= 0 ? 'text-success' : 'text-destructive'}`}>{delta > 0 ? '+' : ''}{delta}</span>;
    }},
    { key: "notes", header: "Reason", render: (op: Operation) => <span className="text-sm text-muted-foreground truncate max-w-[200px] block">{op.notes}</span> },
  ];

  const inputClass = "w-full px-3 py-2 text-sm border border-border rounded-sm bg-background focus:outline-none focus:ring-1 focus:ring-primary";

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="page-header">Stock Adjustments</h1>
        <button onClick={() => setDrawerOpen(true)} className="action-btn flex items-center gap-2">
          <Plus className="h-4 w-4" /> New Adjustment
        </button>
      </div>

      <DataTable data={operations} columns={columns} />

      <ActionDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} title="Stock Adjustment">
        <div className="space-y-4">
          <div><label className="label-text mb-1 block">Product</label>
            <select className={inputClass} value={form.productId} onChange={e => setForm({ ...form, productId: e.target.value })}>
              <option value="">Select product</option>
              {products.map(p => <option key={p.id} value={p.id}>{p.name} ({p.sku}) — Current: {p.stock}</option>)}
            </select>
          </div>
          {selectedProduct && (
            <div className="kpi-card">
              <div className="flex justify-between mb-2">
                <span className="label-text">System Count</span>
                <span className="data-text">{selectedProduct.stock} {selectedProduct.uom}</span>
              </div>
              {form.physicalCount !== "" && (
                <>
                  <div className="flex justify-between mb-2">
                    <span className="label-text">Physical Count</span>
                    <span className="data-text">{form.physicalCount} {selectedProduct.uom}</span>
                  </div>
                  <div className="flex justify-between border-t border-border pt-2">
                    <span className="label-text">Delta</span>
                    <span className={`data-text font-bold ${Number(form.physicalCount) - selectedProduct.stock >= 0 ? 'text-success' : 'text-destructive'}`}>
                      {Number(form.physicalCount) - selectedProduct.stock > 0 ? '+' : ''}{Number(form.physicalCount) - selectedProduct.stock}
                    </span>
                  </div>
                </>
              )}
            </div>
          )}
          <div><label className="label-text mb-1 block">Physical Count</label><input className={inputClass + " font-mono"} type="number" value={form.physicalCount} onChange={e => setForm({ ...form, physicalCount: e.target.value })} placeholder="Enter counted quantity" /></div>
          <div><label className="label-text mb-1 block">Reason / Notes</label><textarea className={inputClass + " h-20 resize-none"} value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Physical count mismatch" /></div>
          <button onClick={handleCreate} className="action-btn w-full mt-4">Confirm Adjustment</button>
        </div>
      </ActionDrawer>
    </div>
  );
};

export default Adjustments;
