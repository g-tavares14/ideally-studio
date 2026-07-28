import { modeloDe } from './modelos';

export interface PecaProps {
  id: string;
  /** cor do acabamento, em hex */
  cor: string;
  rough: number;
  metal: number;
  /** 1, ou 0.35 quando a peça está fora de foco */
  opacity: number;
}

/**
 * Uma peça já encaixada na caixa padrão: apoiada em y = 0 e centrada em X/Z,
 * de modo que quem a monta só precisa posicionar o topo do pedestal.
 *
 * O acabamento entra por prop — nada é mutado. É por isso que voltar ao
 * showroom devolve a peça ao padrão sozinho: basta o React renderizar de novo.
 */
export default function Peca({ id, cor, rough, metal, opacity }: PecaProps) {
  const { partes, encaixe } = modeloDe(id);

  return (
    <group position={encaixe.offset} scale={encaixe.escala}>
      {partes.map((p, i) => (
        <mesh key={i} geometry={p.geo} position={p.pos} rotation={p.rot} castShadow receiveShadow>
          <meshStandardMaterial
            color={cor}
            roughness={rough}
            metalness={metal}
            transparent={opacity < 1}
            opacity={opacity}
          />
        </mesh>
      ))}
    </group>
  );
}
