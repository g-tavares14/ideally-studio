import { Box3, Material, Mesh, Object3D, Texture, Vector3 } from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import { ThreeMFLoader } from 'three/examples/jsm/loaders/3MFLoader.js';
import { LIMITE_3MF_BYTES, LIMITE_GLB_BYTES, LIMITE_TRIANGULOS } from './limites';

function lerArquivo(arquivo: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const leitor = new FileReader();

    leitor.onerror = () => reject(leitor.error ?? new Error('Não foi possível ler o arquivo 3MF.'));
    leitor.onload = () => {
      if (!(leitor.result instanceof ArrayBuffer)) {
        reject(new Error('O arquivo 3MF não pôde ser lido como dados binários.'));
        return;
      }

      resolve(leitor.result);
    };

    leitor.readAsArrayBuffer(arquivo);
  });
}

function validarArquivo(arquivo: File): void {
  if (!/\.3mf$/i.test(arquivo.name)) {
    throw new Error('Selecione um arquivo com a extensão .3mf.');
  }

  if (arquivo.size === 0) {
    throw new Error('O arquivo 3MF está vazio.');
  }

  if (arquivo.size > LIMITE_3MF_BYTES) {
    throw new Error('O arquivo 3MF excede o limite de 25 MiB.');
  }
}

function contarEPrepararTriangulos(modelo: Object3D): number {
  let quantidadeDeMalhas = 0;
  let triangulos = 0;

  modelo.traverse((objeto) => {
    if (!(objeto instanceof Mesh)) return;

    quantidadeDeMalhas += 1;

    const geometria = objeto.geometry;
    const quantidadeDeIndicesOuVertices =
      geometria.index?.count ?? geometria.getAttribute('position')?.count ?? 0;

    if (quantidadeDeIndicesOuVertices < 3 || quantidadeDeIndicesOuVertices % 3 !== 0) {
      throw new Error('O arquivo 3MF contém uma malha inválida.');
    }

    if (!geometria.getAttribute('normal')) geometria.computeVertexNormals();

    triangulos += quantidadeDeIndicesOuVertices / 3;
    if (triangulos > LIMITE_TRIANGULOS) {
      throw new Error('O modelo excede o limite de 1.000.000 de triângulos.');
    }
  });

  if (quantidadeDeMalhas === 0) {
    throw new Error('O arquivo 3MF não contém malhas.');
  }

  return triangulos;
}

function validarDimensoes(modelo: Object3D): void {
  modelo.updateMatrixWorld(true);

  const caixa = new Box3().setFromObject(modelo);
  const dimensoes = caixa.getSize(new Vector3());
  const valores = [
    caixa.min.x,
    caixa.min.y,
    caixa.min.z,
    caixa.max.x,
    caixa.max.y,
    caixa.max.z,
    dimensoes.x,
    dimensoes.y,
    dimensoes.z,
  ];

  if (!valores.every(Number.isFinite)) {
    throw new Error('O modelo contém coordenadas ou dimensões inválidas.');
  }

  if (dimensoes.x <= 0 || dimensoes.y <= 0 || dimensoes.z <= 0) {
    throw new Error('O modelo precisa ter dimensões não nulas nos três eixos.');
  }
}

function descartarModelo(modelo: Object3D): void {
  const geometrias = new Set<Mesh['geometry']>();
  const materiais = new Set<Material>();
  const texturas = new Set<Texture>();

  modelo.traverse((objeto) => {
    if (!(objeto instanceof Mesh)) return;

    geometrias.add(objeto.geometry);
    const materiaisDaMalha = Array.isArray(objeto.material) ? objeto.material : [objeto.material];

    for (const material of materiaisDaMalha) {
      materiais.add(material);
      for (const valor of Object.values(material)) {
        if (valor instanceof Texture) texturas.add(valor);
      }
    }
  });

  for (const geometria of geometrias) geometria.dispose();
  for (const textura of texturas) textura.dispose();
  for (const material of materiais) material.dispose();
}

export async function converter3mfParaGlb(
  arquivo: File,
): Promise<{ arquivoGlb: Uint8Array; triangulos: number }> {
  validarArquivo(arquivo);

  let modelo: Object3D | null = null;

  try {
    const conteudo = await lerArquivo(arquivo);

    try {
      modelo = new ThreeMFLoader().parse(conteudo);
    } catch {
      throw new Error('O arquivo não é um pacote 3MF válido.');
    }

    const triangulos = contarEPrepararTriangulos(modelo);
    validarDimensoes(modelo);

    const resultado = await new GLTFExporter().parseAsync(modelo, {
      binary: true,
    });

    if (!(resultado instanceof ArrayBuffer)) {
      throw new Error('A conversão não gerou um arquivo GLB binário.');
    }

    const arquivoGlb = new Uint8Array(resultado);
    if (arquivoGlb.byteLength > LIMITE_GLB_BYTES) {
      throw new Error('O arquivo GLB excede o limite de 50 MiB.');
    }

    return { arquivoGlb, triangulos };
  } finally {
    if (modelo) descartarModelo(modelo);
  }
}
