import { useEffect, useMemo, useRef } from 'react';
import type { RefObject } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Billboard, Text } from '@react-three/drei';
import { CORES, MATERIAIS, TAMANHOS } from '@cria-forma/shared';
import type { Produto } from '@cria-forma/shared';
import { enquadrarCaixa, type Encaixe } from './caixa';
import { dimensoesDoProduto, formatarNumeroCm, type DimensoesCm } from './dimensoes';
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
const PONTA_MEDIDA_RAIO = 0.032;
const PONTA_MEDIDA_ALTURA = 0.08;
const PONTA_MEDIDA_MEIA_ALTURA = PONTA_MEDIDA_ALTURA / 2;

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
  const fator = Math.min(TAMANHOS.find((item) => item.id === tam)?.fator ?? 1, FATOR_MAX);

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
    () => dimensoesDoProduto(produto, encaixe, fator),
    [produto, encaixe, fator],
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

function MedidasModelo({
  encaixe,
  dimensoes,
  cor,
  rough,
  metal,
}: {
  encaixe: Encaixe;
  dimensoes: DimensoesCm;
  cor: string;
  rough: number;
  metal: number;
}) {
  const gap = 0.11;
  const frente = 0.04;
  const recuoPonta = PONTA_MEDIDA_MEIA_ALTURA;
  const xAltura = -(encaixe.largura / 2 + gap);
  const yComprimento = encaixe.altura + gap;
  const xProfundidade = encaixe.largura / 2 + gap;
  const alturaBase: [number, number, number] = [xAltura, recuoPonta, frente];
  const alturaTopo: [number, number, number] = [xAltura, encaixe.altura - recuoPonta, frente];
  const comprimentoInicio: [number, number, number] = [
    -encaixe.largura / 2 + recuoPonta,
    yComprimento,
    frente,
  ];
  const comprimentoFim: [number, number, number] = [
    encaixe.largura / 2 - recuoPonta,
    yComprimento,
    frente,
  ];
  const profundidadeInicio: [number, number, number] = [
    xProfundidade,
    encaixe.altura / 2,
    -encaixe.profundidade / 2 + recuoPonta,
  ];
  const profundidadeFim: [number, number, number] = [
    xProfundidade,
    encaixe.altura / 2,
    encaixe.profundidade / 2 - recuoPonta,
  ];
  const textoAltura = `${formatarNumeroCm(dimensoes.altura)} cm`;
  const textoComprimento = `${formatarNumeroCm(dimensoes.largura)} cm`;
  const textoProfundidade = `${formatarNumeroCm(dimensoes.profundidade)} cm`;

  return (
    <>
      <VetorMedida
        inicio={alturaBase}
        fim={alturaTopo}
        texto={textoAltura}
        inicioRotacao={[0, 0, 0]}
        fimRotacao={[0, 0, Math.PI]}
        textoPosicao={[xAltura, encaixe.altura / 2, frente]}
        cor={cor}
        rough={rough}
        metal={metal}
      />
      <VetorMedida
        inicio={comprimentoInicio}
        fim={comprimentoFim}
        texto={textoComprimento}
        inicioRotacao={[0, 0, Math.PI / 2]}
        fimRotacao={[0, 0, -Math.PI / 2]}
        textoPosicao={[0, yComprimento, frente]}
        cor={cor}
        rough={rough}
        metal={metal}
      />
      <VetorMedida
        inicio={profundidadeInicio}
        fim={profundidadeFim}
        texto={textoProfundidade}
        inicioRotacao={[Math.PI / 2, 0, 0]}
        fimRotacao={[-Math.PI / 2, 0, 0]}
        textoPosicao={[xProfundidade, encaixe.altura / 2, 0]}
        cor={cor}
        rough={rough}
        metal={metal}
      />
    </>
  );
}

type Ponto3D = [number, number, number];

function VetorMedida({
  inicio,
  fim,
  texto,
  inicioRotacao,
  fimRotacao,
  textoPosicao,
  cor,
  rough,
  metal,
}: {
  inicio: Ponto3D;
  fim: Ponto3D;
  texto: string;
  inicioRotacao: Ponto3D;
  fimRotacao: Ponto3D;
  textoPosicao: Ponto3D;
  cor: string;
  rough: number;
  metal: number;
}) {
  return (
    <>
      <PontaVetor
        position={inicio}
        rotation={inicioRotacao}
        cor={cor}
        rough={rough}
        metal={metal}
      />
      <PontaVetor position={fim} rotation={fimRotacao} cor={cor} rough={rough} metal={metal} />
      <Billboard position={textoPosicao} follow>
        <Text
          anchorX="center"
          anchorY="middle"
          color="#001E5A"
          depthOffset={-1}
          fontSize={0.075}
          outlineColor="#FFF8F2"
          outlineWidth={0.012}
        >
          {texto}
        </Text>
      </Billboard>
    </>
  );
}

function PontaVetor({
  position,
  rotation,
  cor,
  rough,
  metal,
}: {
  position: Ponto3D;
  rotation: Ponto3D;
  cor: string;
  rough: number;
  metal: number;
}) {
  return (
    <mesh position={position} rotation={rotation} castShadow>
      <coneGeometry args={[PONTA_MEDIDA_RAIO, PONTA_MEDIDA_ALTURA, 8]} />
      <meshStandardMaterial color={cor} roughness={rough} metalness={metal} />
    </mesh>
  );
}
