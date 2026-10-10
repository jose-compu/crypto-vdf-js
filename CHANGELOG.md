# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.4.0](https://github.com/jose-compu/crypto-vdf-js/compare/crypto-vdf-v1.3.0...crypto-vdf-v1.4.0) (2026-10-10)


### Features

* Add precomputed discriminants and fix serialization ([50aa189](https://github.com/jose-compu/crypto-vdf-js/commit/50aa189fe7af5d480bfc3d3646d6afe95bc45f4f))
* Add README example verification tests ([eedef81](https://github.com/jose-compu/crypto-vdf-js/commit/eedef813daf4146fe33f491796e5eea57d9c7aea))
* estimateDifficulty for target delay (v1.2.0) ([#16](https://github.com/jose-compu/crypto-vdf-js/issues/16)) ([1e37f0c](https://github.com/jose-compu/crypto-vdf-js/commit/1e37f0c20d76727e917a7e3b914f7785db18a0e8))


### Bug Fixes

* Resolve critical VDF bugs and add comprehensive tests ([7bd3789](https://github.com/jose-compu/crypto-vdf-js/commit/7bd378985e837042e94b162172b9443d68344285))
* Resolve linter errors for npm publish ([0a40c6a](https://github.com/jose-compu/crypto-vdf-js/commit/0a40c6ab7289ff275840a33118aaf743501c51cf))


### Performance Improvements

* Skip browser build in tests for faster execution ([8af5155](https://github.com/jose-compu/crypto-vdf-js/commit/8af5155e86f6cdf79825b048faf9aaa408ac68a1))

## [Unreleased]

## [1.3.0] - 2026-10-10

### Added

- `createVdf` / `createVDF` high-level facade with auto precomputed discriminant (#15)
- `encodeProof` / `decodeProof` (`hex`, `base64`, `json`) plus hex/base64 convenience helpers (#17)
- README examples for the facade and proof transport codecs

## [1.2.0] - 2026-07-21

### Added

- `estimateDifficulty({ bits, targetSeconds, scheme?, iterationsPerSecond? })` to map a target wall-clock delay to an iteration count (#16)
- `estimateSolveSeconds` and `getCalibratedIterationsPerSecond` helpers, plus `CALIBRATED_ITERATIONS_PER_SECOND` table
- README section on tuning difficulty for hardware

## [1.1.0] - 2026-05-19

### Added

- `CONTRIBUTING.md`, GitHub issue/PR templates, and golden regression fixtures
- TypeDoc API reference (`npm run docs`) and GitHub Pages workflow
- release-please automation for version bumps and changelog updates
- Fast CI: minimal Jest suite, VDF verify smoke test, `package-lock.json` for reproducible installs
- Verbose manual comprehensive VDF test suite with progress heartbeats

### Changed

- README examples and `VDF` types document optional precomputed discriminants
- ClassGroup/golden solve tests moved out of default Jest (use `npm run test:slow` / manual scripts)

## [1.0.6] - 2025-01-XX

### Changed

- CI workflow runs comprehensive VDF tests (`test-both-vdfs-comprehensive.js`) after unit tests

## [1.0.5] - 2025-01-XX

### Fixed

- Added `.eslintrc.json` so ESLint runs correctly in CI

## [1.0.4] - 2025-01-XX

### Added

- GitHub Actions CI (Node 18–24) and npm publish on release

## [1.0.3] - 2025-01-XX

### Changed

- README documents Pietrzak difficulty limit (≤7000) and recommends Wesolowski for production

## [1.0.0] - 2025-01-XX

### Added

- Initial release: Pietrzak and Wesolowski VDF, precomputed discriminants (256–2048 bit), browser bundle, TypeScript types

[Unreleased]: https://github.com/jose-blockchain/crypto-vdf-js/compare/v1.1.0...HEAD
[1.1.0]: https://github.com/jose-blockchain/crypto-vdf-js/compare/v1.0.6...v1.1.0
[1.0.6]: https://github.com/jose-blockchain/crypto-vdf-js/compare/v1.0.5...v1.0.6
[1.0.5]: https://github.com/jose-blockchain/crypto-vdf-js/compare/v1.0.4...v1.0.5
[1.0.4]: https://github.com/jose-blockchain/crypto-vdf-js/compare/v1.0.3...v1.0.4
[1.0.3]: https://github.com/jose-blockchain/crypto-vdf-js/compare/v1.0.0...v1.0.3
[1.0.0]: https://github.com/jose-blockchain/crypto-vdf-js/releases/tag/v1.0.0
