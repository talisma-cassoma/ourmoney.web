import styled from 'styled-components'
import * as Dialog from '@radix-ui/react-dialog'
import * as RadioGroup from '@radix-ui/react-radio-group'
import * as Tabs from '@radix-ui/react-tabs';


export const Overlay = styled(Dialog.Overlay)`
  position: fixed;
  width: 100vw;
  height: 100vh;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
`
export const Title = styled(Dialog.Title)`
  padding: 2em;
`

export const Content = styled(Dialog.Content)`
  min-width: 32rem;
  border-radius: 6px;
  background: ${(props) => props.theme['gray-800']};
  
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  
  form {
    margin-top: 0rem;

    padding: 0.4rem 2.5rem 3rem 2.5rem;
    min-height:25rem;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    gap: 1rem;

    input {
      border-radius: 6px;
      border: 0;
      background: ${(props) => props.theme['gray-900']};
      color: ${(props) => props.theme['gray-300']};
      padding: 1rem;

      &::placeholder {
        color: ${(props) => props.theme['gray-500']};
      }
    }

    button[type='submit'] {
      diplay:grid;
      justify-self: center;
      height: 50px;
      border: 0;
      background: ${(props) => props.theme['green-500']};
      color: ${(props) => props.theme.white};
      font-weight: bold;
      padding: 0 1.25rem;
      border-radius: 6px;
      margin-top: 1.25rem;
      cursor: pointer;
      text-align: center;
  

      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      &:not(:disabled):hover {
        background: ${(props) => props.theme['green-700']};
        transition: background-color 0.2s;
      }
    }
  }
`

export const CloseButton = styled(Dialog.Close)`
  position: absolute;
  background: transparent;
  border: 0;
  top: 1em;
  right: 1em;
  line-height: 0;
  color: ${(props) => props.theme['gray-500']};
`

export const TransactionType = styled(RadioGroup.Root)`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-top: 0.5rem;
`

interface TransactionTypeButtonProps {
  variant: 'income' | 'outcome'
}

export const TransactionTypeButton = styled(
  RadioGroup.Item,
)<TransactionTypeButtonProps>`
  background: ${(props) => props.theme['gray-700']};
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border-radius: 6px;
  cursor: pointer;
  border: 0;
  color: ${(props) => props.theme['gray-300']};

  svg {
    color: ${(props) =>
      props.variant === 'income'
        ? props.theme['green-300']
        : props.theme['red-300']};
  }

  &[data-state='unchecked']:hover {
    transition: background-color 0.2s;
    background: ${(props) => props.theme['gray-600']};
  }

  &[data-state='checked'] {
    color: ${(props) => props.theme.white};
    background: ${(props) =>
      props.variant === 'income'
        ? props.theme['green-500']
        : props.theme['red-500']};

    svg {
      color: ${(props) => props.theme.white};
    }
  }
`

export const StyledTabsList = styled(Tabs.List)`
  display: flex;
  gap: 10px; /* Adjust the space between tabs as needed */
  padding-bottom: 0;
  height: fit-content;
  width: 100%;
  /*justify-content: space-between;*/
  
`;


export const StyledTabsTrigger = styled(Tabs.Trigger)`
  padding: 1.6rem 15px; /* Adjust padding as needed */
  cursor: pointer;
  border: 2px 2px solid black; /* Add border */
  border-radius: 6px; /* Adjust as needed */
  width:10m;

  &:focus {
    background-color: ${(props) => props.theme['gray-900']};
  }
`;