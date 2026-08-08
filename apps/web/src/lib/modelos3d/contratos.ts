export type FormatoModelo3D = '3mf' | 'glb';

/** Dados e arquivos entregues ao repositório para criar um modelo. */
export interface NovoModelo3D {
  nome: string;
  nomeArquivo: string;
  triangulos: number;
  arquivo3mf: Uint8Array;
  arquivoGlb: Uint8Array;
}

/** Metadados leves de um modelo já armazenado. */
export interface Modelo3D {
  id: string;
  nome: string;
  nomeArquivo: string;
  triangulos: number;
  criadoEm: string;
}

/** Fronteira substituível entre a aplicação e o armazenamento dos modelos. */
export interface RepositorioModelos3D {
  salvar(modelo: NovoModelo3D): Promise<Modelo3D>;
  listar(): Promise<Modelo3D[]>;
  lerArquivo(id: string, formato: FormatoModelo3D): Promise<Uint8Array | null>;
}
