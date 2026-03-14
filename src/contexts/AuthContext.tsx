import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { login, getProfile, logout } from "@/lib/api";

type AppRole = "inventory_manager" | "warehouse_staff";

interface AuthContextType {
  user: { userId: string; email: string; full_name: string; role: AppRole } | null;
  profile: { full_name: string; default_warehouse: string | null } | null;
  role: AppRole | null;
  loading: boolean;
  signOut: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null, profile: null, role: null, loading: true,
  signOut: async () => {},
  login: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthContextType["user"]>(null);
  const [profile, setProfile] = useState<AuthContextType["profile"]>(null);
  const [role, setRole] = useState<AppRole | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async () => {
    try {
      const data = await getProfile();
      setProfile(data.profile);
      setRole(data.role as AppRole);
      const tokenUserStr = localStorage.getItem('tokenUser');
      if (tokenUserStr) {
        const tokenUser = JSON.parse(tokenUserStr) as AuthContextType["user"];
        setUser(tokenUser);
      }
    } catch {
      setUser(null);
      setProfile(null);
      setRole(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (email: string, password: string) => {
    const response = await login(email, password);
    localStorage.setItem('token', response.token);
    localStorage.setItem('tokenUser', JSON.stringify(response.user));
    setUser(response.user);
    await fetchUserData();
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const signOut = async () => {
    await logout();
    setUser(null);
    setProfile(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ user, profile, role, loading, signOut, login: handleLogin }}>
      {children}
    </AuthContext.Provider>
  );
}

