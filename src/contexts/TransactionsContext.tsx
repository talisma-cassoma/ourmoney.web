import { ReactNode, useCallback, useEffect, useState } from 'react';
import { createContext } from 'use-context-selector';
import { api } from '../lib/axios';

// ... (interfaces Transaction, CreateTransactionInput) ...
interface Transaction {
  id: number
  description: string
  type: 'income' | 'outcome'
  price: number
  category: string
  createdAt: string
}

interface CreateTransactionInput {
  description: string
  price: number
  category: string
  type: 'income' | 'outcome'
  owner: string
  email: string
}

interface TransactionContextType {
  transactions: Transaction[]
  fetchTransactions: (query?: string) => Promise<void>
  createTransaction: (data: CreateTransactionInput) => Promise<void>
  isLoading: boolean
  isAuthenticated: boolean
  // Nova função para ser chamada após o login bem-sucedido
  markAsAuthenticated: () => void
}

interface TransactionsProviderProps {
  children: ReactNode
}

export const TransactionsContext = createContext({} as TransactionContextType);

export function TransactionsProvider({ children }: TransactionsProviderProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // A verificação inicial do token ainda é importante
    const token = localStorage.getItem('authToken');
    console.log('TransactionsContext Initial Mount: Token found?', !!token);
    return !!token;
  });

  // Função para buscar transações (lógica interna permanece a mesma)
  const fetchTransactions = useCallback(async (query?: string) => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.warn("TransactionsContext (fetchTransactions): No token found. Aborting.");
      if (transactions.length > 0) setTransactions([]);
      // Garante que o estado isAuthenticated esteja como false se não houver token
      if (isAuthenticated) {
          console.log("TransactionsContext (fetchTransactions): Token missing, setting isAuthenticated to false.");
          setIsAuthenticated(false);
      }
      return;
    }
     // Se por acaso o estado estiver dessincronizado (raro, mas possível), corrija antes de buscar
    if (!isAuthenticated) {
        console.warn("TransactionsContext (fetchTransactions): Token found, but state is not authenticated. Correcting state.");
        setIsAuthenticated(true);
        // A busca será acionada pelo useEffect na próxima renderização
        return;
    }


    console.log("TransactionsContext (fetchTransactions): Fetching transactions...");
    setIsLoading(true);
    try {
      const response = await api.get('transactions', {
        headers: { Authorization: `Bearer ${token}` },
        params: { _sort: 'createdAt', _order: 'desc', q: query },
      });
      setTransactions(response.data);
      console.log("TransactionsContext (fetchTransactions): Success.");
    } catch (error: any) {
      console.error("TransactionsContext (fetchTransactions): Error:", error);
      setTransactions([]);
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        console.warn("TransactionsContext (fetchTransactions): Auth error (401/403). Removing token.");
        localStorage.removeItem('authToken');
        setIsAuthenticated(false); // <<< Dispara a atualização de estado e limpeza no useEffect
      }
    } finally {
      setIsLoading(false);
    }
  // Dependências: isAuthenticated é crucial aqui para re-rodar se o estado for corrigido acima.
  // transactions.length pode ser útil se a lógica de limpeza depender dele.
  }, [isAuthenticated, transactions.length]);

  // Função para criar transação (sem mudanças significativas aqui)
  const createTransaction = useCallback(
    async (data: CreateTransactionInput) => {
      // ... (lógica existente) ...
       const token = localStorage.getItem('authToken');
        if (!token || !isAuthenticated) {
            console.error("TransactionsContext (createTransaction): Not authenticated. Aborting.");
            return;
        }
         // ... resto da lógica ...
        try {
          // ... chamada api ...
          await fetchTransactions(); // Busca após criar
        } catch(error: any) {
             console.error("TransactionsContext (createTransaction): Error:", error);
             if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                console.warn("TransactionsContext (createTransaction): Auth error (401/403). Removing token.");
                localStorage.removeItem('authToken');
                setIsAuthenticated(false);
            }
        }
        // ... finally ...
    },
    [fetchTransactions, isAuthenticated],
  );

  // >>> NOVA FUNÇÃO <<<
  // Função para ser chamada explicitamente após um login bem-sucedido
  const markAsAuthenticated = useCallback(() => {
    console.log("TransactionsContext: markAsAuthenticated called. Setting isAuthenticated to true.");
    // Verifica se já não está autenticado para evitar re-renderizações desnecessárias
    if (!isAuthenticated) {
        setIsAuthenticated(true);
    }
    // Nota: Não precisamos chamar fetchTransactions() aqui diretamente.
    // O useEffect abaixo, que depende de `isAuthenticated`, fará isso
    // quando o estado for atualizado.
  }, [isAuthenticated]); // Depende de isAuthenticated para evitar chamada desnecessária

  // Efeito para reagir a mudanças no localStorage (ainda útil para sync entre abas/janelas e logout)
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'authToken') {
        const currentToken = localStorage.getItem('authToken');
        const nowAuthenticated = !!currentToken;
        console.log(`TransactionsContext (Storage Listener): Auth token changed in storage. Now ${nowAuthenticated ? 'present' : 'absent'}.`);
        // Atualiza o estado interno se ele for diferente do que o storage indica
        if (nowAuthenticated !== isAuthenticated) {
           console.log(`TransactionsContext (Storage Listener): Updating internal state to ${nowAuthenticated}.`);
           setIsAuthenticated(nowAuthenticated);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [isAuthenticated]); // Dependência é importante para a comparação dentro do handler

  // Efeito Principal: Reage à mudança no estado `isAuthenticated`
  // (seja pela função markAsAuthenticated, pelo storage listener ou pelo erro 401/403)
  useEffect(() => {
    console.log(`TransactionsContext (Auth Effect): Running effect because isAuthenticated is now ${isAuthenticated}.`);
    if (isAuthenticated) {
      console.log("TransactionsContext (Auth Effect): Is authenticated, calling fetchTransactions.");
      fetchTransactions();
    } else {
      console.log("TransactionsContext (Auth Effect): Is NOT authenticated, clearing transactions.");
      // Limpa as transações apenas se houver alguma para limpar
      if (transactions.length > 0) {
         setTransactions([]);
      }
    }
  }, [isAuthenticated, fetchTransactions, transactions.length]); // Mantenha as dependências

  return (
    <TransactionsContext.Provider
      value={{
        transactions,
        fetchTransactions,
        createTransaction,
        isLoading,
        isAuthenticated,
        markAsAuthenticated, // <<< Expondo a nova função
      }}
    >
      {children}
    </TransactionsContext.Provider>
  );
}