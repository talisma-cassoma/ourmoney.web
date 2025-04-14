import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { createContext } from 'use-context-selector';
import { api } from '../lib/axios';

// Interfaces
interface Transaction {
  id: string;
  description: string;
  type: 'income' | 'outcome';
  price: number;
  category: string;
  createdAt: string;
}

type CreateTransactionInput = Pick<Transaction, 'description' | 'price' | 'category' | 'type'>;

interface TransactionContextType {
  transactions: Transaction[];
  setTransactions: (transactions: Transaction[]) => void;
  fetchTransactions: (query?: string) => Promise<void>;
  createTransaction: (data: CreateTransactionInput) => Promise<void>;
  isLoading: boolean;
  isAuthenticated: boolean | null;
  markAsAuthenticated: () => void;
  handleLogoutOrTokenInvalid: () => void;
}

interface TransactionsProviderProps {
  children: ReactNode;
}

// Contexto
export const TransactionsContext = createContext({} as TransactionContextType);

// Provider
export function TransactionsProvider({ children }: TransactionsProviderProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  const getToken = () => localStorage.getItem('authToken');

  const handleLogoutOrTokenInvalid = useCallback(() => {
    setIsAuthenticated(current => {
      if (current === true) {
        console.warn('[TransactionsContext] Logout or invalid token.');
        localStorage.removeItem('authToken');
        setTransactions([]);
        setIsLoading(false);
        return false;
      }
      return current;
    });
  }, []);

  const fetchTransactions = useCallback(async (query?: string) => {
    const token = getToken();

    if (!token) {
      console.error('[fetchTransactions] Token inexistent. running logout.');
      handleLogoutOrTokenInvalid();
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.get('transactions', {
        headers: { Authorization: `Bearer ${token}` },
        params: { _sort: 'createdAt', _order: 'desc', q: query },
      });

      setIsAuthenticated(current => {
        if (current === true) {
          setTransactions(response.data);
          console.log('[fetchTransactions] Transações upated sucessfully.');
          return true;
        }
        console.warn('[fetchTransactions] user isnt logged.');
        setTransactions([]);
        return false;
      });
    } catch (error: any) {
      console.error('[fetchTransactions] Erro:', error);
      const status = error?.response?.status;

      if (status === 401 || status === 403) {
        handleLogoutOrTokenInvalid();
      } else {
        console.warn('[fetchTransactions] Erro authentication fail.');
      }
    } finally {
      setIsAuthenticated(current => {
        if (current === true) setIsLoading(false);
        return current;
      });
    }
  }, [handleLogoutOrTokenInvalid]);

  const createTransaction = useCallback(async (data: CreateTransactionInput) => {
    const token = getToken();
    if (!token) {
      handleLogoutOrTokenInvalid();
      throw new Error('Token ausente inexistent.');
    }

    try {
      await api.post(
        'transactions',
        {
          ...data,
          owner: 'talisma',
          email: 'talisma@email.com',
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      await fetchTransactions();
    } catch (error: any) {
      const status = error?.response?.status;

      if (status === 401 || status === 403) {
        handleLogoutOrTokenInvalid();
        throw new Error('fail saving transaction.');
      }

      throw error;
    }
  }, [fetchTransactions, handleLogoutOrTokenInvalid]);

  const markAsAuthenticated = useCallback(() => {
    const token = getToken();
    setIsAuthenticated(current => {
      if (current !== true && token) {
        return true;
      } else if (!token) {
        handleLogoutOrTokenInvalid();
        return false;
      }
      return current;
    });
  }, [handleLogoutOrTokenInvalid]);

  // Efeito de montagem: verifica token e define estado inicial
  useEffect(() => {
    const token = getToken();
    setIsAuthenticated(!!token);
  }, []);

  // Reação à mudança de autenticação
  useEffect(() => {
    if (isAuthenticated === true) {
      fetchTransactions();
    } else if (isAuthenticated === false) {
      setTransactions([]);
      setIsLoading(false);
    }
  }, [isAuthenticated, fetchTransactions]);

  // Listener de alterações externas no localStorage
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'authToken') {
        const tokenNow = getToken();
        const authenticated = !!tokenNow;

        setIsAuthenticated(prev => {
          if ((authenticated && !prev) || (!authenticated && prev)) {
            return authenticated;
          }
          return prev;
        });
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Memoize value do provider
  const contextValue = useMemo(() => ({
    transactions,
    setTransactions,
    fetchTransactions,
    createTransaction,
    isLoading,
    isAuthenticated,
    markAsAuthenticated,
    handleLogoutOrTokenInvalid,
  }), [
    transactions,
    fetchTransactions,
    createTransaction,
    isLoading,
    isAuthenticated,
    markAsAuthenticated,
    handleLogoutOrTokenInvalid,
  ]);

  return (
    <TransactionsContext.Provider value={contextValue}>
      {children}
    </TransactionsContext.Provider>
  );
}
