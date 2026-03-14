import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signup } from "@/lib/api";
import { Package, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

const Signup = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !fullName) return;
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      const response = await signup(email, password, fullName);
      localStorage.setItem('token', response.token);
      localStorage.setItem('tokenUser', JSON.stringify(response.user));
      toast.success("Signup successful!");
      navigate("/");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full px-3 py-2.5 text-sm border border-border rounded-sm bg-background focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground";

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2 justify-center mb-8">
          <Package className="h-6 w-6 text-primary" />
          <span className="text-xl font-semibold tracking-tight text-foreground">Core Inventory</span>
        </div>

        <div className="kpi-card">
          <h1 className="page-header mb-1">Create account</h1>
          <p className="text-sm text-muted-foreground mb-6">Join your team's inventory system</p>

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="label-text mb-1 block">Full Name</label>
              <input type="text" className={inputClass} value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Alex Morgan" required />
            </div>
            <div>
              <label className="label-text mb-1 block">Email</label>
              <input type="email" className={inputClass} value={email} onChange={e => setEmail(e.target.value)} placeholder="you@company.com" required />
            </div>
            <div>
              <label className="label-text mb-1 block">Password</label>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} className={inputClass + " pr-10"} value={password} onChange={e => setPassword(e.target.value)} placeholder="Min. 6 characters" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="action-btn w-full flex items-center justify-center gap-2 disabled:opacity-50">
              {loading ? <div className="h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" /> : "Create Account"}
            </button>
          </form>

          <p className="text-sm text-muted-foreground text-center mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-medium hover:underline">Sign in</Link>
          </p>
        </div>

        <p className="text-[11px] text-muted-foreground text-center mt-4">
          New accounts are assigned the <span className="font-mono">warehouse_staff</span> role by default.
        </p>
      </div>
    </div>
  );
};

export default Signup;
