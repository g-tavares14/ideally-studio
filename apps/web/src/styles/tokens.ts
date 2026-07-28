import type { CSSProperties } from 'react';

/**
 * Tokens visuais da interface 2D.
 *
 * As cores da cena (fundo, chão, parede, os presets de `Ambiente`) **não**
 * estão aqui: são constantes de cena e vivem no `Palco.tsx`, como manda o
 * CLAUDE.md. Este arquivo cobre só o que os componentes de `ui/` desenham.
 */

export const cor = {
  /** preto esverdeado do texto e das superfícies escuras */
  tinta: '#14140F',
  /** creme do fundo do site */
  creme: '#EFEDE6',
  /** papel dos painéis sobrepostos, um tom acima do creme */
  papel: '#F6F4EF',
  /** bordas e divisórias sobre o claro */
  linha: '#DFDACE',
  /** divisória mais suave, dentro da sacola */
  linhaSuave: '#E4E0D5',
  /** texto secundário e rótulos */
  suave: '#8A8578',
  /** texto corrido secundário, mais escuro que o suave */
  texto: '#55524A',
  /** o único acento quente: links, remover, hover do CTA */
  terracota: '#A8563A',
  /** fundo da opção escolhida no configurador */
  selecionado: '#E9E5DA',
  /** fundo das miniaturas no catálogo e na sacola */
  ladrilho: '#E6E2D8',
  /** véu sobre a cena quando a sacola abre */
  veu: 'rgba(20,20,15,0.32)',

  /** divisória sobre o fundo escuro do Ateliê */
  linhaEscura: '#2E2E28',
  /** texto corrido sobre o fundo escuro do Ateliê */
  textoEscuro: '#B5B0A4',
} as const;

export const fonte = {
  /** títulos e valores */
  serif: 'var(--fonte-serif), Georgia, serif',
  /** todo o resto */
  sans: 'var(--fonte-sans), system-ui, sans-serif',
} as const;

/**
 * O rótulo miúdo em versalete que abre cada seção.
 *
 * O espaçamento varia de propósito entre os usos (0.2em nos painéis, 0.22em
 * no Ateliê e na marca, 0.24em na categoria do produto) — por isso é
 * parâmetro, e não um valor fixo.
 */
export const eyebrow = (espaco = '0.2em'): CSSProperties => ({
  fontSize: 10,
  letterSpacing: espaco,
  textTransform: 'uppercase',
  color: cor.suave,
});
