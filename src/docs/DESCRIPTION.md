# Description of ZKP-LD Playground

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

## Basic Usage

The application consists of three horizontally arranged screens:

- Issuer
- Holder
- Verifier

### Issuer Screen

On the Issuer screen, you can select a document from templates to create a VC.

### Holder Screen

On the Holder screen, the issued VC is displayed and can be verified.  
You will see `accepted` if verification succeeds.

You can create a Verifiable Presentation (VP) on the Holder screen.  
In the "Redacted Credential 1" section of the Holder screen, you can do selective disclosure by omitting specific attributes.

![Selective Disclodure for VP](/imgs/selective-disclodure.png)

As the figure above shows, only homeLocation is revealed and the other attributes are hidden.

### Verifier Screen

On the Verifier screen, you can verify the VP.

## Secret Holder Binding

TODO

## Predicate Proof

TODO
