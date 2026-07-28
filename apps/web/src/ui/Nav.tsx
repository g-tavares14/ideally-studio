import Link from 'next/link';
import type { CSSProperties } from 'react';
import { cor as paleta } from '../styles/tokens';
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
  qtdSacola: number;
  abrirSacola: () => void;
}

export default function Nav({ qtdSacola, abrirSacola }: Props) {
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '26px 40px',
        zIndex: 60,
      }}
    >
      <Link
        aria-label="Ideally Studio 3D — início"
        href="/"
        style={{
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer',
          textDecoration: 'none',
        }}
      >
        <BrandLogo style={{ width: 184 }} />
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: 30 }}>
        <Link className="cf-h-underline" href="/" style={link}>
          Showroom
        </Link>
        <Link className="cf-h-underline" href="/catalogo" style={link}>
          Catálogo
        </Link>
        <Link className="cf-h-underline" href="/sobre" style={link}>
          Ateliê
        </Link>
        <div
          className="cf-h-invert"
          onClick={abrirSacola}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontSize: 13,
            cursor: 'pointer',
            padding: '7px 14px',
            border: `1px solid ${paleta.tinta}`,
            borderRadius: 100,
            fontWeight: 600,
          }}
        >
          <span>Sacola</span>
          <span style={{ fontVariantNumeric: 'tabular-nums' }}>{qtdSacola}</span>
        </div>
      </div>
    </div>
  );
}
