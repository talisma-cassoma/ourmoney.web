import { useEffect } from 'react';
import { LoginButton } from '../../components/LoginButton'
import logoImg from '../../assets/logo.svg';
import { GoogleLoginButton, clientId } from '../../components/GoogleLoginButton';
import './styles.scss';
import { gapi } from "gapi-script";


export function Login() {
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

  return (
    <div id="page-auth">
      <main className="main-content">
        <img src={logoImg} alt="our-money" />
        <GoogleLoginButton />
        <div className="separator">or login with your password</div>
        <form>
          <input type="text" placeholder="username or email" />
          <input type="password" placeholder="Enter your password" />
          <LoginButton/>
        </form>
      </main>
    </div>
  );
}
