// //////////////////////////////////////////////////////////////////////////////// //
// MIT License
//
// Copyright (c) 2018 Jan Küster
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
//   The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
//   THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//   FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//   OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.
//
// //////////////////////////////////////////////////////////////////////////////// //

/* global describe it assert */

import './index'

const assert = require('chai').assert
const isInt = n => Number.isInteger(n)

describe('Constructor', function () {

  it('allows to create empty sets', function () {
    assert.equal(new Set().size, 0)
    assert.equal(new Set([]).size, 0)
  })

  it('allows to create sets without rules', function () {
    assert.equal(new Set([0, 1, 2, 3, 3]).size, 4)
  })

  it('allows to create sets with rules', function () {
    assert.equal(new Set([0, 1, 2, 3, 3.0], isInt).size, 4)
  })

  it('throws if initial elements don\'t pass the rules check', function () {
    assert.throws(function () {
      const set = new Set([3.5], isInt)
    })
  })
})

describe('Relations', function () {

  describe('Supersets', function () {

    it('is not implemented', function () {
      assert.fail()
    })

  })

  describe('Subsets', function () {

    it('is not implemented', function () {
      assert.fail()
    })

  })

  describe('Equality', function () {

    it('is not implemented', function () {
      assert.fail()
    })

  })

})

describe('Operations', function () {

  describe('Adding Elements', function () {

    it('is not implemented', function () {
      assert.fail()
    })

  })

  describe('Union', function () {

    it('is not implemented', function () {
      assert.fail()
    })

  })

  describe('Intersection', function () {

    it('is not implemented', function () {
      assert.fail()
    })

  })

  describe('Complement', function () {

    it('is not implemented', function () {
      assert.fail()
    })

  })

  describe('Symmetric difference', function () {

    it('is not implemented', function () {
      assert.fail()
    })

  })

  describe('Power Set', function () {

    it('is not implemented', function () {
      assert.fail()
    })

  })

  describe('Cartesian Product', function () {

    it('Creates a cartesian product', function () {
      // A = {1,2}; B = {3,4}
      //
      // A × B = {1,2} × {3,4} = {(1,3), (1,4), (2,3), (2,4)}
      // B × A = {3,4} × {1,2} = {(3,1), (3,2), (4,1), (4,2)}
      const setA = new Set([1, 2])
      const setB = new Set([3, 4])

      const axb = Set.cartesian(setA, setB)
      const bxa = Set.cartesian(setB, setA)
      assert.deepEqual(axb.toArray(), [[1, 3], [1, 4], [2, 3], [2, 4]])
      assert.deepEqual(bxa.toArray(), [[3, 1], [3, 2], [4, 1], [4, 2]])
    })
  })

})
