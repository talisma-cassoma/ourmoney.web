import { zodResolver } from '@hookform/resolvers/zod';
import * as Dialog from '@radix-ui/react-dialog';
import * as Tabs from '@radix-ui/react-tabs';
import { Box } from '@radix-ui/themes';
import { ArrowCircleDown, ArrowCircleUp, X } from 'phosphor-react';
import { Controller, useForm } from 'react-hook-form';
import { useContextSelector } from 'use-context-selector';
import { z } from 'zod';
import { TransactionsContext } from '../../contexts/TransactionsContext';
import './styles.scss';
import {
  CloseButton,
  Content,
  Overlay,
  TransactionType,
  TransactionTypeButton,
  StyledTabsTrigger,
  StyledTabsList
} from './styles'

const newTransactionFormSchema = z.object({
  description: z.string(),
  price: z.number(),
  category: z.string(),
  type: z.enum(['income', 'outcome']),
})

type NewTransactionFormInputs = z.infer<typeof newTransactionFormSchema>

type CreateTransactionInput = {
  description: string;
  price: number;
  category: string;
  type: 'income' | 'outcome';
  owner: string;
  email: string;
}


export function NewTransactionModal() {
  
  const createTransaction = useContextSelector(
    TransactionsContext,
    (context) => {
      return context.createTransaction
    },
  )

  const {
    control,
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm<NewTransactionFormInputs>({
    resolver: zodResolver(newTransactionFormSchema),
    defaultValues: {
      type: 'income',
    },
  })

  async function handleCreateNewTransaction(data: NewTransactionFormInputs) {
    const { description, price, category, type } = data

    await createTransaction({
      description,
      price,
      category,
      type,
      owner: "talis",
      email: "talis@gmail.com",
    } as CreateTransactionInput)

    reset()
  }

  return (
    <Dialog.Portal>
      <Overlay />

      <Content>
        {/* <Dialog.Title>Nova Transação</Dialog.Title> */}

        <CloseButton>
          <X size={24} />
        </CloseButton>
        <Tabs.Root defaultValue="transação">
          <StyledTabsList>
            <StyledTabsTrigger value="transação">Nova Transação</StyledTabsTrigger>
            <StyledTabsTrigger value="objectivo">Novo Objetivo</StyledTabsTrigger>
          </StyledTabsList>
          <Box px="2" pt="2" pb="2" className="Box" >
            <Tabs.Content value="transação">
              <form onSubmit={handleSubmit(handleCreateNewTransaction)}>
                <input
                  type="text"
                  placeholder="Descrição"
                  required
                  {...register('description')}
                />
                <input
                  type="number"
                  step=".01"
                  placeholder="Preço"
                  required
                  {...register('price', { valueAsNumber: true })}
                />
                <input
                  type="text"
                  placeholder="Categoria"
                  required
                  {...register('category')}
                />

                <Controller
                  control={control}
                  name="type"
                  render={({ field }) => {
                    return (
                      <TransactionType
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <TransactionTypeButton variant="income" value="income">
                          <ArrowCircleUp size={24} />
                          Entrada
                        </TransactionTypeButton>
                        <TransactionTypeButton variant="outcome" value="outcome">
                          <ArrowCircleDown size={24} />
                          Saída
                        </TransactionTypeButton>
                      </TransactionType>
                    )
                  }}
                />

                <button type="submit" disabled={isSubmitting}>
                  Cadastrar
                </button>
              </form>
            </Tabs.Content>
            <Tabs.Content value="objectivo">
              <form onSubmit={() => { console.log("novo objectivo") }}>
                <input
                  type="text"
                  placeholder="Descrição"
                  required
                  {...register('description')}
                />
                <input
                  type="number"
                  step=".01"
                  placeholder="Preço"
                  required
                  {...register('price', { valueAsNumber: true })}
                />
                <input
                  type="text"
                  placeholder="Categoria"
                  required
                  {...register('category')}
                />

                <button type="submit" disabled={isSubmitting}>
                  Cadastrar
                </button>
              </form>
            </Tabs.Content>
          </Box>
        </Tabs.Root>
      </Content>
    </Dialog.Portal>
  )
}