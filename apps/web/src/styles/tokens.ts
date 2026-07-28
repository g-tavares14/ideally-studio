import type { CSSProperties } from 'react';

/**
 * Tokens visuais da interface 2D.
 *
 * As cores da cena (fundo, chão, parede, os presets de `Ambiente`) **não**
 * estão aqui: são constantes de cena e vivem no `Palco.tsx`, como manda o
 * CLAUDE.md. Este arquivo cobre só o que os componentes de `ui/` desenham.
 */

export const cor = {
  /** azul-marinho principal da Ideally Studio 3D */
  azul: '#001E5A',
  /** laranja da marca, usado em destaques e ações */
  laranja: '#F36C21',
  /** cor principal de texto e superfícies escuras */
  tinta: '#001E5A',
  /** fundo quente do site */
  creme: '#FFF8F2',
  /** papel dos painéis sobrepostos */
  papel: '#FFFFFF',
  /** bordas e divisórias sobre o claro */
  linha: '#CBD5E5',
  /** divisória mais suave, dentro da sacola */
  linhaSuave: '#E1E7F0',
  /** texto secundário e rótulos */
  suave: '#66738C',
  /** texto corrido secundário */
  texto: '#44516A',
  /** alias legado para usos de acento */
  terracota: '#F36C21',
  /** fundo da opção escolhida no configurador */
  selecionado: '#EAF0F8',
  /** fundo das miniaturas no catálogo e na sacola */
  ladrilho: '#EDF2F8',
  /** véu sobre a cena quando a sacola abre */
  veu: 'rgba(0,30,90,0.38)',

  /** divisória sobre o fundo escuro do Ateliê */
  linhaEscura: '#365488',
  /** texto corrido sobre o fundo escuro do Ateliê */
  textoEscuro: '#C9D6EB',
} as const;

export const fonte = {
  /** marca, títulos e valores */
  display: 'var(--fonte-display), Montserrat, system-ui, sans-serif',
  /** alias mantido para os componentes existentes */
  serif: 'var(--fonte-display), Montserrat, system-ui, sans-serif',
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
