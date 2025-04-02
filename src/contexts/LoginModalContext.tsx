import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

interface LoginModalContextType {
  isOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
}

const LoginModalContext = createContext<LoginModalContextType | undefined>(undefined);

export const LoginModalContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Verifica o token *no momento da inicialização* para decidir se o modal abre
  const [isOpen, setIsOpen] = useState(() => {
    const token = localStorage.getItem('authToken');
    console.log('LoginModalContext: Initial token check:', token ? 'Found' : 'Not Found');
    return !token; // Abre se NÃO houver token
  });

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      // Escuta especificamente por mudanças na chave 'authToken'
      if (event.key === 'authToken') {
        const token = localStorage.getItem('authToken');
        console.log('LoginModalContext: Storage event detected. New token status:', token ? 'Found' : 'Not Found');
        // Fecha o modal se um token for DEFINIDO (login bem-sucedido em outra aba ou nesta)
        if (token) {
          setIsOpen(false);
        }
        // Abrir o modal se o token for REMOVIDO (logout em outra aba)
        else {
          setIsOpen(true);
        }
      }
    };

    console.log('LoginModalContext: Adding storage listener.');
    window.addEventListener('storage', handleStorageChange);

    // Cleanup listener on component unmount
    return () => {
      console.log('LoginModalContext: Removing storage listener.');
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []); // Roda apenas uma vez na montagem

  const openLoginModal = () => {
    console.log('LoginModalContext: Opening modal via openLoginModal()');
    setIsOpen(true);
  }
  const closeLoginModal = () => {
    console.log('LoginModalContext: Closing modal via closeLoginModal()');
    setIsOpen(false);
  }

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