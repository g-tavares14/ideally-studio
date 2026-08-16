import type { Cor, Material, Produto, Tamanho } from './tipos';

/**
 * Catálogo semente.
 *
 * Hoje é a única fonte de dados do site. Na fase do banco este mesmo módulo
 * alimenta o `prisma/seed.ts` — por isso vive no pacote compartilhado, e não
 * dentro do app.
 */

export const PRODUTOS: Produto[] = [
  {
    id: 'vaso',
    nome: 'Vaso de Flores',
    cat: 'Decoração',
    preco: 320,
    alturaCm: 24,
    prazo: '5 dias',
    desc: 'Vaso torneado em espiral contínua, com parede fina e boca aberta. Impresso em vaso mode, sem costura, e selado por dentro para receber água.',
  },
  {
    id: 'anel',
    nome: 'Porta-Guardanapo Gravado',
    cat: 'Mesa',
    preco: 90,
    alturaCm: 5,
    prazo: '2 dias',
    desc: 'Anel com faixa gravada em relevo no meio, entre dois frisos. Vendido na unidade — o jogo de quatro sai com desconto no checkout.',
  },
  {
    id: 'guardanapo',
    nome: 'Suporte para Guardanapo',
    cat: 'Mesa',
    preco: 160,
    alturaCm: 11,
    prazo: '3 dias',
    desc: 'Base plana com dois arcos verticais que seguram o maço de guardanapos de papel sem deixá-lo voar.',
  },
  {
    id: 'controle',
    nome: 'Suporte para Controle',
    cat: 'Utilitário',
    preco: 210,
    alturaCm: 16,
    prazo: '4 dias',
    desc: 'Berço em arco sobre haste única, dimensionado para controles de console. Base com peso interno e pés de silicone.',
  },
  {
    id: 'trama',
    nome: 'Escultura Trama',
    cat: 'Decoração',
    preco: 480,
    alturaCm: 19,
    prazo: '8 dias',
    desc: 'Um único tubo trançado sobre si mesmo, impresso em peça inteira com suporte dissolvido em água.',
  },
  {
    id: 'orbita',
    nome: 'Órbita',
    cat: 'Decoração',
    preco: 420,
    alturaCm: 21,
    prazo: '6 dias',
    desc: 'Anel e esfera em equilíbrio deslocado. Duas peças impressas separadamente e encaixadas por pressão.',
  },
];

export const MATERIAIS: Material[] = [
  { id: 'pla', nome: 'PLA fosco', delta: 0, rough: 0.85, metal: 0 },
  { id: 'resina', nome: 'Resina cerâmica', delta: 90, rough: 0.35, metal: 0.05 },
  { id: 'metal', nome: 'Deposição metálica', delta: 240, rough: 0.22, metal: 0.95 },
];

export const CORES: Cor[] = [
  { nome: 'Osso', hex: '#E4DFD2' },
  { nome: 'Grafite', hex: '#2B2B2D' },
  { nome: 'Argila', hex: '#A8563A' },
  { nome: 'Sálvia', hex: '#7E8A73' },
];

export const TAMANHOS: Tamanho[] = [
  { id: 'p', nome: 'P', cm: '−30%', mult: 0.7, fator: 0.78 },
  { id: 'm', nome: 'M', cm: 'padrão', mult: 1, fator: 1 },
  { id: 'g', nome: 'G', cm: '+40%', mult: 1.4, fator: 1.45 },
];

export const FILTROS = ['Tudo', 'Decoração', 'Mesa', 'Utilitário'];
