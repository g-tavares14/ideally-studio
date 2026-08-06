'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import type { Produto } from '@cria-forma/shared';
import { useConfigProduto, type ConfigProduto } from '../features/produto/useConfigProduto';
import { useSacola, type Sacola } from '../features/sacola/useSacola';
import { gerarThumbs } from '../scene/thumbs';
import type { Thumbs } from '../types';

/**
 * O estado que atravessa rotas.
 *
 * Com o Canvas da moldura ou da home e os painéis nas rotas, a sacola, a
 * configuração do produto e o catálogo passaram a ter leitores em árvores
 * diferentes — daí o contexto. Não é estado global por preguiça: é o mínimo
 * que precisa sobreviver à navegação.
 */

const SacolaCtx = createContext<Sacola | null>(null);
const ConfigCtx = createContext<ConfigProduto | null>(null);
const ProdutosCtx = createContext<Produto[]>([]);
const ThumbsCtx = createContext<Thumbs>({});

export function Provedores({
  children,
  corPeca,
  produtos,
}: {
  children: ReactNode;
  corPeca: string;
  produtos: Produto[];
}) {
  const sacola = useSacola();
  const config = useConfigProduto();
  const pathname = usePathname();
  const [thumbs, setThumbs] = useState<Thumbs>({});
  const precisaThumbs = pathname.startsWith('/catalogo') || pathname.startsWith('/produto/');

  // As miniaturas saem de um renderer próprio, fora de tela. Só são criadas
  // quando catálogo ou produto precisam delas; a hero inicial não deve pagar
  // o custo de um segundo contexto WebGL.
  useEffect(() => {
    if (!precisaThumbs) return;

    // Os 60 ms adiam a criação do segundo contexto WebGL para depois do
    // primeiro quadro do Canvas.
    const t = window.setTimeout(() => setThumbs(gerarThumbs(corPeca, produtos)), 60);
    return () => window.clearTimeout(t);
  }, [corPeca, produtos, precisaThumbs]);

  return (
    <SacolaCtx.Provider value={sacola}>
      <ConfigCtx.Provider value={config}>
        <ProdutosCtx.Provider value={produtos}>
          <ThumbsCtx.Provider value={precisaThumbs ? thumbs : {}}>{children}</ThumbsCtx.Provider>
        </ProdutosCtx.Provider>
      </ConfigCtx.Provider>
    </SacolaCtx.Provider>
  );
}

export function useSacolaCtx() {
  const v = useContext(SacolaCtx);
  if (!v) throw new Error('useSacolaCtx precisa estar dentro de <Provedores>');
  return v;
}

export function useConfigCtx() {
  const v = useContext(ConfigCtx);
  if (!v) throw new Error('useConfigCtx precisa estar dentro de <Provedores>');
  return v;
}

export function useProdutosCtx() {
  return useContext(ProdutosCtx);
}

export function useThumb() {
  const thumbs = useContext(ThumbsCtx);
  return useMemo(() => (id: string) => thumbs[id] || '', [thumbs]);
}
