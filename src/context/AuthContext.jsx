import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { auth } from "../firebase/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

export const AuthContext = createContext();

const API_URL = import.meta.env.VITE_API_URL;

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const googleProvider = new GoogleAuthProvider();

  // Login
  const loginUser = async (email, password) => {
    const res = await axios.post(`${API_URL}/auth/login`, { email, password });
    setUser(res.data);
    setToken(res.data.token);
    localStorage.setItem("authToken", res.data.token);
    return res.data;
  };

  // Register
  const registerUser = async (data) => {
    const res = await axios.post(`${API_URL}/auth/register`, data);
    setUser(res.data);
    setToken(res.data.token);
    localStorage.setItem("authToken", res.data.token);
    return res.data;
  };

  // Google Login
  const googleLogin = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    const { email, displayName, photoURL } = result.user;

    const res = await axios.post(`${API_URL}/auth/google-login`, {
      email,
      name: displayName,
      photoURL,
    });

    setUser(res.data);
    setToken(res.data.token);
    localStorage.setItem("authToken", res.data.token);
    return res.data;
  };

  // Load logged-in user
  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    if (!storedToken) {
      setLoading(false);
      return;
    }

    axios
      .get(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${storedToken}` },
      })
      .then((res) => {
        setUser(res.data);
        setToken(storedToken);
      })
      .catch(() => localStorage.removeItem("authToken"))
      .finally(() => setLoading(false));
  }, []);

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("authToken");
  };

  const value = {
    user,
    setUser, // ✅ VERY IMPORTANT FIX
    token,
    loading,
    loginUser,
    registerUser,
    googleLogin,
    logout,
    isAdmin: user?.role === "admin",
    isCreator: user?.role === "creator",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
