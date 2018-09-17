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

  describe(Set.prototype.add.name, function () {

    it('it adds any elements to a non rule-based set', function () {
      const set = new Set()
      const compare = []
      for (let i = 0; i < 10; i++) {
        set.add(i)
        compare.push(i)
      }
      assert.deepEqual(set.toArray(),compare)
    })

    it ('passes on elements, that obey the ruleset', function () {
      const set = new Set([], isInt)
      const compare = []
      for (let i = 0; i < 10; i++) {
        set.add(i)
        compare.push(i)
      }
      assert.deepEqual(set.toArray(),compare)
    })

    it ('throws on elements, that don\'t obey the ruleset', function () {
      assert.throws(function () {
        const set = new Set([], isInt)
        const compare = []
        for (let i = 0; i < 10; i++) {
          set.add(i/2)
          compare.push(i)
        }
      }, /does not match ruleset/)
    })
  })

  describe(Set.union.name, function () {

    it('creates a union of two sets', function () {
      const setA = new Set([1, 2])
      const union = arr => Set.union(setA, new Set(arr)).toArray().sort()

      // {1, 2} ∪ {1, 2} = {1, 2}.
      assert.deepEqual(union([1, 2]), [1,2])

      // {1, 2} ∪ {2, 3} = {1, 2, 3}.
      assert.deepEqual(union([2,3.0]), [1,2,3])

      // {1, 2, 3} ∪ {3, 4, 5} = {1, 2, 3, 4, 5}
      setA.add(3)
      assert.deepEqual(union([3,4,5]), [1,2,3,4,5])
    })

    it ('creates a union that contains the basic properties of unions', function () {
      const a = new Set([1,2,3])
      const b = new Set([3,4,5])
      const c = new Set([5,6,7])

      const aub = Set.union(a,b)
      const bua = Set.union(b,a)

      const compare = (s1, s2) => assert.deepEqual(s1.toArray().sort(), s2.toArray().sort())

      // A ∪ B = B ∪ A.
      compare(aub, bua)

      // A ∪ (B ∪ C) = (A ∪ B) ∪ C.
      const buc = Set.union(b,c)
      compare(Set.union(a, buc), Set.union(aub, c))

      // A ⊆ (A ∪ B).
      assert.isTrue(a.isSubsetOf(aub))

      // A ∪ A = A.
      assert.isTrue(Set.union(a, a).equal(a))

      // A ∪ U = U. // TODO even possible? -> https://en.wikipedia.org/wiki/Russell%27s_paradox

      // A ∪ ∅ = A.
      assert.isTrue(Set.union(a, new Set()).equal(a))

      // A ⊆ B if and only if A ∪ B = B.
      // TODO
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
