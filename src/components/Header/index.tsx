import { HeaderContainer, HeaderContent, NewTransactionButton, ProfileWrapper } from './styles'
import * as Dialog from '@radix-ui/react-dialog'
import logoImg from '../../assets/logo.svg'
import { NewTransactionModal } from '../NewTransactionModal'
import { LoginModal } from '../LoginModal'
import { useLoginModal } from '../../contexts/LoginModalContext'

export function Header() {
  const { openLoginModal } = useLoginModal(); // Using the hook here to access the openLoginModal function

  return (
    
      <HeaderContainer>
        <HeaderContent>
          <ProfileWrapper>
            <img src={logoImg} alt="" />
            {/* <Profile/> */}
            <p onClick={openLoginModal}>faça o seu login</p>
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
