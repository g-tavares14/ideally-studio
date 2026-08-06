'use client';

import { motion, useReducedMotion } from 'motion/react';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

/**
 * Anima somente a entrada do conteúdo da rota. A moldura, o Canvas e a sacola
 * ficam fora daqui para não serem desmontados nem participarem da transição.
 * Sem uma animação de saída, uma navegação rápida sempre mostra a rota mais
 * recente em vez de acumular estados intermediários.
 */
export default function RouteTransition({ children }: Props) {
  const pathname = usePathname();
  const movimentoReduzido = useReducedMotion() === true;

  return (
    <motion.div
      key={pathname}
      className="cf-route-transition"
      initial={movimentoReduzido ? false : { opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: movimentoReduzido ? 0 : 0.28,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
