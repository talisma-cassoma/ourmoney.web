import { useContextSelector } from 'use-context-selector';
import { Header } from '../../components/Header';
import { Summary } from '../../components/Summary';
import { TransactionsContext } from '../../contexts/TransactionsContext';
import { LoginModal } from '../../components/LoginModal'
import { dateFormatter, priceFormatter } from '../../utils/formatter';
import { SearchForm } from './components/SearchForm';

import {
  PriceHighlight,
  TransactionsContainer,
  TransactionsTable,
} from './styles';

import { useLoginModal } from '../../contexts/LoginModalContext';

export function Transactions() {

  // O isLoading é importante para o feedback durante buscas/refresh.
  const transactions = useContextSelector(TransactionsContext, (context) => context.transactions);
  const isLoading = useContextSelector(TransactionsContext, (context) => context.isLoading);
  //const isAuthenticated = useContextSelector(TransactionsContext, (context) => context.isAuthenticated); 

  const { isOpen: isLoginModalOpen } = useLoginModal();

  return (
    <div>
      <Header />      
      {isLoginModalOpen && <LoginModal />}
      <Summary />
      <TransactionsContainer>
        <SearchForm />

        {/* Mostra loading APENAS se estiver carregando E JÁ AUTENTICADO (implícito pela renderização da página) */}
        {isLoading && <p>Carregando transações...</p>}

        {/* Mostra a tabela se NÃO estiver carregando E houver transações */}
        {!isLoading && transactions.length > 0 && (
          <TransactionsTable>
            <tbody>
              {transactions.map((transaction) => {

                return (
                    <tr key={transaction.id}>
                      <td width="50%">{transaction.description}</td>
                      <td>
                        <PriceHighlight variant={transaction.type}>
                          {transaction.type === 'outcome' && '- '}
                          {priceFormatter.format(transaction.price)}
                        </PriceHighlight>
                      </td>
                      <td>{transaction.category}</td>
                      <td>
                        {dateFormatter.format(new Date(transaction.createdAt))}
                      </td>
                    </tr>
                  )
              })}
            </tbody>
          </TransactionsTable>
        )}

        {!isLoading && transactions.length === 0 && (
          <p>Nenhuma transação encontrada.</p>
        )}

      </TransactionsContainer>
    </div>
  );
}