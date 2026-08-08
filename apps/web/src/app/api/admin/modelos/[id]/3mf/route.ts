import { entregarArquivo } from '../_arquivo';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  contexto: { params: Promise<{ id: string }> },
): Promise<Response> {
  const { id } = await contexto.params;
  return entregarArquivo(request, id, '3mf');
}
