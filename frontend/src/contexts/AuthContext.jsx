import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { fetchMe, logoutUser, updateUserName, refreshCsrfToken } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // undefined = loading, null = not logged in, object = logged in user
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    fetchMe()
      .then(async (data) => {
        await refreshCsrfToken();
        setUser(data);
      })
      .catch(() => setUser(null));
  }, []);

  const logout = useCallback(async () => {
    await logoutUser();
    setUser(null);
  }, []);

  const updateName = useCallback(async (name) => {
    const updated = await updateUserName(name);
    setUser(updated);
    return updated;
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, logout, updateName }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
