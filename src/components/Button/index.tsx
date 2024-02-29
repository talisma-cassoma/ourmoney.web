import { ButtonHTMLAttributes } from 'react'

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