'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Produto } from '@cria-forma/shared';
import { useConfigCtx, useThumb } from '../contextos';
import Catalogo from '../../ui/Catalogo';

export default function CatalogoCliente({ produtos }: { produtos: Produto[] }) {
  const [filtro, setFiltro] = useState('Tudo');
  const thumb = useThumb();
  const config = useConfigCtx();
  const router = useRouter();

  return (
    <Catalogo
      produtos={produtos}
      filtro={filtro}
      escolherFiltro={setFiltro}
      thumb={thumb}
      abrir={(produto) => {
        config.reiniciar();
        router.push('/produto/' + produto.id);
      }}
    />
  );
}
