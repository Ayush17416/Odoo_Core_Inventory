import { useNavigate } from "react-router-dom";
import { Package } from "lucide-react";

const ResetPassword = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2 justify-center mb-8">
          <Package className="h-6 w-6 text-primary" />
          <span className="text-xl font-semibold tracking-tight text-foreground">Core Inventory</span>
        </div>

        <div className="kpi-card">
          <h1 className="page-header mb-1">Password reset not implemented</h1>
          <p className="text-sm text-muted-foreground mb-6">Contact admin or use default test account.</p>
          <button onClick={() => navigate('/login')} className="action-btn w-full text-center block">
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
