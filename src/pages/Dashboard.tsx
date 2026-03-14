import { useState, useMemo } from "react";
import { Package, AlertTriangle, ArrowDownToLine, Truck, ArrowLeftRight, XCircle } from "lucide-react";
import { store } from "@/lib/inventory-data";
import { KpiCard } from "@/components/KpiCard";
import { DataTable } from "@/components/DataTable";
import { StatusPill } from "@/components/StatusPill";
import { FilterBar } from "@/components/FilterBar";
import type { Operation, OperationType, OperationStatus } from "@/lib/inventory-data";

const Dashboard = () => {
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [warehouseFilter, setWarehouseFilter] = useState("");

  const kpis = store.getKPIs();
  const operations = store.getOperations();
  const warehouses = store.getWarehouses();

  const filteredOps = useMemo(() => {
    return operations.filter(op => {
      if (typeFilter && op.type !== typeFilter) return false;
      if (statusFilter && op.status !== statusFilter) return false;
      if (warehouseFilter) {
        const wh = warehouseFilter;
        if (op.sourceWarehouse !== wh && op.destWarehouse !== wh) return false;
      }
      return true;
    });
  }, [operations, typeFilter, statusFilter, warehouseFilter]);

  const columns = [
    { key: "ref", header: "Reference", render: (op: Operation) => <span className="data-text">{op.reference}</span> },
    { key: "type", header: "Type", render: (op: Operation) => <span className="text-sm">{op.type}</span> },
    { key: "status", header: "Status", render: (op: Operation) => <StatusPill status={op.status} /> },
    { key: "date", header: "Date", render: (op: Operation) => <span className="data-text">{op.date}</span> },
    { key: "partner", header: "Partner", render: (op: Operation) => <span className="text-sm">{op.partner}</span> },
    { key: "items", header: "Items", render: (op: Operation) => (
      <span className="data-text">{op.products.reduce((s, p) => s + Math.abs(p.quantity), 0)} units</span>
    )},
  ];

  return (
    <div className="p-6 space-y-6">
      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <KpiCard label="Total Stock" value={kpis.totalStock.toLocaleString()} icon={Package} trend="+12% from yesterday" />
        <KpiCard label="Low Stock" value={kpis.lowStock} icon={AlertTriangle} alert={kpis.lowStock > 0} />
        <KpiCard label="Out of Stock" value={kpis.outOfStock} icon={XCircle} alert={kpis.outOfStock > 0} />
        <KpiCard label="Pending Receipts" value={kpis.pendingReceipts} icon={ArrowDownToLine} />
        <KpiCard label="Pending Deliveries" value={kpis.pendingDeliveries} icon={Truck} />
        <KpiCard label="Scheduled Transfers" value={kpis.scheduledTransfers} icon={ArrowLeftRight} />
      </div>

      {/* Filters */}
      <FilterBar filters={[
        {
          label: "Type",
          options: [
            { label: "Receipts", value: "Receipt" },
            { label: "Delivery", value: "Delivery" },
            { label: "Transfer", value: "Transfer" },
            { label: "Adjustment", value: "Adjustment" },
          ],
          value: typeFilter,
          onChange: setTypeFilter,
        },
        {
          label: "Status",
          options: [
            { label: "Draft", value: "Draft" },
            { label: "Waiting", value: "Waiting" },
            { label: "Ready", value: "Ready" },
            { label: "Done", value: "Done" },
            { label: "Canceled", value: "Canceled" },
          ],
          value: statusFilter,
          onChange: setStatusFilter,
        },
        {
          label: "Warehouse",
          options: warehouses.map(w => ({ label: w.name, value: w.name })),
          value: warehouseFilter,
          onChange: setWarehouseFilter,
        },
      ]} />

      {/* Recent Operations */}
      <div>
        <h2 className="page-header mb-3">Recent Operations</h2>
        <DataTable data={filteredOps} columns={columns} />
      </div>
    </div>
  );
};

export default Dashboard;
