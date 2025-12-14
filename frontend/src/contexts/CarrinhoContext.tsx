'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ItemCarrinho, Carrinho, Produto, TipoFornecedor } from '@/types';
import toast from 'react-hot-toast';

interface CarrinhoContextType {
  carrinho: Carrinho;
  adicionarItem: (
    produtorId: string,
    produtorNome: string,
    produto: Produto,
    quantidade: number,
    tipoFornecedor: TipoFornecedor
  ) => boolean;
  removerItem: (produtorId: string, produtoNome: string) => void;
  atualizarQuantidade: (produtorId: string, produtoNome: string, quantidade: number) => void;
  limparCarrinho: () => void;
  totalItens: number;
  tipoCarrinho: TipoFornecedor | null;
}

const CarrinhoContext = createContext<CarrinhoContextType | undefined>(undefined);

export function CarrinhoProvider({ children }: { children: ReactNode }) {
  const [carrinho, setCarrinho] = useState<Carrinho>({
    itens: [],
    total: 0,
    tipoFornecedor: null,
  });

  const calcularTotal = (itens: ItemCarrinho[]): number => {
    return itens.reduce((acc, item) => {
      return acc + item.produto.preco_unitario * item.quantidade;
    }, 0);
  };

  const adicionarItem = (
    produtorId: string,
    produtorNome: string,
    produto: Produto,
    quantidade: number,
    tipoFornecedor: TipoFornecedor
  ): boolean => {
    // Verificar se está tentando misturar tipos de fornecedor
    if (carrinho.tipoFornecedor && carrinho.tipoFornecedor !== tipoFornecedor) {
      const tipoAtual =
        carrinho.tipoFornecedor === 'agricultura_familiar'
          ? 'Agricultura Familiar (30% PNAE)'
          : 'Fornecedores (70%)';
      const tipoNovo =
        tipoFornecedor === 'agricultura_familiar'
          ? 'Agricultura Familiar (30% PNAE)'
          : 'Fornecedores (70%)';

      toast.error(
        `Não é possível misturar compras! Seu carrinho contém itens de ${tipoAtual}. Finalize ou limpe o carrinho antes de adicionar itens de ${tipoNovo}.`,
        { duration: 5000 }
      );
      return false;
    }

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
          { produtorId, produtorNome, produto, quantidade, tipoFornecedor },
        ];
      }

      return {
        itens: novosItens,
        total: calcularTotal(novosItens),
        tipoFornecedor: tipoFornecedor,
      };
    });

    // Toast fora do setCarrinho para evitar duplicação no React Strict Mode
    const emoji = tipoFornecedor === 'agricultura_familiar' ? '🌱' : '🏭';
    toast.success(`${produto.nome} adicionado ao carrinho! ${emoji}`);

    return true;
  };

  const removerItem = (produtorId: string, produtoNome: string) => {
    setCarrinho((prev) => {
      const novosItens = prev.itens.filter(
        (item) => !(item.produtorId === produtorId && item.produto.nome === produtoNome)
      );

      return {
        itens: novosItens,
        total: calcularTotal(novosItens),
        tipoFornecedor: novosItens.length > 0 ? prev.tipoFornecedor : null,
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
        tipoFornecedor: prev.tipoFornecedor,
      };
    });
  };

  const limparCarrinho = () => {
    setCarrinho({ itens: [], total: 0, tipoFornecedor: null });
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
        tipoCarrinho: carrinho.tipoFornecedor,
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
