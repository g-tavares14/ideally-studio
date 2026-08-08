import type { Metadata } from 'next';
import AdminProdutosCliente from './AdminProdutosCliente';

export const metadata: Metadata = {
  title: 'Modelos 3D locais — Ideally Studio 3D',
  robots: {
    index: false,
    follow: false,
  },
};

export default function Page() {
  return <AdminProdutosCliente />;
}
