import type { Metadata } from 'next';
import HomeExperience from '../ui/HomeExperience';

export const metadata: Metadata = {
  title: 'Ideally Studio 3D — Objetos que ganham forma',
  description:
    'A Ideally Studio 3D transforma ideias em objetos produzidos sob demanda em São Paulo.',
};

export default function Page() {
  return <HomeExperience />;
}
