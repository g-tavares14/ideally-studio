import type { Metadata, Viewport } from 'next';
import { Instrument_Sans, Montserrat } from 'next/font/google';
import { listarProdutos } from '../lib/catalogo';
import Shell from './Shell';
import AnimatedFavicon from '../ui/AnimatedFavicon';
import '../styles.css';

// As famílias entram como variáveis CSS, e não como classe: os estilos são
// inline em quase toda a UI, então `var(--fonte-*)` é o que consegue alcançá-los
// a partir do objeto de tokens.
const sans = Instrument_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--fonte-sans',
  display: 'swap',
});

const display = Montserrat({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  variable: '--fonte-display',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Ideally Studio 3D — Coleção Sedimento',
  description:
    'Ideally Studio 3D: transformando ideias em realidade com fabricação aditiva. ' +
    'Conheça seis peças impressas sob demanda em São Paulo.',
  openGraph: {
    title: 'Ideally Studio 3D — Coleção Sedimento',
    description: 'Objetos impressos camada por camada, produzidos sob demanda em São Paulo.',
    type: 'website',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // O catálogo é buscado aqui, no servidor, e desce como prop. Quando vier do
  // banco, só o corpo de `listarProdutos` muda.
  const produtos = await listarProdutos();

  return (
    <html lang="pt-BR" className={`${sans.variable} ${display.variable}`}>
      <body>
        <AnimatedFavicon />
        <Shell produtos={produtos}>{children}</Shell>
      </body>
    </html>
  );
}
