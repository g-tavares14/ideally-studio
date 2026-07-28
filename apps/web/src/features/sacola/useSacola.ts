'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import type { ItemSacola } from '@cria-forma/shared';

export interface Sacola {
  itens: ItemSacola[];
  total: number;
  adicionar: (item: Omit<ItemSacola, 'key'>) => void;
  remover: (key: number) => void;
}

export function useSacola(): Sacola {
  const [itens, setItens] = useState<ItemSacola[]>([]);

  // Contador, não `Date.now()`: duas adições no mesmo milissegundo geravam a
  // mesma chave, e aí `remover` apagava as duas linhas de uma vez — além de
  // dar chaves duplicadas ao React.
  const proximaChave = useRef(0);

  const adicionar = useCallback((item: Omit<ItemSacola, 'key'>) => {
    setItens((atual) => atual.concat({ ...item, key: proximaChave.current++ }));
  }, []);

  const remover = useCallback((key: number) => {
    setItens((atual) => atual.filter((i) => i.key !== key));
  }, []);

  const total = useMemo(() => itens.reduce((soma, i) => soma + i.preco, 0), [itens]);

  return { itens, total, adicionar, remover };
}
