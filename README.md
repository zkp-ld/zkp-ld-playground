# ZKP-LD Playground

**Experimental**: do not use in production

- Playground for ZKP-LD: Zero-Knowledge Proof of Linked Data
- You can sign and verify JSON-LD document using BBS+ signatures with LD-Proofs
- You can derive and verify zero-knowledge proofs from multiple signed documents, supporting termwise selective disclosure and proof of termwise equality

## v1
- Based on a [forked extension](https://github.com/zkp-ld/jsonld-signatures-bbs) of MATTR's [jsonld-signatures-bbs](https://github.com/mattrglobal/jsonld-signatures-bbs)
- Hosted on <https://playground.zkp-ld.org>

## v2
- Based on [jsonld-proofs](https://github.com/zkp-ld/jsonld-proofs), [rdf-proofs-wasm](https://github.com/zkp-ld/rdf-proofs-wasm), [rdf-proofs](https://github.com/zkp-ld/rdf-proofs), and [docknetwork/crypto](https://github.com/docknetwork/crypto)

## prerequisite

- Node.js (v16, v18)
- npm

## usage

Clone this repository and run the app:

```bash
$ git clone https://github.com/zkp-ld/zkp-ld-playground.git
$ cd zkp-ld-playground
$ npm install
$ npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) to view it in the browser.
