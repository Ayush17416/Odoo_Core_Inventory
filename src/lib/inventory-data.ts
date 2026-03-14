// In-memory inventory data store for hackathon demo

export type ProductCategory = "Raw Materials" | "Finished Goods" | "Packaging" | "Consumables" | "Equipment";
export type UnitOfMeasure = "Units" | "Kg" | "Liters" | "Meters" | "Boxes";
export type OperationStatus = "Draft" | "Waiting" | "Ready" | "Done" | "Canceled";
export type OperationType = "Receipt" | "Delivery" | "Transfer" | "Adjustment";

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: ProductCategory;
  uom: UnitOfMeasure;
  stock: number;
  reorderLevel: number;
  warehouse: string;
  location: string;
}

export interface Operation {
  id: string;
  type: OperationType;
  reference: string;
  status: OperationStatus;
  date: string;
  partner: string;
  products: { productId: string; productName: string; quantity: number }[];
  sourceWarehouse?: string;
  destWarehouse?: string;
  notes?: string;
}

export interface MoveEntry {
  id: string;
  date: string;
  product: string;
  sku: string;
  type: OperationType;
  reference: string;
  from: string;
  to: string;
  quantity: number;
}

export interface Warehouse {
  id: string;
  name: string;
  code: string;
  address: string;
  locations: string[];
}

const warehouses: Warehouse[] = [
  { id: "wh1", name: "Main Warehouse", code: "WH-MAIN", address: "123 Industrial Ave", locations: ["Rack A", "Rack B", "Rack C", "Floor 1"] },
  { id: "wh2", name: "Secondary Depot", code: "WH-SEC", address: "456 Commerce Blvd", locations: ["Zone 1", "Zone 2", "Cold Storage"] },
  { id: "wh3", name: "Production Floor", code: "WH-PROD", address: "789 Factory Rd", locations: ["Line 1", "Line 2", "Assembly"] },
];

const products: Product[] = [
  { id: "p1", name: "Steel Rods", sku: "STL-ROD-001", category: "Raw Materials", uom: "Units", stock: 340, reorderLevel: 100, warehouse: "Main Warehouse", location: "Rack A" },
  { id: "p2", name: "Aluminum Sheets", sku: "ALM-SHT-002", category: "Raw Materials", uom: "Units", stock: 45, reorderLevel: 50, warehouse: "Main Warehouse", location: "Rack B" },
  { id: "p3", name: "Office Chairs", sku: "FRN-CHR-010", category: "Finished Goods", uom: "Units", stock: 128, reorderLevel: 20, warehouse: "Secondary Depot", location: "Zone 1" },
  { id: "p4", name: "Packing Tape", sku: "PKG-TPE-005", category: "Packaging", uom: "Boxes", stock: 12, reorderLevel: 30, warehouse: "Main Warehouse", location: "Rack C" },
  { id: "p5", name: "Lubricant Oil", sku: "CON-OIL-003", category: "Consumables", uom: "Liters", stock: 200, reorderLevel: 50, warehouse: "Production Floor", location: "Line 1" },
  { id: "p6", name: "Copper Wire", sku: "RAW-COP-007", category: "Raw Materials", uom: "Meters", stock: 0, reorderLevel: 100, warehouse: "Main Warehouse", location: "Rack A" },
  { id: "p7", name: "Cardboard Boxes", sku: "PKG-BOX-012", category: "Packaging", uom: "Units", stock: 580, reorderLevel: 100, warehouse: "Secondary Depot", location: "Zone 2" },
  { id: "p8", name: "Standing Desk", sku: "FRN-DSK-020", category: "Finished Goods", uom: "Units", stock: 8, reorderLevel: 15, warehouse: "Secondary Depot", location: "Zone 1" },
  { id: "p9", name: "Safety Gloves", sku: "CON-GLV-009", category: "Consumables", uom: "Boxes", stock: 75, reorderLevel: 25, warehouse: "Production Floor", location: "Line 2" },
  { id: "p10", name: "Forklift Battery", sku: "EQP-BAT-015", category: "Equipment", uom: "Units", stock: 3, reorderLevel: 5, warehouse: "Main Warehouse", location: "Floor 1" },
];

const operations: Operation[] = [
  { id: "op1", type: "Receipt", reference: "REC-2026-001", status: "Done", date: "2026-03-12", partner: "Steel Corp", products: [{ productId: "p1", productName: "Steel Rods", quantity: 100 }], destWarehouse: "Main Warehouse" },
  { id: "op2", type: "Receipt", reference: "REC-2026-002", status: "Waiting", date: "2026-03-14", partner: "MetalWorks Inc", products: [{ productId: "p2", productName: "Aluminum Sheets", quantity: 200 }], destWarehouse: "Main Warehouse" },
  { id: "op3", type: "Delivery", reference: "DEL-2026-001", status: "Ready", date: "2026-03-14", partner: "Office Plus", products: [{ productId: "p3", productName: "Office Chairs", quantity: 10 }], sourceWarehouse: "Secondary Depot" },
  { id: "op4", type: "Delivery", reference: "DEL-2026-002", status: "Draft", date: "2026-03-15", partner: "BuildRight Co", products: [{ productId: "p1", productName: "Steel Rods", quantity: 50 }], sourceWarehouse: "Main Warehouse" },
  { id: "op5", type: "Transfer", reference: "TRF-2026-001", status: "Done", date: "2026-03-11", partner: "Internal", products: [{ productId: "p5", productName: "Lubricant Oil", quantity: 30 }], sourceWarehouse: "Main Warehouse", destWarehouse: "Production Floor" },
  { id: "op6", type: "Adjustment", reference: "ADJ-2026-001", status: "Done", date: "2026-03-10", partner: "System", products: [{ productId: "p4", productName: "Packing Tape", quantity: -8 }], notes: "Physical count mismatch" },
  { id: "op7", type: "Receipt", reference: "REC-2026-003", status: "Draft", date: "2026-03-15", partner: "CableTech", products: [{ productId: "p6", productName: "Copper Wire", quantity: 500 }], destWarehouse: "Main Warehouse" },
  { id: "op8", type: "Transfer", reference: "TRF-2026-002", status: "Waiting", date: "2026-03-14", partner: "Internal", products: [{ productId: "p9", productName: "Safety Gloves", quantity: 20 }], sourceWarehouse: "Production Floor", destWarehouse: "Main Warehouse" },
];

const moveHistory: MoveEntry[] = [
  { id: "m1", date: "2026-03-12 09:15", product: "Steel Rods", sku: "STL-ROD-001", type: "Receipt", reference: "REC-2026-001", from: "Supplier: Steel Corp", to: "WH-MAIN / Rack A", quantity: 100 },
  { id: "m2", date: "2026-03-11 14:30", product: "Lubricant Oil", sku: "CON-OIL-003", type: "Transfer", reference: "TRF-2026-001", from: "WH-MAIN", to: "WH-PROD / Line 1", quantity: 30 },
  { id: "m3", date: "2026-03-10 11:00", product: "Packing Tape", sku: "PKG-TPE-005", type: "Adjustment", reference: "ADJ-2026-001", from: "WH-MAIN / Rack C", to: "Adjusted", quantity: -8 },
  { id: "m4", date: "2026-03-09 16:45", product: "Office Chairs", sku: "FRN-CHR-010", type: "Delivery", reference: "DEL-2025-098", from: "WH-SEC / Zone 1", to: "Customer: TechHub", quantity: 25 },
  { id: "m5", date: "2026-03-08 08:20", product: "Cardboard Boxes", sku: "PKG-BOX-012", type: "Receipt", reference: "REC-2025-099", from: "Supplier: PackPro", to: "WH-SEC / Zone 2", quantity: 300 },
];

// Simple store with getters/setters
let _products = [...products];
let _operations = [...operations];
let _moveHistory = [...moveHistory];
let _warehouses = [...warehouses];

export const store = {
  getProducts: () => _products,
  getOperations: () => _operations,
  getMoveHistory: () => _moveHistory,
  getWarehouses: () => _warehouses,

  addProduct: (p: Product) => { _products = [..._products, p]; },
  updateProduct: (id: string, updates: Partial<Product>) => {
    _products = _products.map(p => p.id === id ? { ...p, ...updates } : p);
  },

  addOperation: (op: Operation) => {
    _operations = [..._operations, op];
    // Add move history entries
    op.products.forEach(item => {
      const product = _products.find(p => p.id === item.productId);
      _moveHistory = [{
        id: `m${Date.now()}${Math.random()}`,
        date: new Date().toISOString().slice(0, 16).replace('T', ' '),
        product: item.productName,
        sku: product?.sku || '',
        type: op.type,
        reference: op.reference,
        from: op.sourceWarehouse || `Supplier: ${op.partner}`,
        to: op.destWarehouse || `Customer: ${op.partner}`,
        quantity: item.quantity,
      }, ..._moveHistory];
    });
  },

  updateOperationStatus: (id: string, status: OperationStatus) => {
    const op = _operations.find(o => o.id === id);
    if (!op) return;
    _operations = _operations.map(o => o.id === id ? { ...o, status } : o);
    
    // If validated (Done), adjust stock
    if (status === "Done") {
      op.products.forEach(item => {
        const delta = op.type === "Receipt" ? item.quantity
          : op.type === "Delivery" ? -item.quantity
          : op.type === "Adjustment" ? item.quantity
          : 0;
        _products = _products.map(p => p.id === item.productId ? { ...p, stock: Math.max(0, p.stock + delta) } : p);
      });
    }
  },

  addWarehouse: (w: Warehouse) => { _warehouses = [..._warehouses, w]; },

  // KPIs
  getKPIs: () => {
    const totalStock = _products.reduce((sum, p) => sum + p.stock, 0);
    const lowStock = _products.filter(p => p.stock > 0 && p.stock <= p.reorderLevel).length;
    const outOfStock = _products.filter(p => p.stock === 0).length;
    const pendingReceipts = _operations.filter(o => o.type === "Receipt" && !["Done", "Canceled"].includes(o.status)).length;
    const pendingDeliveries = _operations.filter(o => o.type === "Delivery" && !["Done", "Canceled"].includes(o.status)).length;
    const scheduledTransfers = _operations.filter(o => o.type === "Transfer" && !["Done", "Canceled"].includes(o.status)).length;
    return { totalStock, lowStock, outOfStock, pendingReceipts, pendingDeliveries, scheduledTransfers };
  },

  generateId: () => `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  generateRef: (type: OperationType) => {
    const prefix = type === "Receipt" ? "REC" : type === "Delivery" ? "DEL" : type === "Transfer" ? "TRF" : "ADJ";
    return `${prefix}-2026-${String(_operations.filter(o => o.type === type).length + 1).padStart(3, '0')}`;
  },
};
