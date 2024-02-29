
import logoImg from '../../../assets/logo.svg';
import googleIconImg from '../../../assets/google-icon.svg';

import { Button } from '../../../components/Button';

import './styles.scss';

export function Login() {
  return (
    <div id="page-auth">
      <main className="main-content">
        <img src={logoImg} alt="our-money" />
        <button className="login">
          <img src={googleIconImg} alt="Logo do Google" />
          Login com o Google
        </button>
        <div className="separator">ou acesse com sua palavra passe</div>
        <form>
          <input
            type="text"
            placeholder="nome usaurio ou email"
          />
          <input
            type="password"
            placeholder="Digite sua palavra-passe"
          />
          <Button type="submit">
            ENTRAR
          </Button>
        </form>
      </main>
    </div>
  )
}