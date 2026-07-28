import type { Metadata } from 'next';
import Sobre from '../../ui/Sobre';

export const metadata: Metadata = {
  title: 'Ateliê — Cria Forma Studio',
  description:
    'Ateliê de fabricação aditiva na Vila Madalena, São Paulo. Sem estoque: cada ' +
    'peça é impressa depois do pedido e finalizada à mão.',
};

export default function Page() {
  return <Sobre />;
}
