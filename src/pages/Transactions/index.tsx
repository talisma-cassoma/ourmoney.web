import { useContextSelector } from 'use-context-selector';
import { Header } from '../../components/Header';
import { Summary } from '../../components/Summary';
import { TransactionsContext } from '../../contexts/TransactionsContext';
// Removido: LoginModal não precisa ser renderizado aqui, App.tsx cuida disso
// import { LoginModal } from '../../components/LoginModal'
import { dateFormatter, priceFormatter } from '../../utils/formatter';
import { SearchForm } from './components/SearchForm';

import {
  PriceHighlight,
  TransactionsContainer,
  TransactionsTable,
} from './styles';

// Removido: Não precisa mais do contexto do modal aqui
// import { useLoginModal } from '../../contexts/LoginModalContext';

export function Transactions() {
  // isAuthenticated não é mais estritamente necessário aqui, pois AuthGuard protege a página,
  // mas pode ser útil manter para alguma lógica específica se precisar.
  // O isLoading é importante para o feedback durante buscas/refresh.
  const transactions = useContextSelector(TransactionsContext, (context) => context.transactions);
  const isLoading = useContextSelector(TransactionsContext, (context) => context.isLoading);
  // const isAuthenticated = useContextSelector(TransactionsContext, (context) => context.isAuthenticated); // Pode remover se não usar

  // Removido: Estado do modal é gerenciado em App.tsx / LoginModalContext
  // const { isOpen: isLoginModalOpen } = useLoginModal();

  return (
    <div>
      {/* Header pode precisar saber se está autenticado para mostrar infos do usuário,
          nesse caso, ele consumiria TransactionsContext (ou um futuro AuthContext) */}
      <Header />
      {/* Removido: Modal renderizado em App.tsx */}
      {/* {isLoginModalOpen && <LoginModal />} */}
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
                // ... (código da linha da tabela sem alterações) ...
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

        {/* Mensagem se não estiver carregando e não houver transações (APÓS fetch inicial ou busca) */}
        {/* Não precisa mais checar isAuthenticated aqui, pois a página só renderiza se autenticado */}
        {!isLoading && transactions.length === 0 && (
          <p>Nenhuma transação encontrada.</p>
        )}

      </TransactionsContainer>
    </div>
  );
}