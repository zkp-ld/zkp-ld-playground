# ZKP-LD Playground

**Experimental**: Do not use in production

- Playground for ZKP-LD: Zero-Knowledge Proof of Linked Data
- You can sign and verify JSON-LD-based Verifiable Credentials (VCs) using a experimental version of BBS+ signatures with Data Integrity
- You can derive and verify proofs from multiple VCs, supporting "user-friendly" selective disclosure and proof of termwise equality

## [v1](https://github.com/zkp-ld/zkp-ld-playground/tree/v1)

- Based on a [forked extension](https://github.com/zkp-ld/jsonld-signatures-bbs) of MATTR's [jsonld-signatures-bbs](https://github.com/mattrglobal/jsonld-signatures-bbs)
- Hosted at <https://playground.zkp-ld.org>

## [v2](https://github.com/zkp-ld/zkp-ld-playground/tree/v2)

- Built on [jsonld-proofs](https://github.com/zkp-ld/jsonld-proofs), [rdf-proofs-wasm](https://github.com/zkp-ld/rdf-proofs-wasm), [rdf-proofs](https://github.com/zkp-ld/rdf-proofs), and [docknetwork/crypto](https://github.com/docknetwork/crypto)
- Supports "user-friendly" selective disclosure (TODO: elaborate further)
- Hosted at <https://playground.zkp-ld.org/v2>

## Prerequisites for development

- Node.js
- npm

## How to run a local server

Clone this repository and run the app:

```bash
$ git clone https://github.com/zkp-ld/zkp-ld-playground.git
$ cd zkp-ld-playground
$ npm install
$ npm run dev
```

Then, open [http://localhost:5173](http://localhost:5173) to view it in your browser.
