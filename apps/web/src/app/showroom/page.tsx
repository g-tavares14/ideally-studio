import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = { title: 'Catálogo — Ideally Studio 3D' };

export default function Page() {
  redirect('/catalogo');
}
