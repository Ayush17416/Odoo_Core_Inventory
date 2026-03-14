import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Outlet, useLocation } from "react-router-dom";

const breadcrumbMap: Record<string, string> = {
  "/": "Dashboard",
  "/products": "Products / All Products",
  "/products/categories": "Products / Categories",
  "/operations/receipts": "Operations / Receipts",
  "/operations/deliveries": "Operations / Deliveries",
  "/operations/transfers": "Operations / Transfers",
  "/operations/adjustments": "Operations / Adjustments",
  "/operations/history": "Operations / Move History",
  "/settings/warehouses": "Settings / Warehouses",
  "/profile": "Profile / My Profile",
};

export function AppLayout() {
  const location = useLocation();
  const breadcrumb = breadcrumbMap[location.pathname] || "Inventory";

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-12 flex items-center border-b border-border bg-card px-4 gap-3 shrink-0">
            <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
            <span className="text-sm text-muted-foreground font-medium tracking-tight">{breadcrumb}</span>
          </header>
          <main className="flex-1 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
