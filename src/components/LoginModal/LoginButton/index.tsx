import { MouseEvent } from 'react';
import './styles.scss';

interface LoginButtonProps {
  email: string;
  password: string;
}

export function LoginButton({ email, password}: LoginButtonProps) {
function onSubmit({ email, password}: LoginButtonProps){
console.log("email", email, "pass", password )
}

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    onSubmit({email, password});
  };

  return (
    <button className='login' onClick={handleClick}>se conectar a minha conta</button>
  );
}
