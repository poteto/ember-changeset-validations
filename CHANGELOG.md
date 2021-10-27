# Change Log


## v4.0.0-beta.1 (2021-10-27)

#### :boom: Breaking Change
* [#326](https://github.com/poteto/ember-changeset-validations/pull/326) Breaking: Remove changeset template helper re-export ([@SergeAstapov](https://github.com/SergeAstapov))

#### :rocket: Enhancement
* [#326](https://github.com/poteto/ember-changeset-validations/pull/326) Breaking: Remove changeset template helper re-export ([@SergeAstapov](https://github.com/SergeAstapov))

#### Committers: 1
- Sergey Astapov ([@SergeAstapov](https://github.com/SergeAstapov))


## v4.0.0-beta.0 (2021-10-27)

#### :boom: Breaking Change
* [#324](https://github.com/poteto/ember-changeset-validations/pull/324) Breaking: Upgrade ember-auto-import to v2 and move it to dependencies ([@SergeAstapov](https://github.com/SergeAstapov))
* [#321](https://github.com/poteto/ember-changeset-validations/pull/321) Breaking: Drop Node.js v10 support ([@SergeAstapov](https://github.com/SergeAstapov))

#### :rocket: Enhancement
* [#327](https://github.com/poteto/ember-changeset-validations/pull/327) Allow v0.3, v0.4 and v0.5 of ember-get-config ([@SergeAstapov](https://github.com/SergeAstapov))
* [#325](https://github.com/poteto/ember-changeset-validations/pull/325) Run ember-cli-update to v3.28.3 and enable Ember v4/embroider scenarios ([@SergeAstapov](https://github.com/SergeAstapov))
* [#323](https://github.com/poteto/ember-changeset-validations/pull/323) Internal: Update eslint-plugin-ember, fix lint, run blueprint tests in CI ([@SergeAstapov](https://github.com/SergeAstapov))
* [#322](https://github.com/poteto/ember-changeset-validations/pull/322) Internal: Update ember-template-lint and fix lint issues ([@SergeAstapov](https://github.com/SergeAstapov))
* [#320](https://github.com/poteto/ember-changeset-validations/pull/320) Internal: Upgrade eslint-plugin-qunit to v7 ([@SergeAstapov](https://github.com/SergeAstapov))

#### Committers: 2
- Scott Newcomer ([@snewcomer](https://github.com/snewcomer))
- Sergey Astapov ([@SergeAstapov](https://github.com/SergeAstapov))


## v3.15.2 (2021-07-20)

#### :bug: Bug Fix
* [#305](https://github.com/poteto/ember-changeset-validations/pull/305) fix(presence on): allow for nested keys to be used in `validatePresence` -> `on` ([@velrest](https://github.com/velrest))

#### Committers: 2
- Jonas Cosandey ([@velrest](https://github.com/velrest))
- Scott Newcomer ([@snewcomer](https://github.com/snewcomer))


## v3.15.1 (2021-07-15)

#### :bug: Bug Fix
* [#312](https://github.com/poteto/ember-changeset-validations/pull/312) Bugfix: validate on render without backtracking Ember assertion ([@snewcomer](https://github.com/snewcomer))
  [Full Changelog](https://github.com/poteto/ember-changeset-validations/compare/v3.14.8...v3.15.1)

#### Committers: 1
- Scott Newcomer ([@snewcomer](https://github.com/snewcomer))

## [3.14.8](https://github.com/poteto/ember-changeset-validations/tree/v3.14.8) (2021-07-08)
[Full Changelog](https://github.com/poteto/ember-changeset-validations/compare/v3.14.7...v3.14.8)

Bump ember-validators to 4.0.0.  This was a major breaking change so ensure your app does not accidentally bump to ember-validators 4.0.0.

https://github.com/poteto/ember-changeset-validations/pull/308

## [3.14.7](https://github.com/poteto/ember-changeset-validations/tree/v3.14.7) (2021-06-07)
[Full Changelog](https://github.com/poteto/ember-changeset-validations/compare/v3.14.5...v3.14.7)

## [3.14.4](https://github.com/poteto/ember-changeset-validations/tree/v3.14.4) (2021-05-21)
[Full Changelog](https://github.com/poteto/ember-changeset-validations/compare/v3.11.0...v3.14.4)

- Embroider support
- Various validated-changeset improvements and bugfixes

## [3.11.0](https://github.com/poteto/ember-changeset-validations/tree/v3.11.0) (2021-01-30)
[Full Changelog](https://github.com/poteto/ember-changeset-validations/compare/v3.10.3...v3.11.0)

- Fix cyclical bug with ember data models

## [3.10.2](https://github.com/poteto/ember-changeset-validations/tree/v3.10.2) (2020-12-05)
[Full Changelog](https://github.com/poteto/ember-changeset-validations/compare/v3.10.1...v3.10.2)

## [3.10.1](https://github.com/poteto/ember-changeset-validations/tree/v3.10.1) (2020-12-05)
[Full Changelog](https://github.com/poteto/ember-changeset-validations/compare/v3.4.0...v3.10.1)

## [3.10.1](https://github.com/poteto/ember-changeset-validations/tree/v3.10.1) (2020-12-05)
[Full Changelog](https://github.com/poteto/ember-changeset-validations/compare/v3.4.0...v3.10.1)

## [3.4.0](https://github.com/poteto/ember-changeset-validations/tree/v3.4.0) (2020-05-26)
[Full Changelog](https://github.com/poteto/ember-changeset-validations/compare/v3.2.0...v3.4.0)

- Implement recursive proxy solution in e-c [#249](https://github.com/poteto/ember-changeset-validations/pull/249)
- Validate nested fields and various other improvements [#248](https://github.com/poteto/ember-changeset-validations/pull/248)
- Allow message in Date validator [#247](https://github.com/poteto/ember-changeset-validations/pull/247)
- Use validated-changeset lookup [#243](https://github.com/poteto/ember-changeset-validations/pull/243)

## [3.2.0](https://github.com/poteto/ember-changeset-validations/tree/v3.2.0) (2020-04-25)
[Full Changelog](https://github.com/poteto/ember-changeset-validations/compare/v3.1.1...v3.2.0)

- Ensure validation for single results returns primitive instead of array [#241](https://github.com/poteto/ember-changeset-validations/pull/241)

## [3.0.0](https://github.com/poteto/ember-changeset-validations/tree/v3.0.0) (2020-02-02)
[Full Changelog](https://github.com/poteto/ember-changeset-validations/compare/v3.0.0-beta.0...v3.0.0)

- Supports only Ember 3.13 and above. No breaking changes other than ember-source >= 3.13 and >= Node 10
- Add Date validator [#218](https://github.com/poteto/ember-changeset-validations/pull/218)
- Minimum Node 10 [#212](https://github.com/poteto/ember-changeset-validations/pull/212)

## [3.0.0-beta](https://github.com/poteto/ember-changeset-validations/tree/v3.0.0-beta.0) (2019-11-27)
[Full Changelog](https://github.com/poteto/ember-changeset-validations/compare/v2.1.2...v3.0.0-beta.0)

- [MAJOR]: 3.0.0 beta [#205](https://github.com/poteto/ember-changeset-validations/pull/205)

## [2.2.1](https://github.com/poteto/ember-changeset-validations/tree/v2.2.1) (2019-11-14)
[Full Changelog](https://github.com/poteto/ember-changeset-validations/compare/v2.2.0...v2.2.1)

- [BUGFIX]: handleMultipleValidations should work properly [#203](https://github.com/poteto/ember-changeset-validations/pull/203)


## [2.2.0](https://github.com/poteto/ember-changeset-validations/tree/v2.2.0) (2019-11-04)
[Full Changelog](https://github.com/poteto/ember-changeset-validations/compare/v2.1.1...v2.2.0)

- [MINOR] - changeset helper reexport [#198](https://github.com/poteto/ember-changeset-validations/pull/198)

## [2.1.1](https://github.com/poteto/ember-changeset-validations/tree/v2.1.1) (2019-11-03)
[Full Changelog](https://github.com/poteto/ember-changeset-validations/compare/v2.0.0...v2.1.0)

- [MINOR] - changeset helper reexport [#199](https://github.com/poteto/ember-changeset-validations/pull/199)

## [2.1.0](https://github.com/poteto/ember-changeset-validations/tree/v2.1.0) (2019-02-25)
[Full Changelog](https://github.com/poteto/ember-changeset-validations/compare/v2.0.0...v2.1.0)

- Add `on` option for validatePresence [#191](https://github.com/poteto/ember-changeset-validations/pull/191)
