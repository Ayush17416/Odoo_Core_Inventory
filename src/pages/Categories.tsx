import { store, type ProductCategory } from "@/lib/inventory-data";
import { useMemo } from "react";

const Categories = () => {
  const products = store.getProducts();
  
  const categoryData = useMemo(() => {
    const map = new Map<string, { count: number; totalStock: number; lowStock: number }>();
    products.forEach(p => {
      const existing = map.get(p.category) || { count: 0, totalStock: 0, lowStock: 0 };
      existing.count++;
      existing.totalStock += p.stock;
      if (p.stock <= p.reorderLevel) existing.lowStock++;
      map.set(p.category, existing);
    });
    return Array.from(map.entries()).map(([name, data]) => ({ id: name, name, ...data }));
  }, [products]);

  return (
    <div className="p-6 space-y-4">
      <h1 className="page-header">Product Categories</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categoryData.map(cat => (
          <div key={cat.name} className="kpi-card">
            <h3 className="font-medium text-sm mb-3">{cat.name}</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="label-text">Products</span>
                <span className="data-text">{cat.count}</span>
              </div>
              <div className="flex justify-between">
                <span className="label-text">Total Stock</span>
                <span className="data-text">{cat.totalStock.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="label-text">Low Stock Items</span>
                <span className={`data-text ${cat.lowStock > 0 ? 'text-warning' : ''}`}>{cat.lowStock}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;
