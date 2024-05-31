import lessThanPrvPrv from "./less_than_prv_prv_64.json";
import lessThanPrvPub from "./less_than_prv_pub_64.json";
import lessThanPubPrv from "./less_than_pub_prv_64.json";
import lessThanEqPrvPrv from "./less_than_eq_prv_prv_64.json";
import lessThanEqPrvPub from "./less_than_eq_prv_pub_64.json";
import lessThanEqPubPrv from "./less_than_eq_pub_prv_64.json";

const exampleSnarkProvingKeysObjs = [
  lessThanPrvPrv,
  lessThanPrvPub,
  lessThanPubPrv,
  lessThanEqPrvPrv,
  lessThanEqPrvPub,
  lessThanEqPubPrv,
];

export const exampleSnarkProvingKeys = new Map(
  exampleSnarkProvingKeysObjs.map((obj) => [
    obj.id,
    {
      r1cs: obj.r1cs,
      wasm: obj.wasm,
      provingKey: obj.provingKey,
    },
  ])
);
