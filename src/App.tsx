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
    // Se a verificação inicial terminou (não é null) E não está autenticado E o modal não está aberto
    if (isAuthenticated === false && !isLoginModalOpen) {
      console.log("AuthGuard: Not authenticated after initial check. Opening Login Modal.");
      openLoginModal();
    }
    // Se ficar autenticado (após login), o modal deve ser fechado (o LoginButton já faz isso)
    // Se o token for removido (logout), o modal deve abrir novamente (este useEffect cuidará disso na próxima renderização)
  }, [isAuthenticated, isLoginModalOpen, openLoginModal]);

  // Se ainda estiver verificando a autenticação inicial, mostra um loader simples
  if (isLoadingAuth) {
    // Ou um componente de Skeleton/Spinner mais elaborado
    return <p style={{ textAlign: 'center', padding: '2rem' }}>Verificando autenticação...</p>;
  }

  // Se estiver autenticado, renderiza o conteúdo protegido (children)
  if (isAuthenticated === true) {
    return <>{children}</>;
  }

  // Se não estiver autenticado (e não estiver carregando), não renderiza children.
  // O LoginModal será controlado pelo seu próprio contexto e pelo useEffect acima.
  // Podemos renderizar null ou um fragmento vazio aqui.
  return null;
}

export function App() {
  return (
    <ThemeProvider theme={defaultTheme}>
      <GlobalStyle />
      {/* LoginModalContextProvider envolve tudo que pode precisar abrir/fechar o modal */}
      <LoginModalContextProvider>
        {/* TransactionsProvider envolve tudo que depende do estado de auth/transações */}
        <TransactionsProvider>
           {/* LoginModal é renderizado aqui, mas controlado pelo seu contexto */}
           {/* Ele precisa estar dentro dos providers se precisar acessar algum contexto,
               mas fora do AuthGuard para poder ser exibido mesmo sem auth */}
           <LoginModal />

           {/* AuthGuard decide se renderiza a página principal */}
           <AuthGuard>
              {/* Sua página/componente principal que requer autenticação */}
              <Transactions />
              {/* Outras rotas/componentes protegidos aqui */}
           </AuthGuard>

        </TransactionsProvider>
      </LoginModalContextProvider>
    </ThemeProvider>
  );
}