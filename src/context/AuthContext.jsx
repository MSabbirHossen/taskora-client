import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import Swal from "sweetalert2";
import apiClient from "../api/axios";
import { auth, googleProvider } from "../firebase";

const AuthContext = createContext(null);

const storageKey = "taskora-session";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(
    localStorage.getItem("taskora-token") || "",
  );
  const [loading, setLoading] = useState(true);

  const persistSession = (sessionToken, sessionUser) => {
    setToken(sessionToken);
    setUser(sessionUser);
    localStorage.setItem("taskora-token", sessionToken);
    localStorage.setItem(storageKey, JSON.stringify(sessionUser));
  };

  const clearSession = async () => {
    localStorage.removeItem("taskora-token");
    localStorage.removeItem(storageKey);
    setToken("");
    setUser(null);
    await signOut(auth);
  };

  const syncWithServer = async (firebaseUser, role, name, image) => {
    const idToken = await firebaseUser.getIdToken();
    const { data } = await apiClient.post(
      "/auth/firebase",
      {
        name: name || firebaseUser.displayName || "Taskora User",
        email: firebaseUser.email,
        image:
          image ||
          firebaseUser.photoURL ||
          "https://i.ibb.co/7Qw6w5m/default-avatar.png",
        role,
      },
      { headers: { Authorization: `Bearer ${idToken}` } },
    );

    persistSession(data.token, data.user);
    apiClient.defaults.headers.common.Authorization = `Bearer ${data.token}`;
    return data;
  };

  const registerWithEmail = async ({ name, email, password, image, role }) => {
    const credential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
    await updateProfile(credential.user, {
      displayName: name,
      photoURL: image,
    });
    const result = await syncWithServer(credential.user, role, name, image);
    Swal.fire({
      icon: "success",
      title: "Account created",
      text: "Your Taskora account is ready.",
    });
    return result;
  };

  const loginWithEmail = async ({ email, password, role = "Worker" }) => {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    const result = await syncWithServer(
      credential.user,
      role,
      credential.user.displayName,
      credential.user.photoURL,
    );
    Swal.fire({
      icon: "success",
      title: "Welcome back",
      text: "You are now signed in.",
    });
    return result;
  };

  const loginWithGoogle = async (role = "Worker") => {
    const credential = await signInWithPopup(auth, googleProvider);
    const result = await syncWithServer(
      credential.user,
      role,
      credential.user.displayName,
      credential.user.photoURL,
    );
    Swal.fire({
      icon: "success",
      title: "Google sign-in complete",
      text: "Your profile has been synchronized.",
    });
    return result;
  };

  const updateLocalProfile = async ({ name, image }) => {
    const { data } = await apiClient.patch("/auth/profile", { name, image });
    setUser(data.user);
    localStorage.setItem(storageKey, JSON.stringify(data.user));
    return data.user;
  };

  const refreshSession = async () => {
    const storedToken = localStorage.getItem("taskora-token");
    const storedUser = localStorage.getItem(storageKey);
    if (!storedToken) {
      setLoading(false);
      return;
    }

    apiClient.defaults.headers.common.Authorization = `Bearer ${storedToken}`;
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    try {
      const { data } = await apiClient.get("/auth/me");
      setUser(data.user);
      localStorage.setItem(storageKey, JSON.stringify(data.user));
    } catch {
      await clearSession();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshSession();
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      isAuthenticated: Boolean(user && token),
      registerWithEmail,
      loginWithEmail,
      loginWithGoogle,
      clearSession,
      updateLocalProfile,
      refreshSession,
    }),
    [user, token, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
