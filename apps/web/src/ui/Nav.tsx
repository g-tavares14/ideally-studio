import Link from 'next/link';
import type { CSSProperties } from 'react';
import BrandLogo from './BrandLogo';

const link: CSSProperties = {
  fontSize: 13,
  letterSpacing: '0.02em',
  cursor: 'pointer',
  paddingBottom: 2,
  borderBottom: '1px solid transparent',
  color: 'inherit',
  textDecoration: 'none',
};

interface Props {
  tema: 'claro' | 'escuro' | 'transparente';
  qtdSacola: number;
  abrirSacola: () => void;
}

export default function Nav({ tema, qtdSacola, abrirSacola }: Props) {
  return (
    <header className="cf-site-header" data-tema={tema}>
      <nav aria-label="Navegação principal" className="cf-site-nav">
        <Link aria-label="Ideally Studio 3D — início" className="cf-site-nav__brand" href="/">
          <BrandLogo tema={tema === 'escuro' ? 'escuro' : 'claro'} />
        </Link>

        <div className="cf-site-nav__links">
          <Link className="cf-h-underline" href="/#showroom" style={link}>
            Showroom
          </Link>
          <Link className="cf-h-underline" href="/catalogo" style={link}>
            Catálogo
          </Link>
          <Link className="cf-h-underline" href="/sobre" style={link}>
            Ateliê
          </Link>
          <button className="cf-h-invert cf-site-nav__bag" onClick={abrirSacola} type="button">
            <span>Sacola</span>
            <span style={{ fontVariantNumeric: 'tabular-nums' }}>{qtdSacola}</span>
          </button>
        </div>
      </nav>
    </header>
  );
}
