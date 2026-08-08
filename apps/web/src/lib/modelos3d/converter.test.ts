import { describe, expect, it } from 'vitest';
import { converter3mfParaGlb } from './converter';

const TETRAEDRO_3MF_BASE64 =
  'UEsDBBQAAAAIANmsB12ERBesxgAAAEUBAAATAAAAW0NvbnRlbnRfVHlwZXNdLnhtbIWQ3UrEMBCF7/cpwtxKm6ogIm33wp8nWB9gSKc/mExCMl3Wt3e6qwiC7OVwvjkfnHZ/Ct4cKZclcge3dQOG2MVh4amD98Nb9Qj7ftcePhMVoyyXDmaR9GRtcTMFLHVMxJqMMQcUPfNkE7oPnMjeNc2DdZGFWCrZOqDfGdO+0IirF/N60uSizuQLmOcLu+k6wJT84lA0t0ce/oiqb0mtn2emzEsqNwqA/U8S4kD+iiX8Nt8PAXkd0cmadZBK763gx9Ha8yz9F1BLAwQUAAAACADZrAddCeSUPbMAAAAHAQAACwAAAF9yZWxzLy5yZWxzZY9LCsIwEIb3niLM3k5rQURMuxHBrdQDhHT6wOZBkore3lEQLG4Ghpn/8R3qh5nEnUIcnZVQZDkIstq1o+0lXJvTegd1tTpcaFKJX+Iw+ihYY6OEISW/R4x6IKNi5jxZvnQuGJV4DT16pW+qJ9zk+RbDrwdUKyEWtqJRoackAcsjlq1xLU3ZZ4I4txJYzuWap6e/ZDPq4KLrUqadeWuVnTul0xwYg8OLEvPi6wnIPLgAql5QSwMEFAAAAAgA2awHXRuk+PUyAQAAzgIAABAAAAAzRC8zZG1vZGVsLm1vZGVsjZJLbsMgEIb3OQVin0xsq1IVYUfqogeo0gM4eNJQ8YgAR05P38EozUupvAHN8M3PPwxiPRjNjuiDcrbmxWLJGVrpOmW/av65eZ+/8nUzE8Z1qFlvVay5UVorgxE9Z1S90m1iD3H+9jEmbKj5PsbDCiDIPZo2LIyS3gW3iwvpDFSdaW2/a2XsPd0D0nmEclm8wLLkzYwx4TG43ksMKaLYbb9RRqY6sshZPB2QbCRLnNnWULDB6FvsvBvrxxqDYX8OKKQeo/pTvEriwIaaU9+ncf1JKzyh6PIJVNYidgKVtYprSsCjVxG9omfWd/7PWXYsRqljWfOStupO8glKFhNaTUCrjJb/oUnuYuBGVcBDAwIuExKQJzwOH26mL7a90l0jVETDMpW/ATQC8tmMpNJnaH4BUEsBAhQAFAAAAAgA2awHXYREF6zGAAAARQEAABMAAAAAAAAAAAAAAAAAAAAAAFtDb250ZW50X1R5cGVzXS54bWxQSwECFAAUAAAACADZrAddCeSUPbMAAAAHAQAACwAAAAAAAAAAAAAAAAD3AAAAX3JlbHMvLnJlbHNQSwECFAAUAAAACADZrAddG6T49TIBAADOAgAAEAAAAAAAAAAAAAAAAADTAQAAM0QvM2Rtb2RlbC5tb2RlbFBLBQYAAAAAAwADALgAAAAzAwAAAAA=';

function decodificarBase64(base64: string): ArrayBuffer {
  const bytes = Uint8Array.from(atob(base64), (caractere) => caractere.charCodeAt(0));
  const conteudo = new ArrayBuffer(bytes.byteLength);
  new Uint8Array(conteudo).set(bytes);
  return conteudo;
}

describe('converter3mfParaGlb', () => {
  it('rejeita conteúdo que não seja um pacote 3MF válido', async () => {
    const arquivo = new File(['conteúdo inválido'], 'modelo.3mf', {
      type: 'model/3mf',
    });

    await expect(converter3mfParaGlb(arquivo)).rejects.toThrow(
      'O arquivo não é um pacote 3MF válido.',
    );
  });

  it('converte um 3MF mínimo para GLB 2 binário', async () => {
    const arquivo = new File([decodificarBase64(TETRAEDRO_3MF_BASE64)], 'tetraedro.3mf', {
      type: 'model/3mf',
    });

    const resultado = await converter3mfParaGlb(arquivo);
    const cabecalho = new DataView(
      resultado.arquivoGlb.buffer,
      resultado.arquivoGlb.byteOffset,
      12,
    );

    expect(resultado.triangulos).toBe(4);
    expect(cabecalho.getUint32(0, true)).toBe(0x46546c67);
    expect(cabecalho.getUint32(4, true)).toBe(2);
    expect(cabecalho.getUint32(8, true)).toBe(resultado.arquivoGlb.byteLength);
  });
});
