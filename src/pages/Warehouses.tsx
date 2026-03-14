import { useState } from "react";
import { Plus } from "lucide-react";
import { store, type Warehouse } from "@/lib/inventory-data";
import { DataTable } from "@/components/DataTable";
import { ActionDrawer } from "@/components/ActionDrawer";

const Warehouses = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [, setRefresh] = useState(0);
  const warehouses = store.getWarehouses();

  const [form, setForm] = useState({ name: "", code: "", address: "", locations: "" });

  const handleCreate = () => {
    if (!form.name || !form.code) return;
    store.addWarehouse({
      id: store.generateId(),
      name: form.name,
      code: form.code,
      address: form.address,
      locations: form.locations.split(",").map(l => l.trim()).filter(Boolean),
    });
    setForm({ name: "", code: "", address: "", locations: "" });
    setDrawerOpen(false);
    setRefresh(r => r + 1);
  };

  const columns = [
    { key: "code", header: "Code", render: (w: Warehouse) => <span className="data-text">{w.code}</span> },
    { key: "name", header: "Name", render: (w: Warehouse) => <span className="font-medium text-sm">{w.name}</span> },
    { key: "address", header: "Address", render: (w: Warehouse) => <span className="text-sm text-muted-foreground">{w.address}</span> },
    { key: "locations", header: "Locations", render: (w: Warehouse) => (
      <div className="flex gap-1 flex-wrap">
        {w.locations.map(l => (
          <span key={l} className="px-2 py-0.5 text-[11px] bg-muted rounded-sm border border-border">{l}</span>
        ))}
      </div>
    )},
  ];

  const inputClass = "w-full px-3 py-2 text-sm border border-border rounded-sm bg-background focus:outline-none focus:ring-1 focus:ring-primary";

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="page-header">Warehouses</h1>
        <button onClick={() => setDrawerOpen(true)} className="action-btn flex items-center gap-2">
          <Plus className="h-4 w-4" /> New Warehouse
        </button>
      </div>

      <DataTable data={warehouses} columns={columns} />

      <ActionDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} title="New Warehouse">
        <div className="space-y-4">
          <div><label className="label-text mb-1 block">Name</label><input className={inputClass} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="East Warehouse" /></div>
          <div><label className="label-text mb-1 block">Code</label><input className={inputClass + " font-mono"} value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} placeholder="WH-EAST" /></div>
          <div><label className="label-text mb-1 block">Address</label><input className={inputClass} value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} placeholder="321 Logistics Lane" /></div>
          <div><label className="label-text mb-1 block">Locations (comma-separated)</label><input className={inputClass} value={form.locations} onChange={e => setForm({ ...form, locations: e.target.value })} placeholder="Zone A, Zone B, Cold Storage" /></div>
          <button onClick={handleCreate} className="action-btn w-full mt-4">Create Warehouse</button>
        </div>
      </ActionDrawer>
    </div>
  );
};

export default Warehouses;
