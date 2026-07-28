'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useParams, usePathname, useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import type { Produto } from '@cria-forma/shared';
import { Provedores, useConfigCtx, useSacolaCtx } from './contextos';
import { cor as paleta, fonte } from '../styles/tokens';
import Nav from '../ui/Nav';
import Sacola from '../ui/Sacola';
import type { Ambiente, Screen } from '../types';

// A cena cria contexto WebGL e mede a janela, então não sobrevive à
// prerenderização no servidor. `ssr: false` a mantém estritamente no cliente.
const Cena = dynamic(() => import('../scene/Cena'), { ssr: false });

export interface ShellProps {
  children: ReactNode;
  produtos: Produto[];
  ambiente?: Ambiente;
  autoOrbit?: boolean;
  corPeca?: string;
}

export default function Shell({
  children,
  produtos,
  ambiente = 'Claro',
  autoOrbit = true,
  corPeca = '#E4DFD2',
}: ShellProps) {
  return (
    <Provedores corPeca={corPeca} produtos={produtos}>
      <Moldura produtos={produtos} ambiente={ambiente} autoOrbit={autoOrbit} corPeca={corPeca}>
        {children}
      </Moldura>
    </Provedores>
  );
}

/**
 * A moldura fixa: o `<Canvas>`, a navegação e a gaveta da sacola.
 *
 * Isto vive no layout, e não numa página, de propósito. No App Router o layout
 * persiste entre navegações — se o `<Canvas>` estivesse numa página, cada
 * clique entre `/`, `/catalogo` e `/produto/vaso` destruiria e recriaria o
 * contexto WebGL e toda a geometria.
 */
function Moldura({
  children,
  produtos,
  ambiente,
  autoOrbit,
  corPeca,
}: {
  children: ReactNode;
  produtos: Produto[];
  ambiente: Ambiente;
  autoOrbit: boolean;
  corPeca: string;
}) {
  const [sacolaAberta, setSacolaAberta] = useState(false);
  const sacola = useSacolaCtx();
  const config = useConfigCtx();
  const router = useRouter();

  const { screen, sel } = telaDaRota(usePathname(), useParams(), produtos);

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        minHeight: 720,
        overflow: 'hidden',
        background: paleta.creme,
        fontFamily: fonte.sans,
        color: paleta.tinta,
        userSelect: 'none',
      }}
    >
      <Cena
        ambiente={ambiente}
        autoOrbit={autoOrbit}
        corPeca={corPeca}
        produtos={produtos}
        screen={screen}
        sel={sel}
        mat={config.mat}
        cor={config.cor}
        tam={config.tam}
        onPick={(i: number) => {
          // `router.push`, nunca `location.assign`: navegação de cliente é o
          // que preserva o contexto WebGL entre as rotas.
          config.reiniciar();
          router.push('/produto/' + produtos[i].id);
        }}
      />

      <Nav qtdSacola={sacola.itens.length} abrirSacola={() => setSacolaAberta(true)} />

      {children}

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

/**
 * A rota ativa traduzida no recorte que a cena entende.
 *
 * Substitui a antiga máquina de estados `screen`: as props da cena continuam
 * sendo props comuns, só mudou de onde vêm.
 */
function telaDaRota(
  pathname: string,
  params: ReturnType<typeof useParams>,
  produtos: Produto[],
): { screen: Screen; sel: number | null } {
  if (pathname.startsWith('/produto/')) {
    const slug = typeof params.slug === 'string' ? params.slug : '';
    const i = produtos.findIndex((p) => p.id === slug);
    return { screen: 'produto', sel: i >= 0 ? i : null };
  }
  if (pathname.startsWith('/catalogo')) return { screen: 'catalogo', sel: null };
  if (pathname.startsWith('/sobre')) return { screen: 'sobre', sel: null };
  return { screen: 'showroom', sel: null };
}
