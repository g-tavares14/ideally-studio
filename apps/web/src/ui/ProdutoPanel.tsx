import Link from 'next/link';
import { BRL, CORES, MATERIAIS, TAMANHOS } from '@cria-forma/shared';
import type { Produto } from '@cria-forma/shared';
import { cor as paleta, eyebrow, fonte } from '../styles/tokens';

interface Props {
  p: Produto;
  precoFmt: string;
  /** id do material escolhido */
  mat: string;
  /** índice da cor escolhida */
  cor: number;
  /** id do tamanho escolhido */
  tam: string;
  adicionado: boolean;
  escolherMat: (id: string) => void;
  escolherCor: (indice: number) => void;
  escolherTam: (id: string) => void;
  adicionar: () => void;
}

export default function ProdutoPanel({
  p,
  precoFmt,
  mat,
  cor,
  tam,
  adicionado,
  escolherMat,
  escolherCor,
  escolherTam,
  adicionar,
}: Props) {
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        width: 440,
        background: paleta.papel,
        borderLeft: `1px solid ${paleta.linha}`,
        zIndex: 25,
        padding: '104px 44px 40px',
        overflowY: 'auto',
        animation: 'cfRise 0.5s ease both',
      }}
    >
      <Link
        className="cf-h-ink"
        href="/"
        style={{
          display: 'block',
          fontSize: 12,
          letterSpacing: '0.06em',
          color: paleta.suave,
          cursor: 'pointer',
          marginBottom: 30,
          textDecoration: 'none',
        }}
      >
        ← Voltar ao showroom
      </Link>

      <div style={eyebrow('0.24em')}>{p.cat}</div>
      <div
        style={{
          fontFamily: fonte.serif,
          fontSize: 44,
          fontWeight: 700,
          lineHeight: 1.02,
          letterSpacing: '-0.04em',
          margin: '12px 0 0',
        }}
      >
        {p.nome}
      </div>
      <div
        className="cf-pretty"
        style={{ fontSize: 14, lineHeight: 1.65, color: paleta.texto, marginTop: 16 }}
      >
        {p.desc}
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 26,
          marginTop: 36,
          paddingTop: 30,
          borderTop: `1px solid ${paleta.linha}`,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={eyebrow()}>Acabamento</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {MATERIAIS.map((m) => (
              <div
                key={m.id}
                className="cf-h-border-ink"
                onClick={() => escolherMat(m.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '13px 16px',
                  border: `1px solid ${paleta.linha}`,
                  borderRadius: 3,
                  cursor: 'pointer',
                  background: mat === m.id ? paleta.selecionado : 'transparent',
                }}
              >
                <span style={{ fontSize: 13.5 }}>{m.nome}</span>
                <span
                  style={{
                    fontSize: 12,
                    color: paleta.suave,
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {m.delta ? '+ ' + BRL(m.delta) : 'incluso'}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={eyebrow()}>Cor — {CORES[cor].nome}</div>
          <div style={{ display: 'flex', gap: 10 }}>
            {CORES.map((c, i) => (
              <div
                key={c.hex}
                onClick={() => escolherCor(i)}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 100,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: `1px solid ${paleta.linha}`,
                  padding: 3,
                  outline: cor === i ? `1px solid ${paleta.tinta}` : 'none',
                }}
              >
                <div
                  style={{ width: '100%', height: '100%', borderRadius: 100, background: c.hex }}
                />
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={eyebrow()}>Escala</div>
          <div style={{ display: 'flex', gap: 8 }}>
            {TAMANHOS.map((t) => (
              <div
                key={t.id}
                className="cf-h-border-ink"
                onClick={() => escolherTam(t.id)}
                style={{
                  flex: 1,
                  textAlign: 'center',
                  padding: '13px 8px',
                  border: `1px solid ${paleta.linha}`,
                  borderRadius: 3,
                  cursor: 'pointer',
                  background: tam === t.id ? paleta.selecionado : 'transparent',
                }}
              >
                <div style={{ fontSize: 13.5 }}>{t.nome}</div>
                <div style={{ fontSize: 11, color: paleta.suave, marginTop: 3 }}>{t.cm}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          marginTop: 34,
          paddingTop: 26,
          borderTop: `1px solid ${paleta.linha}`,
        }}
      >
        <div>
          <div style={{ ...eyebrow(), marginBottom: 6 }}>Total</div>
          <div
            style={{
              fontFamily: fonte.serif,
              fontSize: 34,
              fontWeight: 700,
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {precoFmt}
          </div>
        </div>
        <div style={{ fontSize: 11.5, color: paleta.suave, textAlign: 'right', lineHeight: 1.5 }}>
          produção em {p.prazo}
          <br />
          frete calculado no checkout
        </div>
      </div>

      <div
        className="cf-h-cta"
        onClick={adicionar}
        style={{
          marginTop: 22,
          textAlign: 'center',
          padding: 17,
          background: paleta.tinta,
          color: paleta.papel,
          borderRadius: 3,
          cursor: 'pointer',
          fontSize: 13.5,
          letterSpacing: '0.06em',
        }}
      >
        {adicionado ? 'Adicionado à sacola ✓' : 'Adicionar à sacola'}
      </div>
    </div>
  );
}
