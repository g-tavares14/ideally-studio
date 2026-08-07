'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import type { Produto } from '@cria-forma/shared';
import { Provedores, useSacolaCtx } from './contextos';
import { cor as paleta, fonte } from '../styles/tokens';
import Nav from '../ui/Nav';
import RouteTransition from '../ui/RouteTransition';
import Sacola from '../ui/Sacola';

export interface ShellProps {
  children: ReactNode;
  produtos: Produto[];
}

export default function Shell({ children, produtos }: ShellProps) {
  return (
    <Provedores produtos={produtos}>
      <Moldura>{children}</Moldura>
    </Provedores>
  );
}

/**
 * A moldura fixa: navegação, conteúdo da rota e gaveta da sacola.
 *
 * O Canvas do editor vive na página de produto. Assim o catálogo pode ser
 * explorado sem abrir um contexto WebGL persistente e cada edição tem uma
 * superfície 3D claramente associada à peça escolhida.
 */
function Moldura({ children }: { children: ReactNode }) {
  const [sacolaAberta, setSacolaAberta] = useState(false);
  const sacola = useSacolaCtx();

  const temaNav = usePathname().startsWith('/sobre') ? 'escuro' : 'claro';

  return (
    <div
      className="cf-shell"
      style={{
        position: 'relative',
        width: '100%',
        overflow: 'hidden',
        background: paleta.creme,
        fontFamily: fonte.sans,
        color: paleta.tinta,
        userSelect: 'none',
      }}
    >
      <Nav
        tema={temaNav}
        qtdSacola={sacola.itens.length}
        abrirSacola={() => setSacolaAberta(true)}
      />

      <main className="cf-route-content">
        <RouteTransition>{children}</RouteTransition>
      </main>

      {sacolaAberta && (
        <Sacola
          itens={sacola.itens}
          total={sacola.total}
          remover={sacola.remover}
          fechar={() => setSacolaAberta(false)}
        />
      )}
    </div>
  );
}
