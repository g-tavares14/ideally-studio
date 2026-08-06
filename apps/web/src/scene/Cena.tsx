import { useEffect, useMemo, useRef, useState, type MutableRefObject } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { BRL, CORES, MATERIAIS, TAMANHOS } from '@cria-forma/shared';
import { enquadrarCaixa } from './caixa';
import { modeloDe } from './modelos';
import Palco, { lugares as calcularLugares } from './Palco';
import type { Lugar } from './Palco';
import Peca from './Peca';
import type { Produto } from '@cria-forma/shared';
import type { Ambiente, Screen } from '../types';
import { cor as paleta } from '../styles/tokens';

/** Largura do ProdutoPanel — a peça é jogada para a esquerda para não ficar sob ele. */
const PAINEL_PX = 440;
const FATOR_MAX = Math.max(...TAMANHOS.map((t) => t.fator));
const CAM_INTRO = new THREE.Vector3(0, 2.55, 9.6);
const ALVO_INTRO = new THREE.Vector3(0, 1.3, 0);
const CAM_SHOWROOM = new THREE.Vector3(0, 1.75, 6.4);
const ALVO_SHOWROOM = new THREE.Vector3(0, 1.15, 0);
const FOV = 38;

/** Acabamento do showroom: é para ele que toda peça volta ao sair da edição. */
const MAT_PADRAO = MATERIAIS[0];

const limitar = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

/**
 * Estado de arrasto, compartilhado entre a câmera e as peças. Fica num ref
 * porque muda a cada evento de ponteiro e não deve provocar renderização.
 */
interface Controle {
  orbit: { yaw: number; pitch: number };
  /** giro manual acumulado na tela de produto */
  spin: number;
  /** distância percorrida desde o pointerdown, para separar arrasto de clique */
  arrasto: number;
}

export interface CenaProps {
  ambiente: Ambiente;
  autoOrbit: boolean;
  /** acabamento padrão das peças no showroom */
  corPeca: string;
  /** o catálogo a exibir; a cena não o importa, recebe */
  produtos: Produto[];
  screen: Screen;
  sel: number | null;
  /** material, cor e tamanho só têm efeito na peça em edição */
  mat: string;
  cor: number;
  tam: string;
  /** câmera mais distante enquanto a hero institucional está em primeiro plano */
  intro?: boolean;
  /** remove a interpolação da câmera quando o visitante reduz movimento */
  movimentoReduzido?: boolean;
  onPick: (i: number) => void;
}

export default function Cena(props: CenaProps) {
  const penumbra = props.ambiente === 'Penumbra';
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <Canvas
        shadows={{ type: THREE.PCFSoftShadowMap }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: penumbra ? 0.95 : 1.1,
        }}
        camera={{ fov: FOV, near: 0.1, far: 100, position: CAM_SHOWROOM.toArray() }}
      >
        <Interior {...props} />
      </Canvas>
    </div>
  );
}

function Interior({
  ambiente,
  autoOrbit,
  corPeca,
  produtos,
  screen,
  sel,
  mat,
  cor,
  tam,
  intro,
  movimentoReduzido,
  onPick,
}: CenaProps) {
  const { gl } = useThree();
  const controle = useRef<Controle>({ orbit: { yaw: 0, pitch: 0 }, spin: 0, arrasto: 0 });
  const lugares = useMemo(() => calcularLugares(produtos.length), [produtos.length]);
  const [sobre, setSobre] = useState<number | null>(null);

  // O destaque de hover só existe no showroom. Derivado em vez de zerado por
  // efeito: não há estado a desfazer, na mesma linha do resto da cena.
  const sobreAtivo = screen === 'showroom' ? sobre : null;

  // Lido pelo handler de pointerup, que é registrado uma vez e não enxerga o
  // valor corrente. Escrito num efeito, não durante a renderização.
  const sobreRef = useRef<number | null>(null);
  useEffect(() => {
    sobreRef.current = sobreAtivo;
  }, [sobreAtivo]);

  // abrir uma peça zera o giro manual acumulado na anterior
  useEffect(() => {
    controle.current.spin = 0;
  }, [sel]);

  // O cursor do canvas é DOM, não estado do React — é assim que o R3F espera
  // que seja mexido. A regra de imutabilidade não distingue os dois casos.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    gl.domElement.style.cursor = sobreAtivo != null ? 'pointer' : 'grab';
  }, [gl, sobreAtivo]);

  // arrastar orbita a cena no showroom e gira a peça na tela de produto
  useEffect(() => {
    const el = gl.domElement;
    let arrastando = false;
    let lx = 0;
    let ly = 0;

    const down = (e: PointerEvent) => {
      arrastando = true;
      controle.current.arrasto = 0;
      lx = e.clientX;
      ly = e.clientY;
      el.style.cursor = 'grabbing';
    };
    const move = (e: PointerEvent) => {
      if (!arrastando) return;
      const dx = e.clientX - lx;
      const dy = e.clientY - ly;
      lx = e.clientX;
      ly = e.clientY;
      const c = controle.current;
      c.arrasto += Math.abs(dx) + Math.abs(dy);
      if (screen === 'produto') {
        c.spin += dx * 0.008;
      } else {
        c.orbit.yaw = limitar(c.orbit.yaw - dx * 0.0035, -0.5, 0.5);
        c.orbit.pitch = limitar(c.orbit.pitch + dy * 0.0022, -0.12, 0.28);
      }
    };
    const up = () => {
      arrastando = false;
      el.style.cursor = sobreRef.current != null ? 'pointer' : 'grab';
    };

    el.addEventListener('pointerdown', down);
    el.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    return () => {
      el.removeEventListener('pointerdown', down);
      el.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
  }, [gl, screen]);

  return (
    <>
      <Palco ambiente={ambiente} lugares={lugares} />
      <CameraRig
        screen={screen}
        sel={sel}
        autoOrbit={autoOrbit}
        intro={intro}
        movimentoReduzido={movimentoReduzido}
        controle={controle}
        lugares={lugares}
      />
      {produtos.map((p, i) => (
        <Suporte
          key={p.id}
          index={i}
          produto={p}
          screen={screen}
          sel={sel}
          corPadrao={corPeca}
          matId={mat}
          corIdx={cor}
          tamId={tam}
          sobre={sobreAtivo === i}
          setSobre={setSobre}
          controle={controle}
          lugar={lugares[i]}
          onPick={onPick}
        />
      ))}
    </>
  );
}

interface RigProps {
  screen: Screen;
  sel: number | null;
  autoOrbit: boolean;
  intro?: boolean;
  movimentoReduzido?: boolean;
  controle: MutableRefObject<Controle>;
  lugares: Lugar[];
}

/**
 * Move a câmera entre o showroom e a peça aberta. O enquadramento de produto
 * sai da caixa padrão (`enquadrarCaixa`), não de offsets fixos: como toda peça
 * ocupa a mesma caixa, uma fórmula só enquadra as seis do mesmo jeito.
 */
function CameraRig({
  screen,
  sel,
  autoOrbit,
  intro,
  movimentoReduzido,
  controle,
  lugares,
}: RigProps) {
  const { camera, size } = useThree();
  const pos = useRef(CAM_SHOWROOM.clone());
  const alvo = useRef(ALVO_SHOWROOM.clone());
  const destPos = useRef(new THREE.Vector3());
  const destAlvo = useRef(new THREE.Vector3());

  const enq = useMemo(
    () =>
      enquadrarCaixa({
        fov: FOV,
        aspect: size.width / size.height,
        larguraPx: size.width,
        painelPx: PAINEL_PX,
        fatorMax: FATOR_MAX,
      }),
    [size.width, size.height],
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const p = destPos.current;
    const a = destAlvo.current;

    if (screen === 'produto' && sel != null) {
      const l = lugares[sel];
      a.set(l.x + enq.offsetX, l.alturaPedestal + enq.alvoY, l.z);
      p.set(l.x + enq.offsetX, l.alturaPedestal + enq.camY, l.z + enq.camZ);
    } else if (screen === 'showroom' && intro) {
      a.copy(ALVO_INTRO);
      p.copy(CAM_INTRO);
    } else {
      a.copy(ALVO_SHOWROOM);
      p.copy(CAM_SHOWROOM);
      const auto = autoOrbit ? Math.sin(t * 0.12) * 0.1 : 0;
      const yaw = controle.current.orbit.yaw + auto;
      const r = Math.hypot(p.x - a.x, p.z - a.z);
      p.x = a.x + Math.sin(yaw) * r;
      p.z = a.z + Math.cos(yaw) * r;
      p.y = CAM_SHOWROOM.y + controle.current.orbit.pitch * 2.2;
    }

    if (movimentoReduzido) {
      pos.current.copy(p);
      alvo.current.copy(a);
    } else {
      pos.current.lerp(p, 0.055);
      alvo.current.lerp(a, 0.06);
    }
    camera.position.copy(pos.current);
    camera.lookAt(alvo.current);
  });

  return null;
}

interface SuporteProps {
  index: number;
  produto: Produto;
  screen: Screen;
  sel: number | null;
  corPadrao: string;
  matId: string;
  corIdx: number;
  tamId: string;
  sobre: boolean;
  setSobre: (i: number | null) => void;
  controle: MutableRefObject<Controle>;
  lugar: Lugar;
  onPick: (i: number) => void;
}

/**
 * Uma peça no seu pedestal.
 *
 * O acabamento e a escala são derivados de `editando`: fora da edição a peça é
 * sempre desenhada no padrão do showroom. Como nada é mutado, voltar ao
 * showroom (que zera `screen`/`sel`) já devolve a peça ao padrão — não existe
 * operação inversa para esquecer de chamar.
 */
function Suporte({
  index,
  produto,
  screen,
  sel,
  corPadrao,
  matId,
  corIdx,
  tamId,
  sobre,
  setSobre,
  controle,
  lugar,
  onPick,
}: SuporteProps) {
  const { encaixe } = modeloDe(produto.id);

  const grupo = useRef<THREE.Group>(null);
  const corpo = useRef<THREE.Group>(null);
  const ancora = useRef<THREE.Group>(null);
  const escalaAlvo = useRef(new THREE.Vector3(1, 1, 1));

  const editando = screen === 'produto' && sel === index;
  const material = editando ? (MATERIAIS.find((m) => m.id === matId) ?? MAT_PADRAO) : MAT_PADRAO;
  const cor = editando ? CORES[corIdx].hex : corPadrao;
  const fator = editando ? (TAMANHOS.find((t) => t.id === tamId)?.fator ?? 1) : 1;
  const opacity = screen === 'produto' && !editando ? 0.35 : 1;

  // memoizado para o R3F não reaplicar a posição por cima da animação de hover
  const base = useMemo(
    () => [lugar.x, lugar.alturaPedestal, lugar.z] as [number, number, number],
    [lugar],
  );

  useFrame((state) => {
    const g = grupo.current;
    const c = corpo.current;
    if (!g || !c) return;
    const t = state.clock.elapsedTime;

    const salto = sobre && screen === 'showroom' ? 0.055 : 0;
    g.position.y += (lugar.alturaPedestal + salto - g.position.y) * 0.12;

    if (editando) {
      c.rotation.y += (controle.current.spin + t * 0.18 - c.rotation.y) * 0.25;
    } else if (screen === 'showroom') {
      c.rotation.y += 0.0012;
    }

    escalaAlvo.current.setScalar(fator);
    c.scale.lerp(escalaAlvo.current, 0.1);

    if (ancora.current) ancora.current.position.y = encaixe.altura * c.scale.y + 0.2;
  });

  return (
    <group
      ref={grupo}
      position={base}
      onPointerOver={(e) => {
        e.stopPropagation();
        if (screen === 'showroom') setSobre(index);
      }}
      onPointerOut={() => setSobre(null)}
      onClick={(e) => {
        e.stopPropagation();
        if (controle.current.arrasto > 6 || screen !== 'showroom') return;
        onPick(index);
      }}
    >
      <group ref={corpo}>
        <Peca
          id={produto.id}
          cor={cor}
          rough={material.rough}
          metal={material.metal}
          opacity={opacity}
        />
      </group>

      <group ref={ancora}>
        {screen === 'showroom' && (
          <Html center zIndexRange={[12, 0]} style={{ pointerEvents: 'none' }}>
            <Etiqueta nome={produto.nome} preco={BRL(produto.preco)} sobre={sobre} />
          </Html>
        )}
      </group>
    </group>
  );
}

function Etiqueta({ nome, preco, sobre }: { nome: string; preco: string; sobre: boolean }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 9,
        padding: '6px 12px',
        border: '1px solid ' + (sobre ? paleta.laranja : 'rgba(0,30,90,0.2)'),
        borderRadius: 100,
        background: sobre ? paleta.laranja : 'rgba(255,248,242,0.86)',
        color: paleta.azul,
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        whiteSpace: 'nowrap',
        opacity: sobre ? 1 : 0.5,
        transform: 'scale(' + (sobre ? 1 : 0.94) + ')',
        transition:
          'opacity 0.22s ease, background 0.22s ease, color 0.22s ease, transform 0.22s ease',
      }}
    >
      <span style={{ fontSize: 12, letterSpacing: '0.01em' }}>{nome}</span>
      <span
        style={{ width: 3, height: 3, borderRadius: 100, background: 'currentColor', opacity: 0.4 }}
      />
      <span style={{ fontSize: 12, fontVariantNumeric: 'tabular-nums', opacity: 0.75 }}>
        {preco}
      </span>
    </div>
  );
}
