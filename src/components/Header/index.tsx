import { HeaderContainer, HeaderContent, NewTransactionButton, ProfileWrapper } from './styles'
import * as Dialog from '@radix-ui/react-dialog'
import logoImg from '../../assets/logo.svg'
import { NewTransactionModal } from '../NewTransactionModal'
import { LoginModal } from '../LoginModal'
import { useContextSelector } from 'use-context-selector';
import { TransactionsContext } from '../../contexts/TransactionsContext'


export function Header() {
  const handleLogoutOrTokenInvalid = useContextSelector(
    TransactionsContext,
    (context) => context.handleLogoutOrTokenInvalid
  );

  function logout() {
    localStorage.removeItem('authToken');
    handleLogoutOrTokenInvalid();
  }
  //const { openLoginModal } = useLoginModal(); // Using the hook here to access the openLoginModal function

  return (

    <HeaderContainer>
      <HeaderContent>
        <ProfileWrapper>
          <img src={logoImg} alt="" />
          <p onClick={logout} style={{ cursor: 'pointer', textAlign: 'center', fontWeight:'bolder'}}>
            logout
          </p>
          <LoginModal />
        </ProfileWrapper>

        <Dialog.Root>
          <Dialog.Trigger asChild>
            <NewTransactionButton>Nova transação</NewTransactionButton>
          </Dialog.Trigger>

          <NewTransactionModal />
        </Dialog.Root>
      </HeaderContent>
    </HeaderContainer>
  )
}
