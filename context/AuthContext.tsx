import React, { createContext, useState, useContext, ReactNode } from 'react';
import { useRouter } from 'expo-router';
import { Usuario } from '../utils/gerenciarUsuarios'; // Importe o tipo Usuario

interface AuthContextData {
  usuario: Usuario | null; // Agora armazena o objeto completo
  login: (dadosUsuario: Usuario) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const router = useRouter();

  const login = (dadosUsuario: Usuario) => {
    setUsuario(dadosUsuario);
    if (dadosUsuario.role === 'medico') {
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