import revealTemplate from "./reveal.json";
import vpTemplate from "./vp.json";

export type VPType = {
  "@context"?: string[] | string;
  type?: string[] | string;
  id?: string;
  holder?: string;
  verifiableCredential?: any[];
  proof?: any[];
};

export { revealTemplate, vpTemplate };
