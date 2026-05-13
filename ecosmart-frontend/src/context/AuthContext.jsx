import { createContext, useContext, useState } from 'react';
import { apiPost } from '../api/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('ecosmart_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // Returns the stored user object; throws on bad credentials.
  const login = async (email, password) => {
    const data = await apiPost('/auth/login', { email, password });
    const userData = {
      id:     data.userId,
      name:   data.name,
      email:  data.email,
      role:   data.role   || 'HOME_OWNER',
      avatar: data.avatar || (data.name ? data.name.slice(0, 2).toUpperCase() : '??'),
      token:  data.token,
    };
    localStorage.setItem('ecosmart_user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem('ecosmart_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
