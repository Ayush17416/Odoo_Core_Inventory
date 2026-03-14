import { useState, useMemo } from "react";
import { Plus, Search, AlertTriangle } from "lucide-react";
import { store, type Product, type ProductCategory, type UnitOfMeasure } from "@/lib/inventory-data";
import { DataTable } from "@/components/DataTable";
import { ActionDrawer } from "@/components/ActionDrawer";
import { FilterBar } from "@/components/FilterBar";

const categories: ProductCategory[] = ["Raw Materials", "Finished Goods", "Packaging", "Consumables", "Equipment"];
const uoms: UnitOfMeasure[] = ["Units", "Kg", "Liters", "Meters", "Boxes"];

const Products = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("");
  const [, setRefresh] = useState(0);

  const [form, setForm] = useState({ name: "", sku: "", category: "Raw Materials" as ProductCategory, uom: "Units" as UnitOfMeasure, stock: "", reorderLevel: "", warehouse: "Main Warehouse", location: "" });

  const products = store.getProducts();
  const warehouses = store.getWarehouses();

  const filtered = useMemo(() => {
    return products.filter(p => {
      if (catFilter && p.category !== catFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q);
      }
      return true;
    });
  }, [products, catFilter, search]);

  const handleCreate = () => {
    if (!form.name || !form.sku) return;
    store.addProduct({
      id: store.generateId(),
      name: form.name,
      sku: form.sku,
      category: form.category,
      uom: form.uom,
      stock: Number(form.stock) || 0,
      reorderLevel: Number(form.reorderLevel) || 0,
      warehouse: form.warehouse,
      location: form.location,
    });
    setForm({ name: "", sku: "", category: "Raw Materials", uom: "Units", stock: "", reorderLevel: "", warehouse: "Main Warehouse", location: "" });
    setDrawerOpen(false);
    setRefresh(r => r + 1);
  };

  const columns = [
    { key: "sku", header: "SKU", render: (p: Product) => <span className="data-text">{p.sku}</span>, className: "w-40" },
    { key: "name", header: "Product", render: (p: Product) => <span className="font-medium text-sm">{p.name}</span> },
    { key: "category", header: "Category", render: (p: Product) => <span className="text-sm text-muted-foreground">{p.category}</span> },
    { key: "stock", header: "Stock", render: (p: Product) => (
      <div className="flex items-center gap-2">
        <span className={`data-text ${p.stock === 0 ? 'text-destructive' : p.stock <= p.reorderLevel ? 'text-warning' : ''}`}>
          {p.stock} {p.uom}
        </span>
        {p.stock <= p.reorderLevel && p.stock > 0 && <AlertTriangle className="h-3.5 w-3.5 text-warning" />}
        {p.stock === 0 && <span className="status-pill bg-destructive/10 text-destructive border border-destructive/30">OUT</span>}
      </div>
    )},
    { key: "reorder", header: "Reorder At", render: (p: Product) => <span className="data-text text-muted-foreground">{p.reorderLevel}</span> },
    { key: "warehouse", header: "Location", render: (p: Product) => <span className="text-sm text-muted-foreground">{p.warehouse} / {p.location}</span> },
  ];

  const inputClass = "w-full px-3 py-2 text-sm border border-border rounded-sm bg-background focus:outline-none focus:ring-1 focus:ring-primary";
  const labelClass = "label-text mb-1 block";

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between gap-4">
        <h1 className="page-header">All Products</h1>
        <button onClick={() => setDrawerOpen(true)} className="action-btn flex items-center gap-2">
          <Plus className="h-4 w-4" /> New Product
        </button>
      </div>

      <div className="flex items-center gap-4 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name or SKU..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-2 text-sm bg-card border border-border rounded-sm focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground"
          />
        </div>
        <FilterBar filters={[{
          label: "Category",
          options: categories.map(c => ({ label: c, value: c })),
          value: catFilter,
          onChange: setCatFilter,
        }]} />
      </div>

      <DataTable data={filtered} columns={columns} />

      <ActionDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} title="Create Product">
        <div className="space-y-4">
          <div><label className={labelClass}>Product Name</label><input className={inputClass} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Steel Rods" /></div>
          <div><label className={labelClass}>SKU / Code</label><input className={inputClass + " font-mono"} value={form.sku} onChange={e => setForm({ ...form, sku: e.target.value })} placeholder="STL-ROD-001" /></div>
          <div><label className={labelClass}>Category</label><select className={inputClass} value={form.category} onChange={e => setForm({ ...form, category: e.target.value as ProductCategory })}>{categories.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
          <div><label className={labelClass}>Unit of Measure</label><select className={inputClass} value={form.uom} onChange={e => setForm({ ...form, uom: e.target.value as UnitOfMeasure })}>{uoms.map(u => <option key={u} value={u}>{u}</option>)}</select></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className={labelClass}>Initial Stock</label><input className={inputClass + " font-mono"} type="number" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} placeholder="0" /></div>
            <div><label className={labelClass}>Reorder Level</label><input className={inputClass + " font-mono"} type="number" value={form.reorderLevel} onChange={e => setForm({ ...form, reorderLevel: e.target.value })} placeholder="50" /></div>
          </div>
          <div><label className={labelClass}>Warehouse</label><select className={inputClass} value={form.warehouse} onChange={e => setForm({ ...form, warehouse: e.target.value })}>{warehouses.map(w => <option key={w.id} value={w.name}>{w.name}</option>)}</select></div>
          <div><label className={labelClass}>Location</label><input className={inputClass} value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="Rack A" /></div>
          <button onClick={handleCreate} className="action-btn w-full mt-4">Create Product</button>
        </div>
      </ActionDrawer>
    </div>
  );
};

export default Products;
