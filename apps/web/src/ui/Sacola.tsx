import { BRL } from '@cria-forma/shared';
import type { ItemSacola } from '@cria-forma/shared';
import { cor as paleta, eyebrow, fonte } from '../styles/tokens';

interface Props {
  itens: ItemSacola[];
  total: number;
  remover: (key: number) => void;
  fechar: () => void;
}

export default function Sacola({ itens, total, remover, fechar }: Props) {
  return (
    <div className="cf-cart" style={{ position: 'absolute', inset: 0, zIndex: 80 }}>
      <div onClick={fechar} style={{ position: 'absolute', inset: 0, background: paleta.veu }} />
      <div
        className="cf-cart__panel"
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          width: 'min(460px, 100%)',
          background: paleta.papel,
          padding: '44px 44px 34px',
          display: 'flex',
          flexDirection: 'column',
          animation: 'cfRise 0.35s ease both',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <div style={{ fontFamily: fonte.serif, fontSize: 34, fontWeight: 700 }}>Sacola</div>
          <div
            className="cf-h-ink"
            onClick={fechar}
            style={{ fontSize: 12, color: paleta.suave, cursor: 'pointer' }}
          >
            Fechar
          </div>
        </div>

        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            marginTop: 26,
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
          }}
        >
          {itens.length === 0 && (
            <div style={{ fontSize: 14, color: paleta.suave, lineHeight: 1.6 }}>
              Sua sacola está vazia. Escolha uma peça no catálogo para começar.
            </div>
          )}
          {itens.map((i) => (
            <div
              key={i.key}
              style={{
                display: 'flex',
                gap: 16,
                paddingBottom: 20,
                borderBottom: `1px solid ${paleta.linhaSuave}`,
              }}
            >
              <div
                style={{
                  width: 78,
                  height: 78,
                  background: paleta.ladrilho,
                  borderRadius: 3,
                  flexShrink: 0,
                  overflow: 'hidden',
                }}
              >
                <img
                  src={i.thumb || undefined}
                  alt={i.nome}
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                  <div style={{ fontFamily: fonte.serif, fontSize: 20, fontWeight: 600 }}>
                    {i.nome}
                  </div>
                  <div style={{ fontSize: 13.5, fontVariantNumeric: 'tabular-nums' }}>
                    {BRL(i.preco)}
                  </div>
                </div>
                <div style={{ fontSize: 12, color: paleta.suave, lineHeight: 1.5 }}>
                  {i.detalhe}
                </div>
                <div
                  className="cf-h-ink"
                  onClick={() => remover(i.key)}
                  style={{
                    fontSize: 11.5,
                    color: paleta.terracota,
                    cursor: 'pointer',
                    marginTop: 2,
                  }}
                >
                  Remover
                </div>
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            borderTop: `1px solid ${paleta.linha}`,
            paddingTop: 20,
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: 13,
              color: paleta.texto,
            }}
          >
            <span>Subtotal</span>
            <span style={{ fontVariantNumeric: 'tabular-nums' }}>{BRL(total)}</span>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: 13,
              color: paleta.texto,
            }}
          >
            <span>Frete estimado</span>
            <span>a calcular</span>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              marginTop: 10,
            }}
          >
            <span style={eyebrow()}>Total</span>
            <span
              style={{
                fontFamily: fonte.serif,
                fontSize: 30,
                fontWeight: 700,
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {BRL(total)}
            </span>
          </div>
          <div
            className="cf-h-cta"
            onClick={fechar}
            style={{
              marginTop: 16,
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
            Finalizar pedido
          </div>
        </div>
      </div>
    </div>
  );
}
