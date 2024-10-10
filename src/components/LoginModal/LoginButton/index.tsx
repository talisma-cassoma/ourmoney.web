import { MouseEvent } from 'react';
import './styles.scss';
import { useLoginModal } from '../../../contexts/LoginModalContext'; // Import the context hook
import { api } from '../../../lib/axios';
import Cookies from 'js-cookie';

interface LoginButtonProps {
  email: string;
  password: string;
}

export function LoginButton({ email, password }: LoginButtonProps) {
  const { closeLoginModal } = useLoginModal(); // Access context values

  // Função que envia a requisição de login e armazena o token no cookie
  async function onSubmit({ email, password }: LoginButtonProps) {
    try {
      // Fazendo a requisição de login para a API backend
      const response = await api.post('login', {
        email,
        password,
      });

      // Supondo que o token JWT venha no campo `token` da resposta
      const token  = response.data;

      // Armazenando o token nos cookies com duração de 1 hora (60 minutos)
      Cookies.set('authToken', token, { expires: 1 / 24, secure: true });

      console.log('Login bem-sucedido e token armazenado');
    } catch (error) {
      console.error('Erro ao fazer login:', error);
    }
  }

  // Evento de clique do botão
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    onSubmit({ email, password }); // Envia o email e a senha
    closeLoginModal(); // Fecha o modal de login após o clique
  };

  return (
    <button className="login" onClick={handleClick}>
      conectar
    </button>
  );
}
