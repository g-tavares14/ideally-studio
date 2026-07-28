import Link from 'next/link';
import { BRL, FILTROS } from '@cria-forma/shared';
import type { Produto } from '@cria-forma/shared';
import { cor as paleta, fonte } from '../styles/tokens';

interface Props {
  produtos: Produto[];
  /** filtro ativo — um valor de FILTROS */
  filtro: string;
  escolherFiltro: (nome: string) => void;
  thumb: (id: string) => string;
  abrir: (produto: Produto) => void;
}

export default function Catalogo({ produtos, filtro, escolherFiltro, thumb, abrir }: Props) {
  const visiveis = produtos.filter((p) => filtro === 'Tudo' || p.cat === filtro);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: paleta.creme,
        zIndex: 30,
        overflowY: 'auto',
        padding: '104px 40px 60px',
        animation: 'cfFade 0.35s ease both',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          borderBottom: `1px solid ${paleta.linha}`,
          paddingBottom: 22,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Link
            className="cf-h-ink"
            href="/"
            style={{
              fontSize: 12,
              letterSpacing: '0.06em',
              color: paleta.suave,
              cursor: 'pointer',
              textDecoration: 'none',
            }}
          >
            ← Voltar ao showroom
          </Link>
          <div
            style={{
              fontFamily: fonte.serif,
              fontSize: 48,
              fontWeight: 700,
              letterSpacing: '-0.04em',
            }}
          >
            Catálogo
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {FILTROS.map((f) => {
            const ativo = filtro === f;
            return (
              <div
                key={f}
                className="cf-h-border-ink"
                onClick={() => escolherFiltro(f)}
                style={{
                  fontSize: 12.5,
                  padding: '8px 16px',
                  border: `1px solid ${paleta.linha}`,
                  borderRadius: 100,
                  cursor: 'pointer',
                  background: ativo ? paleta.tinta : 'transparent',
                  color: ativo ? paleta.creme : paleta.tinta,
                }}
              >
                {f}
              </div>
            );
          })}
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '34px 30px',
          marginTop: 40,
        }}
      >
        {visiveis.map((item) => (
          <div key={item.id} onClick={() => abrir(item)} style={{ cursor: 'pointer' }}>
            <div
              className="cf-h-tile"
              style={{
                aspectRatio: '4 / 3',
                background: paleta.ladrilho,
                borderRadius: 3,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
              }}
            >
              <img
                src={thumb(item.id) || undefined}
                alt={item.nome}
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'baseline',
                justifyContent: 'space-between',
                marginTop: 14,
              }}
            >
              <div style={{ fontFamily: fonte.serif, fontSize: 22 }}>{item.nome}</div>
              <div style={{ fontSize: 13.5, fontVariantNumeric: 'tabular-nums' }}>
                {BRL(item.preco)}
              </div>
            </div>
            <div style={{ fontSize: 12, color: paleta.suave, marginTop: 4 }}>
              {item.cat} · {item.altura}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
