import { obterRepositorioModelos3D } from '@/lib/modelos3d/armazenamento';
import {
  adicionarUrls,
  lerNovoModelo3D,
  requisicaoLocalPermitida,
  responderErro,
  respostaNaoEncontrada,
} from './_suporte';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: Request): Promise<Response> {
  if (!requisicaoLocalPermitida(request)) return respostaNaoEncontrada();

  try {
    const modelos = await obterRepositorioModelos3D().listar();
    return Response.json(modelos.map(adicionarUrls), {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (erro) {
    return responderErro(erro);
  }
}

export async function POST(request: Request): Promise<Response> {
  if (!requisicaoLocalPermitida(request)) return respostaNaoEncontrada();

  try {
    const entrada = await lerNovoModelo3D(request);
    const modelo = await obterRepositorioModelos3D().salvar(entrada);
    return Response.json(adicionarUrls(modelo), {
      status: 201,
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (erro) {
    return responderErro(erro);
  }
}
