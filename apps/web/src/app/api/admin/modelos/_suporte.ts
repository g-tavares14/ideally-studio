import type { Modelo3D, Modelo3DComUrls, NovoModelo3D } from '@/lib/modelos3d/contratos';
import { LIMITE_3MF_BYTES, LIMITE_GLB_BYTES, LIMITE_TRIANGULOS } from '@/lib/modelos3d/limites';

export class ErroRequisicao extends Error {
  constructor(
    mensagem: string,
    readonly status = 400,
  ) {
    super(mensagem);
  }
}

export function requisicaoLocalPermitida(
  request: Request,
  ambiente = process.env.NODE_ENV,
): boolean {
  if (ambiente !== 'development') return false;

  const hostname = new URL(request.url).hostname.toLowerCase();
  return (
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname === '::1' ||
    hostname === '[::1]'
  );
}

export function respostaNaoEncontrada(): Response {
  return new Response(null, {
    status: 404,
    headers: { 'Cache-Control': 'no-store' },
  });
}

export function responderErro(erro: unknown): Response {
  if (erro instanceof ErroRequisicao) {
    return Response.json(
      { erro: erro.message },
      { status: erro.status, headers: { 'Cache-Control': 'no-store' } },
    );
  }

  console.error('Falha na API local de modelos 3D.', erro);
  return Response.json(
    { erro: 'Não foi possível processar o modelo 3D.' },
    { status: 500, headers: { 'Cache-Control': 'no-store' } },
  );
}

export function adicionarUrls(modelo: Modelo3D): Modelo3DComUrls {
  const base = `/api/admin/modelos/${modelo.id}`;
  return {
    ...modelo,
    url3mf: `${base}/3mf`,
    urlGlb: `${base}/glb`,
  };
}

function obterTexto(formData: FormData, campo: string): string {
  const valor = formData.get(campo);
  if (typeof valor !== 'string') {
    throw new ErroRequisicao(`O campo ${campo} é obrigatório.`);
  }
  return valor;
}

function obterArquivo(formData: FormData, campo: string): File {
  const valor = formData.get(campo);
  if (!(valor instanceof File)) {
    throw new ErroRequisicao(`O arquivo ${campo} é obrigatório.`);
  }
  return valor;
}

function validarArquivo3mf(arquivo: File, bytes: Uint8Array): void {
  if (!arquivo.name.toLowerCase().endsWith('.3mf')) {
    throw new ErroRequisicao('O arquivo de origem deve ter a extensão .3mf.');
  }
  if (arquivo.type !== 'model/3mf') {
    throw new ErroRequisicao('O arquivo de origem deve usar o MIME type model/3mf.');
  }
  if (arquivo.size === 0) {
    throw new ErroRequisicao('O arquivo 3MF está vazio.');
  }
  if (arquivo.size > LIMITE_3MF_BYTES) {
    throw new ErroRequisicao('O arquivo 3MF excede o limite permitido.', 413);
  }
  if (
    bytes.length < 4 ||
    bytes[0] !== 0x50 ||
    bytes[1] !== 0x4b ||
    bytes[2] !== 0x03 ||
    bytes[3] !== 0x04
  ) {
    throw new ErroRequisicao('O arquivo 3MF não é um pacote ZIP válido.');
  }
}

function validarArquivoGlb(arquivo: File, bytes: Uint8Array): void {
  if (arquivo.type !== 'model/gltf-binary') {
    throw new ErroRequisicao('O arquivo convertido deve usar o MIME type model/gltf-binary.');
  }
  if (arquivo.size > LIMITE_GLB_BYTES) {
    throw new ErroRequisicao('O arquivo GLB excede o limite permitido.', 413);
  }
  if (bytes.length < 12) {
    throw new ErroRequisicao('O arquivo GLB é inválido.');
  }

  const cabecalho = new DataView(bytes.buffer, bytes.byteOffset, 12);
  const assinaturaValida =
    bytes[0] === 0x67 && bytes[1] === 0x6c && bytes[2] === 0x54 && bytes[3] === 0x46;
  const versao = cabecalho.getUint32(4, true);
  const tamanhoDeclarado = cabecalho.getUint32(8, true);

  if (!assinaturaValida || versao !== 2 || tamanhoDeclarado !== bytes.length) {
    throw new ErroRequisicao('O arquivo GLB deve ter cabeçalho glTF 2 válido.');
  }
}

export async function lerNovoModelo3D(request: Request): Promise<NovoModelo3D> {
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    throw new ErroRequisicao('O corpo deve usar multipart/form-data.');
  }

  const nome = obterTexto(formData, 'nome').trim();
  if (!nome || nome.length > 120) {
    throw new ErroRequisicao('O nome deve ter entre 1 e 120 caracteres.');
  }

  const triangulosTexto = obterTexto(formData, 'triangulos');
  const triangulos = Number(triangulosTexto);
  if (!Number.isInteger(triangulos) || triangulos <= 0 || triangulos > LIMITE_TRIANGULOS) {
    throw new ErroRequisicao(
      `A quantidade de triângulos deve estar entre 1 e ${LIMITE_TRIANGULOS}.`,
    );
  }

  const arquivo3mf = obterArquivo(formData, 'arquivo3mf');
  const arquivoGlb = obterArquivo(formData, 'arquivoGlb');

  if (arquivo3mf.size > LIMITE_3MF_BYTES) {
    throw new ErroRequisicao('O arquivo 3MF excede o limite permitido.', 413);
  }
  if (arquivoGlb.size > LIMITE_GLB_BYTES) {
    throw new ErroRequisicao('O arquivo GLB excede o limite permitido.', 413);
  }

  const [buffer3mf, bufferGlb] = await Promise.all([
    arquivo3mf.arrayBuffer(),
    arquivoGlb.arrayBuffer(),
  ]);
  const bytes3mf = new Uint8Array(buffer3mf);
  const bytesGlb = new Uint8Array(bufferGlb);

  validarArquivo3mf(arquivo3mf, bytes3mf);
  validarArquivoGlb(arquivoGlb, bytesGlb);

  return {
    nome,
    nomeArquivo: arquivo3mf.name,
    triangulos,
    arquivo3mf: bytes3mf,
    arquivoGlb: bytesGlb,
  };
}
