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

  describe(Set.prototype.isSubsetOf.name, function () {

    // used with https://en.wikipedia.org/wiki/Subset

    it('returns true if a set is a subset of another set', function () {
      const a = new Set([1, 2])
      const b = new Set([1, 2, 3])
      const c = new Set([1, 2, 3])
      const e = new Set()

      // The set A = {1, 2} is a proper subset of B = {1, 2, 3}, thus both expressions A ⊆ B and A ⊊ B are true.
      assert.isTrue(a.isSubsetOf(b))

      // The set D = {1, 2, 3} is a subset of E = {1, 2, 3}, thus D ⊆ E is true, and D ⊊ E is not true (false).
      assert.isTrue(c.isSubsetOf(b))

      // Any set is a subset of itself, but not a proper subset. (X ⊆ X is true, and X ⊊ X is false for any set X.)
      assert.isTrue(a.isSubsetOf(a))
      assert.isTrue(b.isSubsetOf(b))

      // The empty set { }, denoted by ∅, is also a subset of any given set X. It is also always a proper subset of any set except itself.
      assert.isTrue(e.isSubsetOf(a))
      assert.isTrue(e.isSubsetOf(b))
      assert.isTrue(e.isSubsetOf(e))

      // TODO
      // The set {x: x is a prime number greater than 10} is a proper subset of {x: x is an odd number greater than 10}

      // TODO
      // The set of natural numbers is a proper subset of the set of rational numbers; likewise,
      // the set of points in a line segment is a proper subset of the set of points in a line.
      // These are two examples in which both the subset and the whole set are infinite,
      // and the subset has the same cardinality (the concept that corresponds to size,
      // that is, the number of elements, of a finite set) as the whole;
      // such cases can run counter to one's initial intuition.

      // TODO
      // The set of rational numbers is a proper subset of the set of real numbers.
      // In this example, both sets are infinite but the latter set has a larger cardinality (or power)
      // than the former set.
    })

    it('returns false, if a set is not a subset of another set', function () {
      const a = new Set([1, 2])
      const b = new Set([1, 2, 3])
      const c = new Set([1, 2, 3])
      const e = new Set()

      assert.isFalse(b.isSubsetOf(a))
    })

    it('does not alter the involved sets', function () {
      const a = new Set([1, 2])
      const b = new Set([1, 2, 3])
      assert.isTrue(a.isSubsetOf(b))
      assert.deepEqual(a.toArray(), [1, 2])
      assert.deepEqual(b.toArray(), [1, 2, 3])
    })
  })

  describe(Set.prototype.properSubsetOf.name, function () {
    it('is returns true if a set is a proper subset of another set', function () {
      const a = new Set([1, 2])
      const b = new Set([1, 2, 3])
      const c = new Set([1, 2, 3])
      const e = new Set()

      // The set A = {1, 2} is a proper subset of B = {1, 2, 3}, thus both expressions A ⊆ B and A ⊊ B are true.
      assert.isTrue(a.properSubsetOf(b))

      // The empty set { }, denoted by ∅, is also a subset of any given set X. It is also always a proper subset of any set except itself.
      assert.isTrue(e.properSubsetOf(a))
      assert.isTrue(e.properSubsetOf(b))

    })

    it('returns false if a set is not a proper subset of another set', function () {
      const a = new Set([1, 2])
      const b = new Set([1, 2, 3])
      const c = new Set([1, 2, 3])
      const e = new Set()

      // The set D = {1, 2, 3} is a subset of E = {1, 2, 3}, thus D ⊆ E is true, and D ⊊ E is not true (false).
      assert.isFalse(c.properSupersetOf(b))

      // Any set is a subset of itself, but not a proper subset. (X ⊆ X is true, and X ⊊ X is false for any set X.)
      assert.isFalse(a.properSupersetOf(a))
      assert.isFalse(b.properSupersetOf(b))

      // The empty set { }, denoted by ∅, is also a subset of any given set X. It is also always a proper subset of any set except itself.
      assert.isFalse(e.properSupersetOf(e))
    })

    it('does not alter the involved sets', function () {
      const a = new Set([1, 2])
      const b = new Set([1, 2, 3])
      assert.isTrue(a.properSubsetOf(b))
      assert.deepEqual(a.toArray(), [1, 2])
      assert.deepEqual(b.toArray(), [1, 2, 3])
    })
  })

  describe(Set.prototype.isSupersetOf.name, function () {

    it('returns true if a set is a superset of another set', function () {
      assert.fail()
    })

    it('returns false if a set is not a superset of another set', function () {
      assert.fail()
    })

    it('does not alter the involved sets', function () {
      assert.fail()
    })
  })

  describe(Set.prototype.properSupersetOf.name, function () {

    it('is not implemented', function () {
      assert.fail()
    })
  })

  describe(Set.prototype.equal.name, function () {

    it('returns true, if it is equal to another set', function () {
      const set1 = new Set([1, 2, 3, 4])
      const set2 = new Set([1, 1, 2, 2, 3, 3, 4, 4])
      assert.isTrue(set1.equal(set2))
      assert.isFalse(set1 === set2)
    })

    it('returns false, if it is equal to another set', function () {
      const set1 = new Set([1, 2, 3, 4])
      const set2 = new Set([1, 2, 3, 4, 5])
      assert.isFalse(set1.equal(set2))
      assert.isFalse(set1 === set2)
    })

    it('throws if the other set is not a set', function () {
      assert.throws(function () {
        new Set([1, 2, 3, 4]).equal([1, 2, 3, 4])
      })
    })

    it('does not alter the involved sets', function () {
      assert.fail()
    })
  })

})

describe('Operations (static)', function () {

  describe(Set.prototype.add.name, function () {

    it('it adds any elements to a non rule-based set', function () {
      const set = new Set()
      const compare = []
      for (let i = 0; i < 10; i++) {
        set.add(i)
        compare.push(i)
      }
      assert.deepEqual(set.toArray(), compare)
    })

    it('passes on elements, that obey the ruleset', function () {
      const set = new Set([], isInt)
      const compare = []
      for (let i = 0; i < 10; i++) {
        set.add(i)
        compare.push(i)
      }
      assert.deepEqual(set.toArray(), compare)
    })

    it('throws on elements, that don\'t obey the ruleset', function () {
      assert.throws(function () {
        const set = new Set([], isInt)
        const compare = []
        for (let i = 0; i < 10; i++) {
          set.add(i / 2)
          compare.push(i)
        }
      }, /does not match ruleset/)
    })

    it('does not alter the involved sets', function () {
      assert.fail()
    })
  })

  describe(Set.union.name, function () {

    // use with https://en.wikipedia.org/wiki/Union_(set_theory)

    it('creates a union of two sets', function () {
      const setA = new Set([1, 2])
      const union = arr => Set.union(setA, new Set(arr)).toArray().sort()

      // {1, 2} ∪ {1, 2} = {1, 2}.
      assert.deepEqual(union([1, 2]), [1, 2])

      // {1, 2} ∪ {2, 3} = {1, 2, 3}.
      assert.deepEqual(union([2, 3.0]), [1, 2, 3])

      // {1, 2, 3} ∪ {3, 4, 5} = {1, 2, 3, 4, 5}
      setA.add(3)
      assert.deepEqual(union([3, 4, 5]), [1, 2, 3, 4, 5])
    })

    it('creates a union that contains the basic properties of unions', function () {
      const a = new Set([1, 2, 3])
      const b = new Set([3, 4, 5])
      const c = new Set([5, 6, 7])

      const aub = Set.union(a, b)
      const bua = Set.union(b, a)

      const compare = (s1, s2) => assert.deepEqual(s1.toArray().sort(), s2.toArray().sort())

      // A ∪ B = B ∪ A.
      compare(aub, bua)

      // A ∪ (B ∪ C) = (A ∪ B) ∪ C.
      const buc = Set.union(b, c)
      compare(Set.union(a, buc), Set.union(aub, c))

      // A ⊆ (A ∪ B).
      assert.isTrue(a.isSubsetOf(aub))

      // A ∪ A = A.
      assert.isTrue(Set.union(a, a).equal(a))

      // A ∪ U = U. // TODO even possible to test here? -> https://en.wikipedia.org/wiki/Russell%27s_paradox

      // A ∪ ∅ = A.
      assert.isTrue(Set.union(a, new Set()).equal(a))

      // A ⊆ B if and only if A ∪ B = B.
      // TODO
    })

    it('does not alter the involved sets', function () {
      const a = new Set([1, 2, 3])
      const b = new Set([3, 4, 5])

      const aub = Set.union(a, b)
      const bua = Set.union(b, a)
      assert.equal(aub.size, bua.size)

      assert.deepEqual(a.toArray(), [1,2,3])
      assert.deepEqual(b.toArray(), [3,4,5])
    })

  })

  describe(Set.intersect.name, function () {

    // use with https://en.wikipedia.org/wiki/Intersection_(set_theory)

    it('returns a set of all objects that are members of both the sets A and B', function () {
      // The intersection of the sets {1, 2, 3} and {2, 3, 4} is {2, 3}.
      const set1 = new Set([1, 2, 3])
      const set2 = new Set([2, 3, 4])
      assert.deepEqual(Set.intersect(set1, set2).toArray().sort(), [2, 3])

      // The number 9 is not in the intersection of the set of prime numbers {2, 3, 5, 7, 11, ...}
      // and the set of odd numbers {1, 3, 5, 7, 9, 11, ...}, because 9 is not prime.
      const prms = new Set([2, 3, 5, 7, 11])
      const odds = new Set([1, 3, 5, 7, 9])
      assert.isFalse(Set.intersect(prms, odds).has(9))

      // Intersection is an associative operation; that is, for any sets A, B, and C, one has A ∩ (B ∩ C) = (A ∩ B) ∩ C.
      const a = new Set([1,2,3])
      const b = new Set([3,4,5])
      const c = new Set([5,6,7])

      const aib = Set.intersect(a,b)
      const bic = Set.intersect(b,c)
      assert.isTrue(Set.intersect(a, bic).equal(Set.intersect(aib, c)))

      // Intersection is also commutative; for any A and B, one has A ∩ B = B ∩ A.
      const bia = Set.intersect(b,a)
      assert.isTrue(aib.equal(bia))
    })

    it('does not alter the involved sets', function () {
      const set1 = new Set([1, 2, 3])
      const set2 = new Set([2, 3, 4])
      assert.deepEqual(Set.intersect(set1, set2).toArray().sort(), [2, 3])
      assert.deepEqual(set1.toArray(), [1, 2, 3])
      assert.deepEqual(set2.toArray(), [2, 3, 4])
    })
  })

  describe(Set.complement.name, function () {

    // used with https://en.wikipedia.org/wiki/Complement_(set_theory)

    it('returns the complement of a set from another', function () {
      const a = new Set([1,2])
      const b = new Set([1,3])
      const c = new Set([1,2,3,4])
      const e = new Set([])

      // {1, 2} \ {1, 2} = ∅.
      // A \ A = ∅.
      assert.equal(Set.complement(a,a).size, 0)

      // {1, 2, 3, 4} \ {1, 3} = {2, 4}.
      assert.isTrue(Set.complement(c, b).equal(new Set([2,4])))

      // A \ B ≠ B \ A for A ≠ B.
      const acb = Set.complement(a,b)
      const bca = Set.complement(b,a)
      assert.isFalse(acb.equal(bca))

      // ∅ \ A = ∅.
      assert.equal(Set.complement(e, a).size, 0)

      // A \ ∅ = A.
      assert.isTrue(Set.complement(a, e).equal(a))

      // TODO
      // A ∪ A′ = U.
      // A ∩ A′ = ∅.
      // (A′)′ = A.
      // A \ U = ∅.
      // A \ A′ = A and A′ \ A = A′.
      // U′ = ∅ and ∅′ = U.
      // A \ B = A ∩ B′.
      // if A ⊆ B then A \ B = ∅.
    })

    it('does not alter the involved sets', function () {
      const a = new Set([1,2])
      const b = new Set([1,3])
      const acb = Set.complement(a,b)
      const bca = Set.complement(b,a)
      assert.isFalse(acb.equal(bca))

      assert.deepEqual(a.toArray(), [1,2])
      assert.deepEqual(b.toArray(), [1,3])
    })
  })

  describe('Symmetric difference', function () {

    it('is not implemented', function () {
      assert.fail()
    })

    it('does not alter the involved sets', function () {
      assert.fail()
    })
  })

  describe('Power Set', function () {

    it('is not implemented', function () {
      assert.fail()
    })

    it('does not alter the involved sets', function () {
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

    it('does not alter the involved sets', function () {
      const setA = new Set([1, 2])
      const setB = new Set([3, 4])

      const axb = Set.cartesian(setA, setB)
      const bxa = Set.cartesian(setB, setA)

      assert.deepEqual(setA.toArray(), [1,2])
      assert.deepEqual(setB.toArray(), [3,4])
    })
  })

})
