// Login.tsx
import React, { useEffect } from 'react';
import { Button } from '../../../components/Button';
import logoImg from '../../../assets/logo.svg';
import { GoogleLoginButton, clientId } from '../../../components/GoogleLoginButton';
import './styles.scss';
import { gapi } from "gapi-script";


console.log(clientId)

export function Login() {
  useEffect(() => {
    function start() {
      gapi.load('client:auth2', () => {
        gapi.client.init({
          clientId: clientId,
          scope: ""
        }).then(() => {
          console.log('Google API initialized');
        }).catch((error) => {
          console.error('Error initializing Google API:', error);
        });
      });
    }
    start();
  }, []);

  return (
    <div id="page-auth">
      <main className="main-content">
        <img src={logoImg} alt="our-money" />
        <GoogleLoginButton />
        <div className="separator">or login with your password</div>
        <form>
          <input type="text" placeholder="username or email" />
          <input type="password" placeholder="Enter your password" />
          <Button type="submit">LOGIN</Button>
        </form>
      </main>
    </div>
  );
}
