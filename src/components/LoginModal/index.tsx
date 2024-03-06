import { ChangeEvent, useState, useEffect } from 'react';
import { useLoginModal } from '../../contexts/LoginModalContext'; // Import the context hook
import { LoginButton } from './LoginButton';
import logoImg from '../../assets/logo.svg';
import { GoogleLoginButton, clientId } from './GoogleLoginButton';
import './styles.scss';
import { gapi } from "gapi-script";
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'phosphor-react';
import { CloseButton } from '../NewTransactionModal/styles';

export function LoginModal() {
  const { isOpen, closeLoginModal } = useLoginModal(); // Access context values

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    function start() {
      gapi.load('client:auth2', () => {
        gapi.client.init({
          clientId: clientId,
          scope: ""
        }).then(() => {
          console.log('Google API initialized');
        });
      });
    }
    start();
  }, []);

  const handleEmailChange = (e:ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e:ChangeEvent<HTMLInputElement> ) => {
    setPassword(e.target.value);
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={isOpen ? closeLoginModal : undefined}>
      <Dialog.Portal >
        <Dialog.Overlay className='DialogOverlay' />
        <Dialog.Content className="DialogContent">
          <Dialog.Description className="DialogDescription">
            <p>connecte-se com sua conta para ver os seus dados.</p>
          </Dialog.Description>
          <img src={logoImg} alt="our-money" />
          <GoogleLoginButton />
          <div className="separator">ou faça login com sua password</div>
          <form >
            <input 
              className="Input email" 
              placeholder="name@gmail.com"
              value={email}
              onChange={handleEmailChange}
            />
            <input 
              type="password" 
              className="Input password" 
              value={password}
              onChange={handlePasswordChange}
            />
            <LoginButton email={email} password={password} />
          </form>
          <button className="IconButton" aria-label="Close" onClick={closeLoginModal}>
            <CloseButton>
              <X size={24} />
            </CloseButton>
          </button>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

