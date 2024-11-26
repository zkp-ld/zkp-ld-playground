# ZKP-LD Playground

**Experimental**: Do not use in production

- Playground for ZKP-LD: Zero-Knowledge Proof of Linked Data
- You can sign and verify JSON-LD-based Verifiable Credentials (VCs) using a experimental version of BBS+ signatures with Data Integrity
- You can derive and verify proofs from multiple VCs, supporting "user-friendly" selective disclosure and proof of termwise equality

- Built on [jsonld-proofs](https://github.com/zkp-ld/jsonld-proofs), [rdf-proofs-wasm](https://github.com/zkp-ld/rdf-proofs-wasm), [rdf-proofs](https://github.com/zkp-ld/rdf-proofs), and [docknetwork/crypto](https://github.com/docknetwork/crypto)
- Supports "user-friendly" selective disclosure (TODO: elaborate further)

- Hosted at <https://playground.zkp-ld.org>

- For a detailed guide, visit our [documentation](public/document.pdf).

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

## Overview

ZKP-LD Playground is a web-based demonstration application for experimenting with Linked Data-based Verifiable Credentials (VCs) that support selective disclosure and zero-knowledge proofs.
It allows you to issue VCs, selectively disclose attributes when presenting them, and verify the presented VCs with predicate proofs.

This application has many features below:

- Generate Verifiable Credentials (VCs)
- Present a Verifiable Presentation (VP) from multiple VCs
- Selective disclosure
- Secret Holder Binding for VC
- Predicate Proof
  - Range Proof for Integer
  - Range Proof for Datetime

## Tutorial

You can download the document below as a file from [here](public/document.pdf).

![document-01](public/document-imgs/document-01.jpg)
![document-02](public/document-imgs/document-02.jpg)
![document-03](public/document-imgs/document-03.jpg)
![document-04](public/document-imgs/document-04.jpg)
![document-05](public/document-imgs/document-05.jpg)
![document-06](public/document-imgs/document-06.jpg)
![document-07](public/document-imgs/document-07.jpg)
![document-08](public/document-imgs/document-08.jpg)
![document-09](public/document-imgs/document-09.jpg)
![document-10](public/document-imgs/document-10.jpg)
![document-11](public/document-imgs/document-11.jpg)
![document-12](public/document-imgs/document-12.jpg)
![document-13](public/document-imgs/document-13.jpg)
![document-14](public/document-imgs/document-14.jpg)
![document-15](public/document-imgs/document-15.jpg)
![document-16](public/document-imgs/document-16.jpg)
![document-17](public/document-imgs/document-17.jpg)
![document-18](public/document-imgs/document-18.jpg)
![document-19](public/document-imgs/document-19.jpg)
