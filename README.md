<img src="https://github.com/jankapunkt/js-set-extension/raw/master/logo.svg?sanitize=true" width="50%"/>
<h1>Javascript Set Extensions</h1>

Polyfill for extending the Javascript [Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set) class in order to support properties and operations from basic set theory.

[![Test suite](https://github.com/jankapunkt/js-set-extension/actions/workflows/tests.yml/badge.svg)](https://github.com/jankapunkt/js-set-extension/actions/workflows/tests.yml)
[![CodeQL Semantic Analysis](https://github.com/jankapunkt/js-set-extension/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/jankapunkt/js-set-extension/actions/workflows/codeql-analysis.yml)
[![Project Status: Active – The project has reached a stable, usable state and is being actively developed.](https://www.repostatus.org/badges/latest/active.svg)](https://www.repostatus.org/#active)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
![npm bundle size](https://img.shields.io/bundlephobia/min/set-extensions.svg)
![GitHub](https://img.shields.io/github/license/jankapunkt/js-set-extension.svg)


## Scope

Please read this first, to a get a better understanding, whether this package suits your needs.

### Completeness vs. Performance

Focus of this package is to provide a Set implementation, which can be used in context of axiomatic set theory. 

Set's class Methods are primarily designed to

* run with any values, but also values as Sets (of Sets, arbitrary depth)
* work with arbitrary (but finite) numbers of sets (depending on operation, see documentation)
* conform with their respective properties (Associative, Commutative etc.)
* don't mutate any of the given but return a new Set as result

Set's prototype Methods are in contrast designed to work as a binary operation on the current instance but they also won't mutate any of the involved Sets.

Some algorithms may grow exponentially with a raising number of sets to be processes. 
Please, see the documentation notes on the respective methods. 

### Future Implementations

Currently this package only supports finite sets. 
A future implementation could include generators to support infinite sets and function-based operations with infinite sets. Ideas.concepts and contributions are very welcomed.

## Installation and Usage

Install this package as usual:

```
$ npm install --save set-extensions
```

Import this package in your startup code. 
The package automatically extends the global `Set` object.

```javascript
import 'set-extensions'
```

You can verify the presence of this polyfill by checking for the `__isExtended__` property:

```javascript
Set.__isExtended__ // true if this package is installed
```

## API Documentation

There is a [markdown version](./api.md) and a [html version](https://jankapunkt.github.io/js-set-extension/) of the API documentation.
If you think this documentation can be improved, please leave a pull request or open an issue.

## Run the tests

Add the description about testing in the README:

You can run the tests like the following:

```bash
$ cd js-set-extension/package
$ npm install
```

To run tests in watch mode use

```bash
$ npm run test-watch
```

or for a single run use

```bash
$ npm run test
```

The tests are written in mocha but it should not be that hard to get into it as it is written very intuitive.

### Linter

Please note, that the tests are very strict about code style and you can check for code style related errors using

```bash
npm run lint
```

You should fix these lint errors, since the CI server will reject to run any tests when the linter as thrown an error.

You can also run lint and tests all in one process using

```bash
npm run lint-test
```

The scripts to run these commands are also in the package.json file:

https://github.com/jankapunkt/js-set-extension/blob/master/package/package.json

## License

MIT
