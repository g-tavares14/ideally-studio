'use client';

import { BRL, CORES, MATERIAIS, precoDe } from '@cria-forma/shared';
import type { Produto } from '@cria-forma/shared';
import { useConfigCtx, useSacolaCtx, useThumb } from '../../contextos';
import ProdutoPanel from '../../../ui/ProdutoPanel';

export default function ProdutoCliente({ produto }: { produto: Produto }) {
  const config = useConfigCtx();
  const sacola = useSacolaCtx();
  const thumb = useThumb();

  const preco = precoDe(produto, config.mat, config.tam);

  const adicionar = () => {
    sacola.adicionar({
      nome: produto.nome,
      preco,
      thumb: thumb(produto.id),
      detalhe:
        MATERIAIS.find((m) => m.id === config.mat)!.nome +
        ' · ' +
        CORES[config.cor].nome +
        ' · tamanho ' +
        config.tam.toUpperCase(),
    });
    config.marcarAdicionado();
  };

  return (
    <ProdutoPanel
      p={produto}
      precoFmt={BRL(preco)}
      mat={config.mat}
      cor={config.cor}
      tam={config.tam}
      adicionado={config.adicionado}
      escolherMat={config.escolherMat}
      escolherCor={config.escolherCor}
      escolherTam={config.escolherTam}
      adicionar={adicionar}
    />
  );
}
