import { ThemeProvider } from 'styled-components'
import { TransactionsProvider } from './contexts/TransactionsContext'
import { LoginModalContextProvider } from './contexts/LoginModalContext';
import { Transactions } from './pages/Transactions'
import { GlobalStyle } from './styles/global'
import { defaultTheme } from './styles/themes/default'

export function App() {
  return (
    <ThemeProvider theme={defaultTheme}>
      <GlobalStyle />

      <LoginModalContextProvider>
        {/* Provider de Transações envolve as páginas que usam transações */}
        <TransactionsProvider>
          {/* Sua página/componente principal */}
          <Transactions />
          {/* Outras rotas/componentes aqui */}
        </TransactionsProvider>
      </LoginModalContextProvider>
    </ThemeProvider>
  )
}