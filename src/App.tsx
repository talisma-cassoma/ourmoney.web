import { useEffect, ReactNode } from 'react';
import { ThemeProvider } from 'styled-components';
import { TransactionsProvider, TransactionsContext } from './contexts/TransactionsContext';
import { LoginModalContextProvider, useLoginModal } from './contexts/LoginModalContext';
import { Transactions } from './pages/Transactions';
import { GlobalStyle } from './styles/global';
import { defaultTheme } from './styles/themes/default';
import { useContextSelector } from 'use-context-selector';
import { LoginModal } from './components/LoginModal'; // Importar LoginModal aqui

// Componente Guardião
function AuthGuard({ children }: { children: ReactNode }) {
  const isAuthenticated = useContextSelector(TransactionsContext, (context) => context.isAuthenticated);
  const isLoadingAuth = isAuthenticated === null; // Verifica se ainda está no estado inicial de checagem
  const { openLoginModal, isOpen: isLoginModalOpen } = useLoginModal();

  useEffect(() => {
    if (isAuthenticated === false && !isLoginModalOpen) {
      console.log("AuthGuard: Not authenticated after initial check. Opening Login Modal.");
      openLoginModal();
    }
  }, [isAuthenticated, isLoginModalOpen, openLoginModal]);

  if (isLoadingAuth) {
    return <p style={{ textAlign: 'center', padding: '2rem' }}>Verificando autenticação...</p>;
  }

  if (isAuthenticated === true) {
    return <>{children}</>;
  }
  return null;
}

export function App() {
  return (
    <ThemeProvider theme={defaultTheme}>
      <GlobalStyle />
      <LoginModalContextProvider>

        <TransactionsProvider>

          <LoginModal />
          <AuthGuard>
            <Transactions />
          </AuthGuard>

        </TransactionsProvider>
      </LoginModalContextProvider>
    </ThemeProvider>
  );
}