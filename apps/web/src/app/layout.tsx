import type { Metadata, Viewport } from 'next';
import { Instrument_Sans, Instrument_Serif } from 'next/font/google';
import { listarProdutos } from '../lib/catalogo';
import Shell from './Shell';
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

const serif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--fonte-serif',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Cria Forma Studio — Coleção Sedimento',
  description:
    'Ateliê de fabricação aditiva em São Paulo. Seis peças impressas sob demanda, ' +
    'na cor e na escala que você escolher.',
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
    <html lang="pt-BR" className={`${sans.variable} ${serif.variable}`}>
      <body>
        <Shell produtos={produtos}>{children}</Shell>
      </body>
    </html>
  );
}
