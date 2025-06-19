import { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(""); // ✅ token state

  const [loading, setLoading] = useState(true);

useEffect(() => {
  const storedUser = localStorage.getItem("user") || sessionStorage.getItem("user");
  if (storedUser) {
    setUser(JSON.parse(storedUser));
  }
  setLoading(false);
}, []);


  const login = (userData) => {
    setUser(userData);
    setToken(userData.token || ""); // ✅ login'de token güncelle
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setToken(""); // ✅ logout'ta sıfırla
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
