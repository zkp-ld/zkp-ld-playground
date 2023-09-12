import * as jsonld from "jsonld";
import { Url, RemoteDocument, JsonLd } from "jsonld/jsonld-spec";

const remoteDocumentLoader = jsonld.documentLoaders.xhr();

export const customDocumentLoader =
  (documents: Map<Url, JsonLd>, allowFetch?: boolean) =>
  async (
    url: Url,
    _callback: (err: Error, remoteDoc: RemoteDocument) => void
  ): Promise<RemoteDocument> => {
    const context = documents.get(url);
    if (context) {
      return {
        contextUrl: undefined,
        document: context,
        documentUrl: url,
      };
    }

    if (allowFetch === true) {
      return await remoteDocumentLoader(url);
    }

    throw new Error(
      `Error attempted to load document remotely, please cache '${url}'`
    );
  };
