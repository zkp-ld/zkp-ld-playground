import { Url, RemoteDocument } from 'jsonld/jsonld-spec';

import { CONTEXTS } from './contexts';
import exampleDidDoc from "./data/exampleDidDoc.json";

const _prepareDocs = (obj: any): [string, string][] =>
  Object.entries(obj).map((e: [string, any]) => [
    e[0],
    JSON.stringify(e[1], null, 2),
  ]);

const _builtinDIDDocs = {
  "example": exampleDidDoc,
};
export const builtinDIDDocs = new Map(_prepareDocs(_builtinDIDDocs));

export const customLoader = async (
  url: Url,
  _callback: (err: Error, remoteDoc: RemoteDocument) => void,
  // eslint-disable-next-line @typescript-eslint/require-await
): Promise<RemoteDocument> => {
  if (url in CONTEXTS) {
    return {
      contextUrl: undefined, // this is for a context via a link header
      documentUrl: url, // this is the actual context URL after redirects
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      document: CONTEXTS[url], // this is the actual document that was loaded
    } as RemoteDocument;
  }

  // call the default documentLoader
  //return nodeDocumentLoader(url);
  return {
    contextUrl: undefined,
    documentUrl: url,
    document: {},
  } as RemoteDocument;
};
