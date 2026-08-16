export interface Produto {
  id: string;
  nome: string;
  cat: string;
  preco: number;
  /** altura física do tamanho M, em centímetros */
  alturaCm: number;
  prazo: string;
  desc: string;
}

export interface Material {
  id: string;
  nome: string;
  /** acréscimo em reais sobre o preço base */
  delta: number;
  rough: number;
  metal: number;
}

export interface Cor {
  nome: string;
  hex: string;
}

export interface Tamanho {
  id: string;
  nome: string;
  cm: string;
  /** multiplicador de preço */
  mult: number;
  /** escala aplicada à peça na cena */
  fator: number;
}
