'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ItemCarrinho, Carrinho, Produto } from '@/types';
import toast from 'react-hot-toast';

interface CarrinhoContextType {
  carrinho: Carrinho;
  adicionarItem: (produtorId: string, produtorNome: string, produto: Produto, quantidade: number) => void;
  removerItem: (produtorId: string, produtoNome: string) => void;
  atualizarQuantidade: (produtorId: string, produtoNome: string, quantidade: number) => void;
  limparCarrinho: () => void;
  totalItens: number;
}

const CarrinhoContext = createContext<CarrinhoContextType | undefined>(undefined);

export function CarrinhoProvider({ children }: { children: ReactNode }) {
  const [carrinho, setCarrinho] = useState<Carrinho>({ itens: [], total: 0 });

  const calcularTotal = (itens: ItemCarrinho[]): number => {
    return itens.reduce((acc, item) => {
      return acc + item.produto.preco_unitario * item.quantidade;
    }, 0);
  };

  const adicionarItem = (
    produtorId: string,
    produtorNome: string,
    produto: Produto,
    quantidade: number
  ) => {
    setCarrinho((prev) => {
      // Verificar se o item já existe
      const existingIndex = prev.itens.findIndex(
        (item) => item.produtorId === produtorId && item.produto.nome === produto.nome
      );

      let novosItens: ItemCarrinho[];

      if (existingIndex >= 0) {
        // Atualizar quantidade
        novosItens = [...prev.itens];
        novosItens[existingIndex].quantidade += quantidade;
      } else {
        // Adicionar novo item
        novosItens = [
          ...prev.itens,
          { produtorId, produtorNome, produto, quantidade },
        ];
      }

      toast.success(`${produto.nome} adicionado ao carrinho! 🛒`);

      return {
        itens: novosItens,
        total: calcularTotal(novosItens),
      };
    });
  };

  const removerItem = (produtorId: string, produtoNome: string) => {
    setCarrinho((prev) => {
      const novosItens = prev.itens.filter(
        (item) => !(item.produtorId === produtorId && item.produto.nome === produtoNome)
      );

      return {
        itens: novosItens,
        total: calcularTotal(novosItens),
      };
    });
    toast.success('Item removido do carrinho');
  };

  const atualizarQuantidade = (
    produtorId: string,
    produtoNome: string,
    quantidade: number
  ) => {
    if (quantidade <= 0) {
      removerItem(produtorId, produtoNome);
      return;
    }

    setCarrinho((prev) => {
      const novosItens = prev.itens.map((item) => {
        if (item.produtorId === produtorId && item.produto.nome === produtoNome) {
          return { ...item, quantidade };
        }
        return item;
      });

      return {
        itens: novosItens,
        total: calcularTotal(novosItens),
      };
    });
  };

  const limparCarrinho = () => {
    setCarrinho({ itens: [], total: 0 });
    toast.success('Carrinho limpo!');
  };

  const totalItens = carrinho.itens.reduce((acc, item) => acc + item.quantidade, 0);

  return (
    <CarrinhoContext.Provider
      value={{
        carrinho,
        adicionarItem,
        removerItem,
        atualizarQuantidade,
        limparCarrinho,
        totalItens,
      }}
    >
      {children}
    </CarrinhoContext.Provider>
  );
}

export function useCarrinho() {
  const context = useContext(CarrinhoContext);
  if (context === undefined) {
    throw new Error('useCarrinho deve ser usado dentro de um CarrinhoProvider');
  }
  return context;
}
