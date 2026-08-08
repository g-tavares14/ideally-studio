import type { Metadata, Viewport } from 'next';
import { Instrument_Sans, Montserrat, Playfair_Display, Work_Sans } from 'next/font/google';
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

// Identidade tipográfica só da home editorial (`HomeEditorial`) — as demais
// telas seguem em Instrument Sans / Montserrat acima.
const editorialDisplay = Playfair_Display({
  subsets: ['latin'],
  weight: ['500', '700'],
  style: ['normal', 'italic'],
  variable: '--fonte-editorial-display',
  display: 'swap',
});

const editorialSans = Work_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--fonte-editorial-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Ideally Studio 3D — Objetos que ganham forma',
  description:
    'Ideally Studio 3D: objetos produzidos sob demanda com fabricação aditiva em São Paulo.',
  openGraph: {
    title: 'Ideally Studio 3D — Objetos que ganham forma',
    description: 'Objetos produzidos sob demanda, camada por camada, em São Paulo.',
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
    <html
      lang="pt-BR"
      className={`${sans.variable} ${display.variable} ${editorialDisplay.variable} ${editorialSans.variable}`}
    >
      <body>
        <AnimatedFavicon />
        <Shell produtos={produtos}>{children}</Shell>
      </body>
    </html>
  );
}
