import type { Metadata } from 'next';
import { listarProdutos } from '../../lib/catalogo';
import CatalogoCliente from './CatalogoCliente';

export const metadata: Metadata = {
  title: 'Catálogo — Ideally Studio 3D',
  description: 'As seis peças da Coleção Sedimento, em decoração, mesa e utilitários.',
};

export default async function Page() {
  const produtos = await listarProdutos();
  return <CatalogoCliente produtos={produtos} />;
}
