import { ChangeEvent, useState } from 'react';
import { useLoginModal } from '../../contexts/LoginModalContext';
import { api } from '../../lib/axios';
import { useContextSelector } from 'use-context-selector';
import { TransactionsContext } from '../../contexts/TransactionsContext';

import logoImg from '../../assets/logo.svg';
import './styles.scss';

import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'phosphor-react';
import { CloseButton } from '../NewTransactionModal/styles';

export function LoginModal() {
  const { isOpen, closeLoginModal } = useLoginModal();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const markAsAuthenticated = useContextSelector(TransactionsContext, (context) => context.markAsAuthenticated);

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();

    try {
      console.log('LoginModal: Attempting login...');
      const response = await api.post('login', { email, password });
      const token = response.data.authToken;

      if (token) {
        localStorage.setItem('authToken', token);
        console.log('LoginModal: Login successful, token stored.');
        markAsAuthenticated();
        closeLoginModal();
      } else {
        console.error('LoginModal: Login successful but no token received.');
      }
    } catch (error: any) {
      console.error('LoginModal: Error during login:', error);
    }
  }

  return (
    <Dialog.Root open={isOpen} onOpenChange={isOpen ? closeLoginModal : undefined}>
      <Dialog.Portal>
        <Dialog.Overlay className='DialogOverlay' />
        <Dialog.Content className="DialogContent">
          <Dialog.Title className="DialogTitle">Login</Dialog.Title>
          <Dialog.Description className="DialogDescription">
            Conecte-se com sua conta para ver os seus dados.
          </Dialog.Description>
          <img src={logoImg} alt="our-money" />
          <div className="separator">Faça login com sua senha</div>
          <form onSubmit={onSubmit}>
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
            <button className="login" type="submit">Conectar</button>
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
