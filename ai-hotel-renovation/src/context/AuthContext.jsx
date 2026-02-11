import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import api from "../services/api";

const AuthContext = createContext(null);

const TOKEN_KEY = "smartstay_token";
const USER_KEY = "smartstay_user";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || "");
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_KEY);
    }
  }, [user]);

  const register = useCallback(async (payload) => {
    setLoading(true);
    try {
      const response = await api.post("/auth/register", payload);
      setToken(response.data.token);
      setUser(response.data.user);
      return response.data;
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (payload) => {
    setLoading(true);
    try {
      const response = await api.post("/auth/login", payload);
      setToken(response.data.token);
      setUser(response.data.user);
      return response.data;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setToken("");
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    if (!token) return null;
    const response = await api.get("/auth/me");
    setUser(response.data.user);
    return response.data.user;
  }, [token]);

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token && user),
      loading,
      register,
      login,
      logout,
      refreshUser
    }),
    [token, user, loading, register, login, logout, refreshUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
}
