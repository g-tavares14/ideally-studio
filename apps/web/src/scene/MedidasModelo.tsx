import { Billboard, Text } from '@react-three/drei';
import { formatarMedidaCm } from '@cria-forma/shared';
import type { Encaixe } from './caixa';
import { COTA, cotasDoEncaixe, type Cota, type Ponto3D } from './cotas';
import type { DimensoesCm } from './dimensoes';

interface Acabamento {
  cor: string;
  rough: number;
  metal: number;
}

interface MedidasModeloProps extends Acabamento {
  encaixe: Pick<Encaixe, 'largura' | 'altura' | 'profundidade'>;
  dimensoes: DimensoesCm;
}

export default function MedidasModelo({
  encaixe,
  dimensoes,
  cor,
  rough,
  metal,
}: MedidasModeloProps) {
  const cotas = cotasDoEncaixe(encaixe, {
    altura: formatarMedidaCm(dimensoes.altura),
    largura: formatarMedidaCm(dimensoes.largura),
    profundidade: formatarMedidaCm(dimensoes.profundidade),
  });

  return (
    <>
      {cotas.map((cota) => (
        <VetorMedida key={cota.eixo} cota={cota} cor={cor} rough={rough} metal={metal} />
      ))}
    </>
  );
}

function VetorMedida({ cota, cor, rough, metal }: { cota: Cota } & Acabamento) {
  return (
    <>
      <PontaVetor
        position={cota.inicio}
        rotation={cota.inicioRotacao}
        cor={cor}
        rough={rough}
        metal={metal}
      />
      <PontaVetor
        position={cota.fim}
        rotation={cota.fimRotacao}
        cor={cor}
        rough={rough}
        metal={metal}
      />
      <Billboard position={cota.textoPosicao} follow>
        <Text
          anchorX="center"
          anchorY="middle"
          color={COTA.texto}
          depthOffset={-1}
          fontSize={COTA.fonte}
          outlineColor={COTA.textoContorno}
          outlineWidth={COTA.outline}
        >
          {cota.texto}
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
} & Acabamento) {
  return (
    <mesh position={position} rotation={rotation} castShadow>
      <coneGeometry args={[COTA.pontaRaio, COTA.pontaAltura, 8]} />
      <meshStandardMaterial color={cor} roughness={rough} metalness={metal} />
    </mesh>
  );
}
