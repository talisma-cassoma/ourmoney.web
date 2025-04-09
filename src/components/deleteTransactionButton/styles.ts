import styled from "styled-components";
import * as AlertDialog from "@radix-ui/react-alert-dialog";

/* Importação das cores do Radix */
import "@radix-ui/colors/black-alpha.css";
import "@radix-ui/colors/mauve.css";
import "@radix-ui/colors/red.css";
import "@radix-ui/colors/violet.css";

/* Reset do botão */
export const Button = styled.button`
  all: unset;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  padding: 0 15px;
  font-size: 15px;
  line-height: 1;
  font-weight: 500;
  height: 35px;
  user-select: none;

  &:focus-visible {
    outline: 2px solid var(--violet-6);
    outline-offset: 1px;
  }
`;

export const VioletButton = styled(Button)`
  background-color: var(--violet-4);
  color: var(--violet-12);
  outline-color: var(--violet-6);

  &:hover {
    background-color: var(--mauve-3);
  }
`;

export const RedButton = styled(Button)`
  background-color: var(--red-4);
  color: var(--red-11);
  outline-color: var(--red-7);

  &:hover {
    background-color: var(--red-5);
  }
`;

export const MauveButton = styled(Button)`
  background-color: var(--mauve-4);
  color: var(--mauve-11);
  outline-color: var(--mauve-7);

  &:hover {
    background-color: var(--mauve-5);
  }
`;

/* Estilizando o AlertDialog */
export const Overlay = styled(AlertDialog.Overlay)`
  background-color: var(--black-a9);
  position: fixed;
  inset: 0;
  animation: overlayShow 150ms cubic-bezier(0.16, 1, 0.3, 1);
`;

export const Content = styled(AlertDialog.Content)`
  background-color: white;
  border-radius: 6px;
  box-shadow: var(--shadow-6);
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90vw;
  max-width: 500px;
  max-height: 85vh;
  padding: 25px;
  animation: contentShow 150ms cubic-bezier(0.16, 1, 0.3, 1);

  &:focus {
    outline: none;
  }
`;

export const Title = styled(AlertDialog.Title)`
  margin: 0;
  color: var(--mauve-12);
  font-size: 17px;
  font-weight: 500;
`;

export const Description = styled(AlertDialog.Description)`
  margin-bottom: 20px;
  color: var(--mauve-11);
  font-size: 15px;
  line-height: 1.5;
`;

/* Animações */
export const GlobalStyles = styled.div`
  @keyframes overlayShow {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes contentShow {
    from {
      opacity: 0;
      transform: translate(-50%, -48%) scale(0.96);
    }
    to {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1);
    }
  }
`;


