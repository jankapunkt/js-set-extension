# js-set-extension
Extending the Set class in order to support mathematical set properties and operations.

[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![Build Status](https://travis-ci.org/jankapunkt/js-set-extension.svg?branch=master)](https://travis-ci.org/jankapunkt/js-set-extension)


### Completeness vs. Performance

Focus of this package is to provide a Set implementation, which can be used in context of axiomatic set theory.
Algorithms are designed to work with

* Sets of Sets (arbitrary depth)
* Arbitrary numbers of sets (depending on operation)
* Conform with their respective properties (Associative, Commutative etc.)

Some algorithms grow exponentially with a raising number of sets to be processes. 
Please, see the documentation notes on the respective methods. 