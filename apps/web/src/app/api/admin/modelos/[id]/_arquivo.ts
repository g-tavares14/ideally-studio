import { obterRepositorioModelos3D } from '@/lib/modelos3d/armazenamento';
import type { FormatoModelo3D } from '@/lib/modelos3d/contratos';
import { requisicaoLocalPermitida, responderErro, respostaNaoEncontrada } from '../_suporte';

const CABECALHOS: Record<FormatoModelo3D, Record<string, string>> = {
  '3mf': {
    'Content-Type': 'model/3mf',
    'Content-Disposition': 'attachment; filename="fonte.3mf"',
  },
  glb: {
    'Content-Type': 'model/gltf-binary',
    'Content-Disposition': 'inline; filename="modelo.glb"',
  },
};

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function entregarArquivo(
  request: Request,
  id: string,
  formato: FormatoModelo3D,
): Promise<Response> {
  if (!requisicaoLocalPermitida(request)) return respostaNaoEncontrada();
  if (!UUID_PATTERN.test(id)) return respostaNaoEncontrada();

  try {
    const arquivo = await obterRepositorioModelos3D().lerArquivo(id, formato);
    if (!arquivo) return respostaNaoEncontrada();

    return new Response(Uint8Array.from(arquivo), {
      headers: {
        ...CABECALHOS[formato],
        'Content-Length': String(arquivo.byteLength),
        'Cache-Control': 'no-store',
      },
    });
  } catch (erro) {
    return responderErro(erro);
  }
}
