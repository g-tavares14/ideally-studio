import type { CSSProperties } from 'react';

interface BrandLogoProps {
  variante?: 'compacta' | 'completa';
  style?: CSSProperties;
}

/** Assinatura vetorial da Ideally Studio 3D para fundos claros ou escuros. */
export default function BrandLogo({ variante = 'compacta', style }: BrandLogoProps) {
  const completa = variante === 'completa';

  return (
    <svg
      aria-label="Ideally Studio 3D — Transformando ideias em realidade"
      role="img"
      viewBox={completa ? '0 0 390 126' : '0 0 262 68'}
      style={{ display: 'block', width: completa ? 390 : 262, maxWidth: '100%', ...style }}
    >
      <g
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={completa ? 5 : 4}
        transform={completa ? 'translate(5 15) scale(1.28)' : 'translate(3 7)'}
      >
        <path d="M28 1 53 15.5 28 30 3 15.5Z" stroke="#001E5A" />
        <path d="M3 15.5v28.7L28 59l25-14.8V15.5" stroke="#001E5A" />
        <path d="m28 30 25 14.2M28 30 3 44.2" stroke="#001E5A" />
        <path d="M28 30v29M12.5 21.2 28 12l15.5 9.2L28 30Z" stroke="#F36C21" />
        <path d="M28 30 12.5 21.2v17.2L28 47.6" stroke="#F36C21" />
      </g>

      <text
        x={completa ? 86 : 70}
        y={completa ? 42 : 25}
        fill="#F36C21"
        fontFamily="var(--fonte-display), Montserrat, sans-serif"
        fontSize={completa ? 31 : 20}
        fontWeight="800"
        letterSpacing="-1"
      >
        Ideally
      </text>
      <text
        x={completa ? 84 : 69}
        y={completa ? 79 : 52}
        fill="#001E5A"
        fontFamily="var(--fonte-display), Montserrat, sans-serif"
        fontSize={completa ? 40 : 28}
        fontWeight="800"
        letterSpacing="-1.5"
      >
        Studio
      </text>
      <text
        x={completa ? 225 : 170}
        y={completa ? 79 : 52}
        fill="#F36C21"
        fontFamily="var(--fonte-display), Montserrat, sans-serif"
        fontSize={completa ? 15 : 11}
        fontWeight="800"
      >
        3D
      </text>

      {completa && (
        <>
          <path d="M86 91H374" stroke="#F36C21" strokeWidth="2.5" />
          <text
            x="86"
            y="113"
            fill="#001E5A"
            fontFamily="var(--fonte-sans), system-ui, sans-serif"
            fontSize="13"
            fontWeight="600"
            letterSpacing="0.25"
          >
            Transformando ideias em realidade
          </text>
        </>
      )}
    </svg>
  );
}
