import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';

interface LoginModalContextType {
  isOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
}

const LoginModalContext = createContext<LoginModalContextType | undefined>(undefined);

export const LoginModalContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // O estado inicial verifica se há um token e define se o modal deve estar aberto
  const [isOpen, setIsOpen] = useState(() => !localStorage.getItem('authToken'));

  const openLoginModal = useCallback(() => {
    // Só abre o modal se não houver token
    if (!localStorage.getItem('authToken')) {
      console.log('Abrindo modal de login.');
      setIsOpen(true);
    }
  }, []);

  const closeLoginModal = useCallback(() => {
    console.log('Fechando modal de login.');
    setIsOpen(false);
  }, []);

  return (
    <LoginModalContext.Provider value={{ isOpen, openLoginModal, closeLoginModal }}>
      {children}
    </LoginModalContext.Provider>
  );
};

export const useLoginModal = (): LoginModalContextType => {
  const context = useContext(LoginModalContext);
  if (!context) {
    throw new Error('useLoginModal must be used within a LoginModalProvider');
  }
  return context;
};
