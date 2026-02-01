import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState({
    token: undefined,
    user: undefined,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLoggedIn = async () => {
      let token = localStorage.getItem('auth-token');
      if (token === null) {
        localStorage.setItem('auth-token', '');
        token = '';
      }
      
      try {
        const tokenRes = await axios.post('http://localhost:5000/api/users/tokenIsValid', null, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (tokenRes.data) {
          const userRes = await axios.get('http://localhost:5000/api/users/', {
            headers: { 'Authorization': `Bearer ${token}` },
          });
          setUserData({
            token,
            user: userRes.data,
          });
        }
      } catch (err) {
        console.error("Auth check failed", err);
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  const login = (token, user) => {
    localStorage.setItem('auth-token', token);
    setUserData({
      token,
      user,
    });
  };

  const logout = () => {
    setUserData({
      token: undefined,
      user: undefined,
    });
    localStorage.setItem('auth-token', '');
  };

  return (
    <AuthContext.Provider value={{ userData, setUserData, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
