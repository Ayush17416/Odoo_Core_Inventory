import { useAuth } from "@/contexts/AuthContext";
import type { AppRole } from "@/types/database.ts";
import { User, Mail, Building2, Shield } from "lucide-react";

const Profile = () => {
  const { user, profile, role } = useAuth();

  const roleLabel = role === "inventory_manager" ? "Inventory Manager" : "Warehouse Staff";

  return (
    <div className="p-6 max-w-lg space-y-6">
      <h1 className="page-header">My Profile</h1>
      
      <div className="kpi-card space-y-4">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-sm bg-primary/10 flex items-center justify-center">
            <User className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h2 className="font-medium text-foreground">{profile?.full_name || "User"}</h2>
            <p className="text-sm text-muted-foreground">{roleLabel}</p>
          </div>
        </div>

        <div className="space-y-3 pt-4 border-t border-border">
          <div className="flex items-center gap-3">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="label-text">Email</p>
              <p className="text-sm">{user?.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Shield className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="label-text">Role</p>
              <p className="text-sm font-mono">{role}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Building2 className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="label-text">Default Warehouse</p>
              <p className="text-sm">{profile?.default_warehouse || "Not set"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
