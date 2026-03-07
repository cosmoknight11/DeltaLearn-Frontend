import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { auth as authApi } from "../api/endpoints";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    const token = localStorage.getItem("dl_access");
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const { data } = await authApi.profile();
      setUser(data);
    } catch {
      localStorage.removeItem("dl_access");
      localStorage.removeItem("dl_refresh");
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const requestOTP = async (email) => {
    await authApi.requestOTP(email);
  };

  const verifyOTP = async (email, code) => {
    const { data } = await authApi.verifyOTP(email, code);
    localStorage.setItem("dl_access", data.access);
    localStorage.setItem("dl_refresh", data.refresh);
    localStorage.setItem("dl_email", email);
    await fetchProfile();
    return data;
  };

  const logout = () => {
    localStorage.removeItem("dl_access");
    localStorage.removeItem("dl_refresh");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, requestOTP, verifyOTP, logout, fetchProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
