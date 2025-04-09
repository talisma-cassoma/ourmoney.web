import { api } from "../../lib/axios";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import {
  Overlay,
  Content,
  Title,
  Description,
  RedButton,
  MauveButton,
} from './styles';

interface DeleteTransactionButtonProps {
  transactionId: string;
  onDelete?: () => void;
}

export function DeleteTransactionButton({ transactionId, onDelete }: DeleteTransactionButtonProps) {
  const token = localStorage.getItem("authToken");

  const handleDelete = async () => {
    try {
      await api.delete(`transactions/${transactionId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (onDelete) onDelete();
    } catch (error) {
      console.error("Erro ao excluir transação:", error);
      alert("Erro ao excluir transação. Tente novamente.");
    }
  };

  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger asChild>
        <button aria-label="Excluir transação">
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#BB271A">
            <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
          </svg>
        </button>
      </AlertDialog.Trigger>

      <AlertDialog.Portal>
        <Overlay />
        <Content>
          <Title>Tem certeza que deseja excluir?</Title>
          <Description>
            Essa ação não pode ser desfeita. A transação será removida permanentemente.
          </Description>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <AlertDialog.Cancel asChild>
              <MauveButton>Cancelar</MauveButton>
            </AlertDialog.Cancel>
            <AlertDialog.Action asChild>
              <RedButton onClick={handleDelete}>Sim, excluir</RedButton>
            </AlertDialog.Action>
          </div>
        </Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
