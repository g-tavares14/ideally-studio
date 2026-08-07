import type { Ambiente } from '../types';

/** Altura da base onde o modelo começa, medida a partir do chão da cena. */
export const PLATAFORMA_ALTURA = 0.72;

/** Tudo que não é peça: fundo, chão, parede, luzes e a base de edição. */
export default function Palco({ ambiente }: { ambiente: Ambiente }) {
  const penumbra = ambiente === 'Penumbra';
  const bg = penumbra ? '#00143D' : '#FFF8F2';
  const corChao = penumbra ? '#082555' : '#F0F4FA';
  const corParede = penumbra ? '#061E4A' : '#F7F9FC';
  const corPedestal = penumbra ? '#12336A' : '#DDE6F2';

  return (
    <>
      <color attach="background" args={[bg]} />
      <fog attach="fog" args={[bg, 9, 22]} />

      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial color={corChao} roughness={0.95} />
      </mesh>

      <mesh position={[0, 12, -7]} receiveShadow>
        <planeGeometry args={[60, 24]} />
        <meshStandardMaterial color={corParede} roughness={1} />
      </mesh>

      <ambientLight intensity={penumbra ? 0.25 : 0.75} />
      <directionalLight
        position={[3.4, 7, 4.6]}
        intensity={penumbra ? 2.4 : 1.7}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-9}
        shadow-camera-right={9}
        shadow-camera-top={9}
        shadow-camera-bottom={-9}
        shadow-bias={-0.0007}
      />
      <directionalLight position={[-5, 3.5, 2.5]} intensity={penumbra ? 0.35 : 0.55} />

      <mesh position={[0, PLATAFORMA_ALTURA / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.08, PLATAFORMA_ALTURA, 1.08]} />
        <meshStandardMaterial color={corPedestal} roughness={0.9} />
      </mesh>
    </>
  );
}
