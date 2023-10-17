# Changelog

## [2.7.0] - 2023-10-18

### Added

- Predicate proofs generation and verification using legosnark16

### Changed

- make Tooltip enter delay longer
- Optimize user interfaces
- Upgrade dependencies

## [2.6.2] - 2023-10-02

### Fixed

- Upgrade the underlying `jsonld-proofs` to enable selective disclosure for `@set` and `@list`
  - Change `proofPurpose` of VP from `assertionMethod` to `authentication` to align with the spec

## [2.6.1] - 2023-09-29

### Fixed

- Upgrade the underlying `jsonld-proofs` to enable selective disclosure for `@set` and `@list`
  - now you can just remove elements in `@set`, whereas use a bnode id like `_:abc` to unreveal an element in `@list`
- Fix context URL for schema.org in tests to add the trailing slash

## [2.6.0] - 2023-09-28

### Added

- Blind signing feature
- PPID feature
- Options tab for Issuer, Holder, and Verifier to configure the use of blind signing and PPID

### Changed

- Upgrade dependencies

## [2.5.0] - 2023-09-14

### Added

- Breaking: update underlying json-proofs library, which causes modified outputs of issuance and verification of VC, presentation and verification of VP

## [2.4.0] - 2023-09-13

### Changed

- Update AppBar to include link to the GitHub repository and classic version (v1)
- Update `homepage` in `package.json` to set v2 as the default for the live demo

## [2.3.1] - 2023-09-13

- Enable auto detection of dark mode

## [2.3.0] - 2023-09-13

### Added

- Contexts window
- Optional feature to fetch remote contexts

### Changed

- Remove unused `@mui/x-data-grid` dependency
- Remove unnecessary contexts
- Update document loader for remote fetching
- Update context URL for data-integrity-v1

## [2.2.0] - 2023-09-07

### Changed

- Update `jsonld-proofs` dependency

## [2.1.0] - 2023-09-01

### Added

- Feature to hide literals as well as IRIs

## [2.0.0] - 2023-08-19

### Added

- Feature of diff-based selective disclosure

### Changed

- Use [jsonld-proofs](https://github.com/zkp-ld/jsonld-proofs) instead of jsonld-signatures-bbs as the underlying library
- Set the Holder's checkbox to be checked by default for issued credentials
