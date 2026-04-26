import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

// ── Mock user database ────────────────────────────────────────────────────────
const MOCK_USERS = [
  { id: 1, name: 'Admin User',   email: 'admin@cafirm.com',   password: 'Admin@123456', role: 'admin' },
  { id: 2, name: 'CA Rajan',     email: 'rajan@cafirm.com',   password: 'Admin@123456', role: 'admin' },
  { id: 3, name: 'Rajesh Kumar', email: 'rajesh@gmail.com',   password: 'Client@123',   role: 'client', pan: 'ABCPK1234D', plan: 'Standard', nextDeadline: 'GSTR-3B — Nov 20' },
  { id: 4, name: 'Sunita Patel', email: 'sunita@example.com', password: 'Client@123',   role: 'client', pan: 'PQRST5678E', plan: 'Professional', nextDeadline: 'ITR — Jul 31'   },
  { id: 5, name: 'Vikram Mehta', email: 'vikram@startup.in',  password: 'Client@123',   role: 'client', pan: 'VKMEH9012F', plan: 'Starter', nextDeadline: 'GSTR-1 — Nov 11'    },
];

// Rule: @cafirm.com domain → admin, everything else → client
function detectRole(email) {
  const domain = (email || '').split('@')[1]?.toLowerCase();
  return domain === 'cafirm.com' ? 'admin' : 'client';
}

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null);   // client session
  const [admin,   setAdmin]   = useState(null);   // admin session
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('ca_auth');
      if (stored) {
        const p = JSON.parse(stored);
        if (p.role === 'admin') setAdmin(p);
        else                    setUser(p);
      }
    } catch {}
    setLoading(false);
  }, []);

  // ── Login ── auto-detects role from email domain ──────────────────────────
  const login = async (email, password) => {
    await new Promise(r => setTimeout(r, 700)); // simulate network
    const found = MOCK_USERS.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (!found) throw new Error('Invalid email or password. Try admin@cafirm.com / Admin@123456');
    const { password: _, ...session } = found;
    localStorage.setItem('ca_auth', JSON.stringify(session));
    if (session.role === 'admin') { setAdmin(session); setUser(null);  }
    else                          { setUser(session);  setAdmin(null); }
    return session;
  };

  // ── Sign Up (creates client account) ─────────────────────────────────────
  const signup = async (name, email, password) => {
    await new Promise(r => setTimeout(r, 800));
    if (MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase()))
      throw new Error('An account with this email already exists');
    const role = detectRole(email);
    const session = { id: Date.now(), name, email, role, plan: 'Starter', nextDeadline: 'Setup in progress' };
    MOCK_USERS.push({ ...session, password });
    localStorage.setItem('ca_auth', JSON.stringify(session));
    if (role === 'admin') { setAdmin(session); setUser(null);  }
    else                  { setUser(session);  setAdmin(null); }
    return session;
  };

  // ── Logout ────────────────────────────────────────────────────────────────
  const logout = () => {
    localStorage.removeItem('ca_auth');
    setUser(null);
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{
      user, admin, loading,
      isAdmin:    !!admin,
      isClient:   !!user,
      isLoggedIn: !!(admin || user),
      currentUser: admin || user,
      login, signup, logout, detectRole,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
