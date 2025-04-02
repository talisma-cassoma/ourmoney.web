import './styles.scss';
import { useLoginModal } from '../../../contexts/LoginModalContext';
import { api } from '../../../lib/axios';
import { useContextSelector } from 'use-context-selector';
import { TransactionsContext } from '../../../contexts/TransactionsContext';

interface LoginButtonProps {
  email: string;
  password: string;
}

export function LoginButton({ email, password }: LoginButtonProps) {
  const { closeLoginModal } = useLoginModal();
  // Obter a função markAsAuthenticated do TransactionsContext
  const markAsAuthenticated = useContextSelector(TransactionsContext, (context) => context.markAsAuthenticated);

  async function onSubmit(email: string, password: string) {
    try {
      console.log('LoginButton: Attempting login...');
      const response = await api.post('login', { email, password });
      const token = response.data.authToken; // Certifique-se que 'authToken' é a chave correta

      if (token) {
        localStorage.setItem('authToken', token);
        console.log('LoginButton: Login successful, token stored.');
        // <<< CHAMAR A FUNÇÃO DO CONTEXTO AQUI >>>
        // Isso vai atualizar o estado isAuthenticated no TransactionsProvider
        markAsAuthenticated();

        // Apenas fecha o modal. O listener no TransactionsProvider vai pegar a
        // mudança no localStorage (via 'storage' event) e acionar o fetch.
        closeLoginModal();
      } else {
        console.error('LoginButton: Login successful but no token received.');
        // Informar usuário sobre o erro?
      }

    } catch (error) {
      console.error('LoginButton: Error during login:', error);
      // Informar o usuário sobre o erro de login (ex: credenciais inválidas)
      // Poderia usar um estado local para exibir mensagem de erro
    }
  }

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault(); // Previne submit de formulário se estiver dentro de um
    onSubmit(email, password);
  };

  return (
    <button className="login" onClick={handleClick}>
      conectar
    </button>
  );
}