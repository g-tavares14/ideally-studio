import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BRL } from '@cria-forma/shared';
import { buscarProduto, listarProdutos } from '../../../lib/catalogo';
import ProdutoCliente from './ProdutoCliente';

/** Prerenderiza uma página por produto — o ganho de SEO que motivou o Next. */
export async function generateStaticParams() {
  const produtos = await listarProdutos();
  return produtos.map((p) => ({ slug: p.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const produto = await buscarProduto(slug);
  if (!produto) return { title: 'Peça não encontrada — Cria Forma Studio' };

  return {
    title: `${produto.nome} — Cria Forma Studio`,
    description: produto.desc,
    openGraph: {
      title: `${produto.nome} — ${BRL(produto.preco)}`,
      description: produto.desc,
      type: 'website',
    },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const produto = await buscarProduto(slug);
  if (!produto) notFound();

  return <ProdutoCliente produto={produto} />;
}
