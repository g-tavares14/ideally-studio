import { cor as paleta, fonte } from '../styles/tokens';

export default function ShowroomCopy() {
  return (
    <>
      <div
        className="cf-showroom-copy"
        style={{
          position: 'absolute',
          left: 40,
          bottom: 44,
          maxWidth: 420,
          zIndex: 15,
          animation: 'cfRise 0.7s ease both',
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            fontSize: 10,
            letterSpacing: '0.24em',
            textTransform: 'uppercase',
            color: paleta.suave,
            marginBottom: 18,
          }}
        >
          Coleção Sedimento — 2026
        </div>
        <h1
          className="cf-showroom-copy__title"
          style={{
            fontFamily: fonte.serif,
            fontSize: 55,
            fontWeight: 700,
            lineHeight: 0.98,
            letterSpacing: '-0.04em',
            margin: 0,
          }}
        >
          Objetos
          <br />
          <span style={{ color: paleta.laranja }}>impressos</span> camada
          <br />
          por camada.
        </h1>
        <div
          className="cf-pretty"
          style={{
            fontSize: 14,
            lineHeight: 1.6,
            color: paleta.texto,
            marginTop: 22,
            maxWidth: 330,
          }}
        >
          Seis peças em fabricação aditiva, produzidas sob demanda no nosso ateliê em São Paulo.
        </div>
        <div
          style={{
            marginTop: 18,
            color: paleta.azul,
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}
        >
          Transformando ideias em realidade
        </div>
      </div>

      <div
        className="cf-showroom-tips"
        style={{
          position: 'absolute',
          right: 40,
          bottom: 44,
          zIndex: 15,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: 10,
          animation: 'cfFade 1.2s ease both',
          pointerEvents: 'none',
        }}
      >
        <div style={{ fontSize: 12, color: paleta.suave }}>Arraste para girar a sala</div>
        <div style={{ fontSize: 12, color: paleta.suave }}>
          Clique em uma peça para ver de perto
        </div>
      </div>
    </>
  );
}
