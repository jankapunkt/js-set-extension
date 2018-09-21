# js-set-extension
Extending the [Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set) class in order to support properties and operations from basic set theory.

[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![Build Status](https://travis-ci.org/jankapunkt/js-set-extension.svg?branch=master)](https://travis-ci.org/jankapunkt/js-set-extension)


## Scope

Please read this first, to a get a better understanding, whether this package suits your needs.

### Completeness vs. Performance

Focus of this package is to provide a Set implementation, which can be used in context of axiomatic set theory.
Currently 

Methods are primarily designed to

* run with any values, but also values as Sets (of Sets, arbitrary depth)
* work with arbitrary (finite) numbers of sets (depending on operation, see documentation)
* conform with their respective properties (Associative, Commutative etc.)

Some algorithms grow exponentially with a raising number of sets to be processes. 
Please, see the documentation notes on the respective methods. 

### Future Implementations

Currently this package only supports finite sets. 
A future implementation should include generators to support infinite sets and function-based operations with infinite sets.

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

You can verify this by checking for the `name` property:

```javascript
Set.name // "ExtendedSet", formerly "Set"
```

## API Documentation

