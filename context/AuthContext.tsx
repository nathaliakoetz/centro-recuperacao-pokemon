import React, { createContext, useState, useContext, ReactNode } from 'react';
import { useRouter } from 'expo-router';

interface AuthContextData {
  usuario: string | null;
  login: (nome: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [usuario, setUsuario] = useState<string | null>(null);
  const router = useRouter();

  const login = (nome: string) => {
    setUsuario(nome);
    if (nome === 'medico') {
      router.replace('/(interno)/medico/medico');
    } else {
      router.replace('/(interno)/tela-inicial');
    }
  };

  const logout = () => {
    setUsuario(null);
    router.replace('/');
  };

  return (
    <AuthContext.Provider value={{ usuario, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};