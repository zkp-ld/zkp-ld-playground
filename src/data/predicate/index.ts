import lessThanPrvPrv from "./lessThanPrvPrv.json";
import lessThanPrvPub from "./lessThanPrvPub.json";
import lessThanPubPrv from "./lessThanPubPrv.json";
import lessThanEqPrvPrv from "./lessThanEqPrvPrv.json";
import lessThanEqPrvPub from "./lessThanEqPrvPub.json";
import lessThanEqPubPrv from "./lessThanEqPubPrv.json";

export const examplePredicates = new Map<string, Object>([
  ["private < public", lessThanPrvPub],
  ["private <= public", lessThanEqPrvPub],
  ["public < private", lessThanPubPrv],
  ["public <= private", lessThanEqPubPrv],
  ["private < private", lessThanPrvPrv],
  ["private <= private", lessThanEqPrvPrv],
]);
