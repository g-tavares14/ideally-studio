'use client';

import dynamic from 'next/dynamic';
import { usePathname, useRouter } from 'next/navigation';
import { useAnimate, useReducedMotion } from 'motion/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { useConfigCtx, useProdutosCtx } from '../app/contextos';

const Cena = dynamic(() => import('../scene/Cena'), { ssr: false });

type StageMode = 'hero' | 'showroom';

interface Props {
  hero: ReactNode;
  showroom: ReactNode;
}

interface AnimationControl {
  stop: () => void;
}

const DURACAO = 0.72;

/**
 * Palco persistente da home. Hero, showroom e Canvas ficam na mesma árvore;
 * apenas a composição visual muda. Isso deixa a interação interrompível sem
 * depender de uma animação de saída do App Router.
 */
export default function ExperienceStageClient({ hero, showroom }: Props) {
  const [scope, animate] = useAnimate();
  const [modo, setModo] = useState<StageMode>('hero');
  const modoRef = useRef<StageMode>('hero');
  const destinoRef = useRef<StageMode>('hero');
  const animacaoRef = useRef<AnimationControl | null>(null);
  const reduzido = useReducedMotion() === true;
  const pathname = usePathname();
  const router = useRouter();
  const produtos = useProdutosCtx();
  const config = useConfigCtx();

  const atualizarHash = useCallback(
    (destino: StageMode) => {
      if (typeof window === 'undefined' || pathname !== '/') return;
      const hash = destino === 'showroom' ? '#showroom' : '';
      const atual = window.location.hash;
      if (atual === hash) return;
      window.history.replaceState(null, '', hash || '/');
    },
    [pathname],
  );

  const irPara = useCallback(
    (destino: StageMode, sincronizarUrl = true) => {
      if (destino === destinoRef.current && destino === modoRef.current) return;

      destinoRef.current = destino;
      modoRef.current = destino;
      setModo(destino);
      if (sincronizarUrl) atualizarHash(destino);

      animacaoRef.current?.stop();

      const indoParaShowroom = destino === 'showroom';
      const fatorTempo = reduzido ? 0 : 1;
      const controles = animate([
        [
          '.cf-experience-stage__hero-layer',
          { opacity: indoParaShowroom ? 0 : 1, y: indoParaShowroom ? -38 : 0 },
          { duration: DURACAO * 0.72 * fatorTempo, ease: [0.22, 1, 0.36, 1] },
        ],
        [
          '.cf-experience-stage__canvas-layer',
          { opacity: indoParaShowroom ? 1 : 0.2, scale: indoParaShowroom ? 1 : 1.04 },
          { duration: DURACAO * fatorTempo, ease: [0.16, 1, 0.3, 1], at: 0.08 },
        ],
        [
          '.cf-experience-stage__showroom-layer',
          { opacity: indoParaShowroom ? 1 : 0, y: indoParaShowroom ? 0 : 26 },
          {
            duration: DURACAO * 0.7 * fatorTempo,
            ease: [0.22, 1, 0.36, 1],
            at: 0.24,
          },
        ],
      ]);

      animacaoRef.current = controles;
    },
    [animate, atualizarHash, reduzido],
  );

  useEffect(() => {
    const sincronizarHash = () => {
      irPara(window.location.hash === '#showroom' ? 'showroom' : 'hero', false);
    };

    window.addEventListener('hashchange', sincronizarHash);
    if (window.location.hash === '#showroom') {
      const frame = window.requestAnimationFrame(() => irPara('showroom', false));
      return () => {
        window.cancelAnimationFrame(frame);
        window.removeEventListener('hashchange', sincronizarHash);
      };
    }

    return () => window.removeEventListener('hashchange', sincronizarHash);
  }, [irPara]);

  useEffect(() => () => animacaoRef.current?.stop(), []);

  const tratarRoda = (evento: React.WheelEvent<HTMLDivElement>) => {
    if (Math.abs(evento.deltaY) < 18) return;
    evento.preventDefault();
    if (evento.deltaY > 0 && modoRef.current === 'hero') irPara('showroom');
    if (evento.deltaY < 0 && modoRef.current === 'showroom') irPara('hero');
  };

  const tratarTeclado = (evento: React.KeyboardEvent<HTMLDivElement>) => {
    if (evento.key === 'ArrowDown' || evento.key === 'PageDown') {
      evento.preventDefault();
      irPara('showroom');
    }
    if (evento.key === 'ArrowUp' || evento.key === 'PageUp') {
      evento.preventDefault();
      irPara('hero');
    }
  };

  return (
    <div
      ref={scope}
      className="cf-experience-stage"
      tabIndex={0}
      onKeyDown={tratarTeclado}
      onWheel={tratarRoda}
      role="region"
      aria-label="Experiência Ideally Studio 3D"
    >
      <div
        className="cf-experience-stage__canvas-layer"
        style={{ pointerEvents: modo === 'showroom' ? 'auto' : 'none' }}
      >
        <Cena
          ambiente="Claro"
          autoOrbit
          corPeca="#E4DFD2"
          produtos={produtos}
          screen="showroom"
          sel={null}
          mat={config.mat}
          cor={config.cor}
          tam={config.tam}
          intro={modo === 'hero'}
          movimentoReduzido={reduzido}
          onPick={(i: number) => {
            config.reiniciar();
            router.push('/produto/' + produtos[i].id);
          }}
        />
      </div>

      <section
        className="cf-experience-stage__hero-layer"
        aria-hidden={modo !== 'hero'}
        inert={modo !== 'hero' ? true : undefined}
        style={{ pointerEvents: modo === 'hero' ? 'auto' : 'none' }}
      >
        {hero}
      </section>

      <section
        id="showroom"
        className="cf-experience-stage__showroom-layer"
        aria-hidden={modo !== 'showroom'}
        inert={modo !== 'showroom' ? true : undefined}
        style={{ pointerEvents: 'none' }}
      >
        {showroom}
      </section>
    </div>
  );
}
