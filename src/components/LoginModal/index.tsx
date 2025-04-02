import { ChangeEvent, useState } from 'react';
import { useLoginModal } from '../../contexts/LoginModalContext'; // Import the context hook
import { LoginButton } from './LoginButton';
import logoImg from '../../assets/logo.svg';
import './styles.scss';

import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'phosphor-react';
import { CloseButton } from '../NewTransactionModal/styles';

export function LoginModal() {
  const { isOpen, closeLoginModal } = useLoginModal(); // Access context values

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={isOpen ? closeLoginModal : undefined}>
      <Dialog.Portal>
        <Dialog.Overlay className='DialogOverlay' />
        <Dialog.Content className="DialogContent">
          <Dialog.Title className="DialogTitle">Login</Dialog.Title> {/* Adicionado para acessibilidade */}
          <Dialog.Description className="DialogDescription">
            Conecte-se com sua conta para ver os seus dados.
          </Dialog.Description>
          <img src={logoImg} alt="our-money" />
          <div className="separator">Faça login com sua senha</div>
          <form>
            <input
              className="Input email"
              placeholder="ex: nome@gmail.com"
              value={email}
              onChange={handleEmailChange}
            />
            <input
              type="password"
              className="Input password"
              placeholder="Digite sua senha"
              value={password}
              onChange={handlePasswordChange}
            />
            <LoginButton email={email} password={password} />
          </form>
          <div className="IconButton" aria-label="Close" onClick={closeLoginModal}>
            <CloseButton>
              <X size={24} />
            </CloseButton>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
