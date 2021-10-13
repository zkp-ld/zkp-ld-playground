# ZKP-LD Playground

**Experimental**: do not use in production

- Playground for ZKP-LD: Zero-Knowledge Proof of Linked Data
- You can sign and verify JSON-LD document using BBS+ signatures with LD-Proofs
- You can derive and verify zero-knowledge proofs from multiple signed documents, supporting termwise selective disclosure and proof of termwise equality
- Based on a [forked extension](https://github.com/yamdan/jsonld-signatures-bbs) of MATTR's [jsonld-signatures-bbs](https://github.com/mattrglobal/jsonld-signatures-bbs)
- Hosted on <https://playground.zkp-ld.org>

## usage

Clone this repository and run the app:

```bash
$ git clone https://github.com/yamdan/zkp-ld-playground.git
$ cd zkp-ld-playground
$ yarn start
```

Then open [http://localhost:3000](http://localhost:3000) to view it in the browser.
