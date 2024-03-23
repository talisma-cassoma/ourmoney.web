import { MouseEvent } from 'react';
import './styles.scss';
import { useLoginModal } from '../../../contexts/LoginModalContext'; // Import the context hook
interface LoginButtonProps {
  email: string;
  password: string;
}

export function LoginButton({ email, password}: LoginButtonProps) {
  const { closeLoginModal } = useLoginModal(); // Access context values
function onSubmit({ email, password}: LoginButtonProps){
console.log("email", email, "pass", password )
}

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    onSubmit({email, password});
    closeLoginModal();
  };

  return (
    <button className='login' onClick={handleClick}> conectar </button>
  );
}
