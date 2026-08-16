import { useEffect, useMemo, useRef } from 'react';
import type { RefObject } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { CORES, MATERIAIS, TAMANHOS } from '@cria-forma/shared';
import type { Produto } from '@cria-forma/shared';
import { CAIXA_PADRAO, enquadrarCaixa } from './caixa';
import { caixaComCotas } from './cotas';
import { dimensoesDoProduto } from './dimensoes';
import MedidasModelo from './MedidasModelo';
import { modeloDe } from './modelos';
import Palco, { PLATAFORMA_ALTURA } from './Palco';
import Peca from './Peca';
import type { Ambiente } from '../types';

/** Largura do painel de edição — a peça fica visualmente à esquerda dele. */
const PAINEL_PX = 440;
const FATOR_MAX = Math.max(...TAMANHOS.map((t) => t.fator));
const CAM_EDITOR = new THREE.Vector3(0, 2.45, 6.4);
const FOV = 38;
const MAT_PADRAO = MATERIAIS[0];

const limitar = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

interface Controle {
  spin: number;
  arrasto: number;
}

export interface CenaProps {
  ambiente: Ambiente;
  produto: Produto;
  mat: string;
  cor: number;
  tam: string;
  movimentoReduzido?: boolean;
}

/**
 * Preview 3D do editor de uma peça. A cena não conhece catálogo nem rota: ela
 * recebe um único produto e só existe enquanto a pessoa está configurando-o.
 */
export default function Cena(props: CenaProps) {
  const penumbra = props.ambiente === 'Penumbra';

  return (
    <div className="cf-product-canvas">
      <Canvas
        shadows={{ type: THREE.PCFSoftShadowMap }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: penumbra ? 0.95 : 1.1,
        }}
        camera={{ fov: FOV, near: 0.1, far: 100, position: CAM_EDITOR.toArray() }}
      >
        <Editor {...props} />
      </Canvas>
    </div>
  );
}

function Editor({ ambiente, produto, mat, cor, tam, movimentoReduzido }: CenaProps) {
  const { gl } = useThree();
  const controle = useRef<Controle>({ spin: 0, arrasto: 0 });
  const material = useMemo(() => MATERIAIS.find((item) => item.id === mat) ?? MAT_PADRAO, [mat]);
  const acabamento = CORES[cor] ?? CORES[0];
  const fator = TAMANHOS.find((item) => item.id === tam)?.fator ?? 1;

  useEffect(() => {
    controle.current.spin = 0;
  }, [produto.id]);

  // O canvas é uma superfície DOM criada pelo R3F; o cursor é estado visual
  // local do elemento, não estado do React.
  /* eslint-disable react-hooks/immutability */
  useEffect(() => {
    const el = gl.domElement;
    let arrastando = false;
    let lx = 0;

    const down = (e: PointerEvent) => {
      arrastando = true;
      controle.current.arrasto = 0;
      lx = e.clientX;
      el.style.cursor = 'grabbing';
    };
    const move = (e: PointerEvent) => {
      if (!arrastando) return;
      const dx = e.clientX - lx;
      lx = e.clientX;
      controle.current.arrasto += Math.abs(dx);
      controle.current.spin = limitar(
        controle.current.spin + dx * 0.008,
        -Math.PI * 2,
        Math.PI * 2,
      );
    };
    const up = () => {
      arrastando = false;
      el.style.cursor = 'grab';
    };

    el.style.cursor = 'grab';
    el.addEventListener('pointerdown', down);
    el.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    return () => {
      el.removeEventListener('pointerdown', down);
      el.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
  }, [gl]);
  /* eslint-enable react-hooks/immutability */

  return (
    <>
      <Palco ambiente={ambiente} />
      <CameraRig movimentoReduzido={movimentoReduzido} />
      <Modelo
        produto={produto}
        cor={acabamento.hex}
        rough={material.rough}
        metal={material.metal}
        fator={fator}
        controle={controle}
      />
    </>
  );
}

function CameraRig({ movimentoReduzido }: { movimentoReduzido?: boolean }) {
  const { camera, size } = useThree();
  const pos = useRef(CAM_EDITOR.clone());
  const alvo = useRef(new THREE.Vector3(0, 1.15, 0));
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
        caixa: caixaComCotas(CAIXA_PADRAO),
      }),
    [size.width, size.height],
  );

  useFrame(() => {
    const p = destPos.current;
    const a = destAlvo.current;
    a.set(enq.offsetX, PLATAFORMA_ALTURA + enq.alvoY, 0);
    p.set(enq.offsetX, PLATAFORMA_ALTURA + enq.camY, enq.camZ);

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

interface ModeloProps {
  produto: Produto;
  cor: string;
  rough: number;
  metal: number;
  fator: number;
  controle: RefObject<Controle>;
}

function Modelo({ produto, cor, rough, metal, fator, controle }: ModeloProps) {
  const corpo = useRef<THREE.Group>(null);
  const escalaAlvo = useRef(new THREE.Vector3(1, 1, 1));
  const encaixe = useMemo(() => modeloDe(produto.id).encaixe, [produto.id]);
  const dimensoes = useMemo(
    () => dimensoesDoProduto(produto.alturaCm, encaixe, fator),
    [produto.alturaCm, encaixe, fator],
  );

  useFrame((state) => {
    const grupo = corpo.current;
    if (!grupo) return;

    grupo.rotation.y +=
      (controle.current.spin + state.clock.elapsedTime * 0.06 - grupo.rotation.y) * 0.2;
    escalaAlvo.current.setScalar(fator);
    grupo.scale.lerp(escalaAlvo.current, 0.1);
  });

  return (
    <group ref={corpo} position={[0, PLATAFORMA_ALTURA, 0]}>
      <Peca id={produto.id} cor={cor} rough={rough} metal={metal} opacity={1} />
      <MedidasModelo
        encaixe={encaixe}
        dimensoes={dimensoes}
        cor={cor}
        rough={rough}
        metal={metal}
      />
    </group>
  );
}
