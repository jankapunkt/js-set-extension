<img src="https://raw.githubusercontent.com/jankapunkt/js-set-extension/master/logo.svg" width="50%"/>
<h1>Javascript Set Extensions</h1>

Polyfill for extending the Javascript [Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set) class in order to support properties and operations from basic set theory.

[![Project Status: Active – The project has reached a stable, usable state and is being actively developed.](https://www.repostatus.org/badges/latest/active.svg)](https://www.repostatus.org/#active)
[![Build Status](https://travis-ci.org/jankapunkt/js-set-extension.svg?branch=master)](https://travis-ci.org/jankapunkt/js-set-extension)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
![GitHub](https://img.shields.io/github/license/jankapunkt/js-set-extension.svg)
![npm bundle size](https://img.shields.io/bundlephobia/min/set-extensions.svg)


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

Some algorithms have runtimes that grow exponentially as you increase the number of sets they act on.  
Please, see the documentation notes on the respective methods. 

### Future Implementations

Currently this package only supports finite sets. 
A future implementation could include generators to support infinite sets and function-based operations with infinite sets. Ideas and contributions are very welcome.

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

The tests are written in mocha but it should not be that hard to get into it as it is written very intuitively.

### Linter

Please note, that the tests are very strict about code style and you can check for code style related errors using

```bash
npm run lint
```

You should fix these lint errors, since the CI server will refuse to run any tests when the linter has thrown an error.

The scripts to run these commands are also in the package.json file:

https://github.com/jankapunkt/js-set-extension/blob/master/package/package.json

## License

MIT
