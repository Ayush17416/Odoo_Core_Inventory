import {
  LayoutDashboard, Package, ArrowDownToLine, Truck, ArrowLeftRight,
  ClipboardList, History, Settings, User, LogOut, Search, Box
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar,
} from "@/components/ui/sidebar";

const mainNav = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
];

const productNav = [
  { title: "All Products", url: "/products", icon: Package },
  { title: "Categories", url: "/products/categories", icon: Box },
];

const operationsNav = [
  { title: "Receipts", url: "/operations/receipts", icon: ArrowDownToLine },
  { title: "Deliveries", url: "/operations/deliveries", icon: Truck },
  { title: "Transfers", url: "/operations/transfers", icon: ArrowLeftRight },
  { title: "Adjustments", url: "/operations/adjustments", icon: ClipboardList },
  { title: "Move History", url: "/operations/history", icon: History },
];

const settingsNav = [
  { title: "Warehouses", url: "/settings/warehouses", icon: Settings },
];

const profileNav = [
  { title: "My Profile", url: "/profile", icon: User },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { profile, role, signOut } = useAuth();

  const renderGroup = (label: string, items: typeof mainNav) => (
    <SidebarGroup key={label}>
      <SidebarGroupLabel className="label-text">{label}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <NavLink
                  to={item.url}
                  end={item.url === "/"}
                  className="table-row-hover flex items-center gap-2 px-3 py-2 rounded-sm text-sm text-sidebar-foreground"
                  activeClassName="bg-primary/10 text-primary font-medium"
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  {!collapsed && <span>{item.title}</span>}
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );

  return (
    <Sidebar collapsible="icon" className="border-r border-border">
      <SidebarContent>
        {/* Brand */}
        <div className="px-4 py-4 border-b border-border">
          {!collapsed ? (
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              <span className="font-semibold tracking-tight text-foreground">Core Inventory</span>
            </div>
          ) : (
            <Package className="h-5 w-5 text-primary mx-auto" />
          )}
        </div>

        {/* User info */}
        {!collapsed && profile && (
          <div className="px-4 py-3 border-b border-border">
            <p className="text-sm font-medium text-foreground truncate">{profile.full_name || "User"}</p>
            <p className="text-[11px] text-muted-foreground font-mono">{role}</p>
          </div>
        )}

        {renderGroup("Overview", mainNav)}
        {renderGroup("Products", productNav)}
        {renderGroup("Operations", operationsNav)}
        {renderGroup("Settings", settingsNav)}
        {renderGroup("Profile", profileNav)}

        {/* Logout */}
        {!collapsed && (
          <div className="mt-auto px-3 py-4 border-t border-border">
            <button
              onClick={signOut}
              className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-full rounded-sm"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
