declare module 'snarkjs' {
  export const groth16: any;
  export const plonk: any;
  export const zKey: any;
  export const wtns: any;
  export const r1cs: any;
  export const fc: any;
  export const babyjub: any;
  export const poseidon: any;
  export const utils: any;

  const snarkjs: {
    groth16: typeof groth16;
    plonk: typeof plonk;
    zKey: typeof zKey;
    wtns: typeof wtns;
    r1cs: typeof r1cs;
    fc: typeof fc;
    babyjub: typeof babyjub;
    poseidon: typeof poseidon;
    utils: typeof utils;
    [key: string]: any;
  };

  export default snarkjs;
}
