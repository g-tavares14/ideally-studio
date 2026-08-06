import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = { title: 'Showroom — Ideally Studio 3D' };

export default function Page() {
  redirect('/#showroom');
}
