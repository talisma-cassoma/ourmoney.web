import { ReactNode, useCallback, useEffect, useState } from 'react';
import { createContext } from 'use-context-selector';
import { api } from '../lib/axios';

// ... Interfaces Transaction, CreateTransactionInput (sem alterações) ...
interface Transaction {
  id: string;
  description: string;
  type: 'income' | 'outcome';
  price: number;
  category: string;
  createdAt: string;
}

interface CreateTransactionInput {
  description: string;
  price: number;
  category: string;
  type: 'income' | 'outcome';
}


interface TransactionContextType {
  transactions: Transaction[];
  setTransactions: (transaction: Transaction[])=> void;
  fetchTransactions: (query?: string) => Promise<void>;
  createTransaction: (data: CreateTransactionInput) => Promise<void>;
  isLoading: boolean; // Indica carregamento de *transações*
  isAuthenticated: boolean | null; // null = estado inicial (verificando), false = não autenticado, true = autenticado
  markAsAuthenticated: () => void;
  handleLogoutOrTokenInvalid: () => void;
}

interface TransactionsProviderProps {
  children: ReactNode;
}

export const TransactionsContext = createContext({} as TransactionContextType);

export function TransactionsProvider({ children }: TransactionsProviderProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  // Efeito 1: Verificação Inicial (Roda APENAS UMA VEZ na montagem)
  // Responsabilidade: Definir o estado inicial de 'isAuthenticated' baseado no localStorage.
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    console.log('TransactionsContext Initial Mount: Checking token...');
    if (token) {
      console.log('TransactionsContext Initial Mount: Token found. Setting authenticated.');
      // Apenas define o estado. A reação (fetch) será tratada pelo Efeito 2.
      setIsAuthenticated(true);
    } else {
      console.log('TransactionsContext Initial Mount: No token found. Setting unauthenticated.');
      setIsAuthenticated(false);
    }
  }, []); // Array vazio garante execução única na montagem

  // ... handleLogoutOrTokenInvalid, fetchTransactions, createTransaction, markAsAuthenticated (sem alterações) ...
   // Handler centralizado para logout ou token inválido
   const handleLogoutOrTokenInvalid = useCallback(() => {
    setIsAuthenticated(currentAuth => {
      if (currentAuth === true) {
          console.warn("TransactionsContext: Handling logout or invalid token.");
          localStorage.removeItem('authToken');
          setTransactions([]);
          setIsLoading(false);
          return false;
      }
      return currentAuth;
    });
  }, []);

  // Fetch transactions
  const fetchTransactions = useCallback(async (query?: string) => {
    console.log("TransactionsContext (fetchTransactions): Fetching...");
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.error("TransactionsContext (fetchTransactions): Token missing unexpectedly! Logging out.");
      handleLogoutOrTokenInvalid();
      return;
    }
    setIsLoading(true);
    try {
      const response = await api.get('transactions', {
        headers: { Authorization: `Bearer ${token}` },
        params: { _sort: 'createdAt', _order: 'desc', q: query },
      });
       setIsAuthenticated(currentAuth => {
         if (currentAuth === true) {
           setTransactions(response.data);
           console.log("TransactionsContext (fetchTransactions): Success.");
           return true;
         } else {
           console.warn("TransactionsContext (fetchTransactions): Became unauthenticated during fetch. Discarding results.");
           setTransactions([]);
           return false;
         }
       });
    } catch (error: any) {
      console.error("TransactionsContext (fetchTransactions): Error:", error);
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        console.warn("TransactionsContext (fetchTransactions): API returned Auth error (401/403).");
        handleLogoutOrTokenInvalid();
      } else {
        console.error("TransactionsContext (fetchTransactions): Non-auth error occurred.");
        setIsAuthenticated(currentAuth => {
            if (currentAuth === true) setIsLoading(false);
            return currentAuth;
        });
      }
    } finally {
       setIsAuthenticated(currentAuth => {
         if (currentAuth === true) setIsLoading(false);
         return currentAuth;
       });
    }
  }, [handleLogoutOrTokenInvalid]);

  // Create transaction
  const createTransaction = useCallback(
    async (data: CreateTransactionInput) => {
      console.log("TransactionsContext (createTransaction): Attempting create...");
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.error("TransactionsContext (createTransaction): Token missing unexpectedly! Logging out.");
        handleLogoutOrTokenInvalid();
        throw new Error("Authentication failed: Token missing unexpectedly.");
      }
      const { description, price, category, type } = data;
      const email="talisma@email.com";
      const owner="talisma"
      try {
        await api.post(
          'transactions',
          { description,
            type,
            category,
            price,
            owner,
            email},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("TransactionsContext (createTransaction): Success. Fetching updates...");
        await fetchTransactions();
      } catch (error: any) {
        console.error("TransactionsContext (createTransaction): Error:", error);
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          console.warn("TransactionsContext (createTransaction): API returned Auth error (401/403).");
          handleLogoutOrTokenInvalid();
          throw new Error("Authentication failed during transaction creation.");
        } else {
          console.error("TransactionsContext (createTransaction): Non-auth error occurred.");
           throw error;
        }
      }
    },
    [fetchTransactions, handleLogoutOrTokenInvalid]
  );

  // Marca como autenticado
  const markAsAuthenticated = useCallback(() => {
    setIsAuthenticated(currentAuth => {
        if (currentAuth !== true) {
            const token = localStorage.getItem('authToken');
            if (token) {
                console.log("TransactionsContext: markAsAuthenticated called. Setting isAuthenticated to true.");
                return true;
            } else {
                console.warn("TransactionsContext: markAsAuthenticated called, but no token found. Handling as logout.");
                handleLogoutOrTokenInvalid();
                return false;
            }
        }
        return currentAuth;
    });
  }, [handleLogoutOrTokenInvalid]);


  // Efeito 2: Reação à Mudança de Autenticação (Roda sempre que 'isAuthenticated' muda)
  // Responsabilidade: Executar ações (buscar dados, limpar dados) com base no estado de autenticação ATUAL.
  // Isso cobre a carga inicial (após Efeito 1 definir o estado) e também login/logout.
  useEffect(() => {
    console.log(`TransactionsContext (Auth Effect): isAuthenticated changed to: ${isAuthenticated}`);
    if (isAuthenticated === true) {
      console.log("TransactionsContext (Auth Effect): Is authenticated, calling fetchTransactions.");
      fetchTransactions(); // Busca dados ao se tornar autenticado
    } else if (isAuthenticated === false) {
      console.log("TransactionsContext (Auth Effect): Is NOT authenticated, ensuring clean state.");
      setTransactions([]); // Limpa dados ao se tornar não autenticado
      setIsLoading(false); // Garante que não fique em estado de loading
    }
    // Se isAuthenticated for null (estado inicial antes do Efeito 1 terminar), não faz nada.
  }, [isAuthenticated, fetchTransactions]); // Depende do estado e da função de fetch estável

  // ... Efeito de Storage Listener (sem alterações) ...
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'authToken') {
        const currentToken = localStorage.getItem('authToken');
        const nowAuthenticated = !!currentToken;
        console.log(`TransactionsContext (Storage Listener): Auth token changed externally. Now ${nowAuthenticated ? 'present' : 'absent'}.`);
        setIsAuthenticated(prevAuth => {
          const needsUpdate = (nowAuthenticated && prevAuth !== true) || (!nowAuthenticated && prevAuth === true);
          if (needsUpdate) {
            console.log(`TransactionsContext (Storage Listener): Updating internal state to ${nowAuthenticated}.`);
            return nowAuthenticated;
          }
          return prevAuth;
        });
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <TransactionsContext.Provider
      value={{
        transactions,
        setTransactions,
        fetchTransactions,
        createTransaction,
        isLoading,
        isAuthenticated,
        markAsAuthenticated,
        handleLogoutOrTokenInvalid,
      }}
    >
      {children}
    </TransactionsContext.Provider>
  );
}