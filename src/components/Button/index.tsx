import { ButtonHTMLAttributes} from 'react'
//import { useNavigate } from 'react-router-dom';


import './styles.scss';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  isOutlined?: boolean
};

export function Button({ isOutlined = false, ...props }: ButtonProps) {
  return (
    <button
      className={`login button ${isOutlined ? 'login outlined' : ''}`}
      {...props}
    />
  )
}