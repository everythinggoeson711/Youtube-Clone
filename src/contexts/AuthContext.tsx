import { getGoogleAuthUrl } from "@/services/auth.service";
import { createContext, useContext, useState, useEffect } from "react";

interface AuthContextType {
  accessToken: string | null;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(
    sessionStorage.getItem("youtube_access_token"),
  );

  const login = () => {
    const authUrl = getGoogleAuthUrl();
    window.location.href = authUrl;
  };

  const logout = () => {
    sessionStorage.removeItem("youtube_access_token");
    setAccessToken(null);
  };

  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const token = hashParams.get("access_token");

    if (token) {
      sessionStorage.setItem("youtube_access_token", token);
      setAccessToken(token);
      window.history.replaceState(null, "", window.location.pathname);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ accessToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
