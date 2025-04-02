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

import { useLoginModal } from '../../contexts/LoginModalContext'; // Importar o hook para acessar o estado do modal

export function Transactions() {
  // Usar useContextSelector para pegar apenas o que precisa
  const transactions = useContextSelector(TransactionsContext, (context) => context.transactions);
  const isLoading = useContextSelector(TransactionsContext, (context) => context.isLoading);
  const isAuthenticated = useContextSelector(TransactionsContext, (context) => context.isAuthenticated);
  
  // O estado de abertura do modal vem do context do Modal
  const { isOpen: isLoginModalOpen } = useLoginModal(); // Pegar o estado do modal

  return (
    <div>
      <Header />
      {isLoginModalOpen && <LoginModal />}
      <Summary />
      <TransactionsContainer>
        <SearchForm />
        {/* Mostra uma mensagem de loading */}
        {isLoading && <p>Carregando transações...</p>}

        {/* Mostra a tabela apenas se não estiver carregando E houver transações */}
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

        {/* Mensagem se não estiver carregando e não houver transações (após tentativa de fetch)*/ }
        {!isLoading && transactions.length === 0 && isAuthenticated && ( // Adicionado isAuthenticated check
          <p>Nenhuma transação encontrada.</p>
        )}

      </TransactionsContainer>
    </div>
  );
}