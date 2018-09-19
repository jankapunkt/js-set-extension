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

function areEqual (set1, set2) {
  assert.isTrue(set1.equal(set2))
}

function areNotEqual (set1, set2) {
  assert.isFalse(set1.equal(set2))
}

const isInt = n => Number.isInteger(n)
const set = (...args) => new Set([...args])

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

      assert.isFalse(b.isSubsetOf(a))
    })

    it('recursively respects nested sets', function () {

      const a = set(set(1), set(2))
      const b = set(set(1), set(2), set(3))
      const c = set(set(1), set(2), set(3))
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
      assert.isFalse(c.properSubsetOf(b))

      // Any set is a subset of itself, but not a proper subset. (X ⊆ X is true, and X ⊊ X is false for any set X.)
      assert.isFalse(a.properSubsetOf(a))
      assert.isFalse(b.properSubsetOf(b))

      // The empty set { }, denoted by ∅, is also a subset of any given set X. It is also always a proper subset of any set except itself.
      assert.isFalse(e.properSubsetOf(e))
    })

    it('recursively respects nested sets', function () {
      const a = set(set(1), set(2))
      const b = set(set(1), set(2), set(3))
      const c = set(set(1), set(2), set(3))
      const e = new Set()

      // The set D = {1, 2, 3} is a subset of E = {1, 2, 3}, thus D ⊆ E is true, and D ⊊ E is not true (false).
      assert.isFalse(c.properSubsetOf(b))

      // Any set is a subset of itself, but not a proper subset. (X ⊆ X is true, and X ⊊ X is false for any set X.)
      assert.isFalse(a.properSubsetOf(a))
      assert.isFalse(b.properSubsetOf(b))

      // The empty set { }, denoted by ∅, is also a subset of any given set X. It is also always a proper subset of any set except itself.
      assert.isFalse(e.properSubsetOf(e))
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

    // used with: https://en.wikipedia.org/wiki/Subset
    // but inverses the assertions

    it('returns true if a set is a superset of another set', function () {
      const a = new Set([1, 2])
      const b = new Set([1, 2, 3])
      const c = new Set([1, 2, 3])
      const e = new Set()

      assert.isTrue(b.isSupersetOf(a))
      assert.isTrue(b.isSupersetOf(c))
      assert.isTrue(a.isSupersetOf(a))
      assert.isTrue(b.isSupersetOf(b))
      assert.isTrue(a.isSupersetOf(e))
      assert.isTrue(b.isSupersetOf(e))
      assert.isTrue(e.isSupersetOf(e))
    })

    it('returns false if a set is not a superset of another set', function () {
      const a = new Set([1, 2])
      const b = new Set([1, 2, 3])
      const e = new Set()

      assert.isFalse(a.isSupersetOf(b))
      assert.isFalse(e.isSupersetOf(a))
      assert.isFalse(e.isSupersetOf(b))
    })

    it('recursively respects nested sets', function () {
      const a = set(set(1), set(2))
      const b = set(set(1), set(2), set(3))
      const c = set(set(1), set(2), set(3))
      const e = new Set()

      assert.isTrue(b.isSupersetOf(a))
      assert.isTrue(b.isSupersetOf(c))
      assert.isTrue(a.isSupersetOf(a))
      assert.isTrue(b.isSupersetOf(b))
      assert.isTrue(a.isSupersetOf(e))
      assert.isTrue(b.isSupersetOf(e))
      assert.isTrue(e.isSupersetOf(e))
    })

    it('does not alter the involved sets', function () {
      const a = new Set([1, 2])
      const b = new Set([1, 2, 3])
      assert.isTrue(b.isSupersetOf(a))
      assert.deepEqual(a.toArray(), [1, 2])
      assert.deepEqual(b.toArray(), [1, 2, 3])
    })
  })

  describe(Set.prototype.properSupersetOf.name, function () {

    it('returns true if a set is a proper superset of another set', function () {
      const a = new Set([1, 2])
      const b = new Set([1, 2, 3])
      const e = new Set()

      assert.isTrue(b.properSupersetOf(a))
      assert.isTrue(a.properSupersetOf(e))
    })

    it('returns false if a set is not a proper superset of anoter set', function () {
      const a = new Set([1, 2])
      const b = new Set([1, 2, 3])
      const c = new Set([1, 2, 3])
      const e = new Set()

      assert.isFalse(a.properSupersetOf(a))
      assert.isFalse(b.properSupersetOf(c))
      assert.isFalse(c.properSupersetOf(b))
      assert.isFalse(e.properSupersetOf(e))
    })

    it('recursively respects nested sets', function () {
      const a = set(set(1), set(2))
      const b = set(set(1), set(2), set(3))
      const c = set(set(1), set(2), set(3))
      const e = new Set()

      assert.isTrue(b.properSupersetOf(a))
      assert.isTrue(a.properSupersetOf(e))

      assert.isFalse(a.properSupersetOf(a))
      assert.isFalse(b.properSupersetOf(c))
      assert.isFalse(c.properSupersetOf(b))
      assert.isFalse(e.properSupersetOf(e))
    })

    it('does not alter the involved sets', function () {
      const a = new Set([1, 2])
      const b = new Set([1, 2, 3])
      const e = new Set()

      assert.isTrue(b.properSupersetOf(a))
      assert.isTrue(a.properSupersetOf(e))

      assert.deepEqual(a.toArray(), [1, 2])
      assert.deepEqual(b.toArray(), [1, 2, 3])
    })
  })

  describe(Set.prototype.equal.name, function () {

    it('returns true, if a set is equal to another set', function () {
      const set1 = new Set([1, 2, 3, 4])
      const set2 = new Set([1, 1, 2, 2, 3, 3, 4, 4])
      areEqual(set1, set2)
      assert.isFalse(set1 === set2)
    })

    it('returns false, if a set is not equal to another set', function () {
      const set1 = new Set([1, 2, 3, 4])
      const set2 = new Set([1, 2, 3, 4, 5])
      areNotEqual(set1, set2)
      assert.isFalse(set1 === set2)
    })

    it('recursively respects nested sets', function () {
      const set1 = new Set([new Set([1, 2]), new Set([3, 4])])
      const set2 = new Set([new Set([1, 2]), new Set([3, 4])])

      areEqual(set1, set2)
    })

    it('throws if the other set is not a set', function () {
      assert.throws(function () {
        new Set([1, 2, 3, 4]).equal([1, 2, 3, 4])
      })
    })

    it('does not alter the involved sets', function () {
      const set1 = new Set([1, 2, 3, 4])
      const set2 = new Set([1, 2, 3, 4, 5])
      areNotEqual(set1, set2)

      assert.deepEqual(set1.toArray(), [1, 2, 3, 4])
      assert.deepEqual(set2.toArray(), [1, 2, 3, 4, 5])
    })
  })

})

describe('Operations (instances)', function () {

  describe(Set.prototype.rules.name, function () {

    it('adds a rule to a given set', function () {
      const set = new Set([1])
      assert.isUndefined(set.rules())
      set.rules(isInt)
      assert.equal(typeof set.rules(), 'function')
    })

    it('throws an error if the rule is not a funciton', function () {
      assert.throws(function () {
        const set = new Set([1])
        set.rules({})
      })
    })

  })

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

  })

})

describe('Operations (static)', function () {

  describe(Set.union.name, function () {

    // use with https://en.wikipedia.org/wiki/Union_(set_theory)
    const createUnion = setA => arr => Set.union(setA, new Set(arr)).toArray().sort()

    it('creates a union of two sets', function () {
      const setA = new Set([1, 2])
      const union = createUnion(setA)

      // {1, 2} ∪ {1, 2} = {1, 2}.
      assert.deepEqual(union([1, 2]), [1, 2])

      // {1, 2} ∪ {2, 3} = {1, 2, 3}.
      assert.deepEqual(union([2, 3.0]), [1, 2, 3])

      // {1, 2, 3} ∪ {3, 4, 5} = {1, 2, 3, 4, 5}
      setA.add(3)
      assert.deepEqual(union([3, 4, 5]), [1, 2, 3, 4, 5])
    })

    it('creates a union of n sets', function () {
      const a = set(1, 2, 3)
      const b = set(1, 2, 3)
      const c = set(3, 4, 5)
      const d = set(5, 6, 7)
      const unified = Set.union(a, b, c, d)
      assert.deepEqual(unified.toArray().sort(), [1, 2, 3, 4, 5, 6, 7])
    })

    it('creates a union that contains the basic properties of unions', function () {
      const a = new Set([1, 2, 3])
      const b = new Set([3, 4, 5])
      const c = new Set([5, 6, 7])

      const aub = Set.union(a, b)
      const bua = Set.union(b, a)

      const compare = (s1, s2) => assert.deepEqual(s1.toArray().sort(), s2.toArray().sort())

      // commutativity A ∪ B = B ∪ A.
      compare(aub, bua)

      // associativity A ∪ (B ∪ C) = (A ∪ B) ∪ C.
      const buc = Set.union(b, c)
      compare(Set.union(a, buc), Set.union(aub, c))

      // A ⊆ (A ∪ B).
      assert.isTrue(a.isSubsetOf(aub))

      // A ∪ A = A.
      assert.isTrue(Set.union(a, a).equal(a))

      // A ∪ U = U. // TODO even possible to test here? -> https://en.wikipedia.org/wiki/Russell%27s_paradox

      // A ∪ ∅ = A.
      areEqual(Set.union(a, new Set()), a)

      // A ⊆ B if and only if A ∪ B = B.
      // TODO
    })

    it('recursively respects nested sets', function () {
      const a = set(set(1), set(2))
      const b = set(set(3), set(4))
      const c = set(set(1), set(2), set(3), set(4))
      const unified = Set.union(a, b)
      areEqual(unified, c)
    })

    it('does not alter the involved sets', function () {
      const a = new Set([1, 2, 3])
      const b = new Set([3, 4, 5])

      const aub = Set.union(a, b)
      const bua = Set.union(b, a)
      assert.equal(aub.size, bua.size)

      assert.deepEqual(a.toArray(), [1, 2, 3])
      assert.deepEqual(b.toArray(), [3, 4, 5])
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
      const a = new Set([1, 2, 3])
      const b = new Set([3, 4, 5])
      const c = new Set([5, 6, 7])

      const aib = Set.intersect(a, b)
      const bic = Set.intersect(b, c)
      areEqual(Set.intersect(a, bic), Set.intersect(aib, c))

      // Intersection is also commutative; for any A and B, one has A ∩ B = B ∩ A.
      const bia = Set.intersect(b, a)
      areEqual(aib, bia)
    })

    it('returns an intersection in n sets', function () {
      const a = new Set([1, 2, 3, 4])
      const b = new Set([2, 3, 4, 5])
      const c = new Set([3, 4, 5, 6])

      const aibic = Set.intersect(a, b, c)
      const compare = set(3, 4)
      areEqual(aibic, compare)
    })

    it('recursively respects nested sets', function () {
      const a = set(set(1), set(2), set(3))
      const b = set(set(3), set(4), set(5))
      const c = set(set(7), set(6), set(7))

      const aib = Set.intersect(a, b)
      const bic = Set.intersect(b, c)
      areEqual(Set.intersect(a, bic), Set.intersect(aib, c))

      // Intersection is also commutative; for any A and B, one has A ∩ B = B ∩ A.
      const bia = Set.intersect(b, a)
      areEqual(aib, bia)
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
      const a = new Set([1, 2])
      const b = new Set([1, 3])
      const c = new Set([1, 2, 3, 4])
      const e = new Set([])

      // {1, 2} \ {1, 2} = ∅.
      // A \ A = ∅.
      assert.equal(Set.complement(a, a).size, 0)

      // {1, 2, 3, 4} \ {1, 3} = {2, 4}.
      areEqual(Set.complement(c, b), new Set([2, 4]))

      // A \ B ≠ B \ A for A ≠ B.
      const acb = Set.complement(a, b)
      const bca = Set.complement(b, a)
      areNotEqual(acb, bca)

      // ∅ \ A = ∅.
      assert.equal(Set.complement(e, a).size, 0)

      // A \ ∅ = A.
      areEqual(Set.complement(a, e), a)

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

    it('recursively respects nested sets', function () {
      const a = set(set(2), set(4))
      const b = set(set(1), set(3))
      const c = set(set(1), set(2), set(3), set(4))
      const e = new Set()

      assert.equal(Set.complement(a, a).size, 0)
      areEqual(Set.complement(c, b), set(set(2), set(4)))

      const acb = Set.complement(a, b)
      const bca = Set.complement(b, a)

      areNotEqual(acb, bca)
      assert.equal(Set.complement(e, a).size, 0)
      areEqual(Set.complement(a, e), a)
    })

    it('does not alter the involved sets', function () {
      const a = new Set([1, 2])
      const b = new Set([1, 3])
      const acb = Set.complement(a, b)
      const bca = Set.complement(b, a)
      areNotEqual(acb, bca)

      assert.deepEqual(a.toArray(), [1, 2])
      assert.deepEqual(b.toArray(), [1, 3])
    })
  })

  describe(Set.symDiff.name, function () {

    // use with https://en.wikipedia.org/wiki/Symmetric_difference

    it('returns a symmetric difference of two sets', function () {
      // the symmetric difference of the sets { 1 , 2 , 3 } and { 3 , 4 } is { 1 , 2 , 4 }
      const a = new Set([1, 2, 3])
      const b = new Set([3, 4])
      const c = new Set([4, 5, 6])
      const asdb = Set.symDiff(a, b)

      assert.isTrue(asdb.equal(new Set([1, 2, 4])))

      // The symmetric difference is equivalent to the union of both relative complements, that is:
      const unionOfRelativeComplements = Set.union(Set.complement(a, b), Set.complement(b, a))
      areEqual(asdb, unionOfRelativeComplements)

      // The symmetric difference can also be expressed as the union of the two sets, minus their intersection:
      const unionMinusIntersection = Set.complement(Set.union(a, b), Set.intersect(a, b))
      areEqual(asdb, unionMinusIntersection)

      // The symmetric difference is commutative and associative:
      const bsda = Set.symDiff(b, a)
      areEqual(asdb, bsda)

      const bsdc = Set.symDiff(b, c)
      areEqual(Set.symDiff(asdb, c), Set.symDiff(a, bsdc))
    })

    it('returns a symmetric difference of n sets', function () {
      const a = new Set([1, 2, 3, 4, 5, 6])
      const b = new Set([3, 4, 5, 6, 7, 8])  // -> minus 3, 4, 5, 6
      const c = new Set([5, 6, 7, 8, 9, 10]) // -> plus        5, 6 ,  minus 7, 8

      const tripleSymDiff = Set.symDiff(a, b, c)
      const compare = new Set([1, 2, 5, 6, 9, 10])
      areEqual(tripleSymDiff, compare)
    })

    it('recursively respects nested sets', function () {
      const a = set(set(1), set(2), set(3))
      const b = set(set(3), set(4))
      const asdb = Set.symDiff(a, b)

      areEqual(asdb, set(set(1), set(2), set(4)))
    })

    it('does not alter the involved sets', function () {
      const a = new Set([1, 2, 3])
      const b = new Set([3, 4])
      areEqual(Set.symDiff(a, b), new Set([1, 2, 4]))

      assert.deepEqual(a.toArray(), [1, 2, 3])
      assert.deepEqual(b.toArray(), [3, 4])
    })
  })

  describe(Set.power.name, function () {

    it('creates a power set including the set, empty and all subsets of S', function () {
      // the power set of the set {1, 2, 3} is {{1, 2, 3}, {1, 2}, {1, 3}, {2, 3}, {1}, {2}, {3}, ∅}
      const set = new Set([1, 2, 3])
      const pwr = Set.power(set)
      const compare = [
        new Set([1, 2, 3]),
        new Set([1, 2]),
        new Set([1, 3]),
        new Set([2, 3]),
        new Set([1]),
        new Set([2]),
        new Set([3]),
        new Set([]),
      ]
      areEqual(pwr, new Set(compare))

    })

    it('creates a powerset of n sets', function () {
      assert.fail()
    })

    it('recursively respects nested sets', function () {
      assert.fail()
    })

    it('does not alter the involved sets', function () {
      assert.fail()
    })
  })

  describe('Cartesian Product', function () {

    it('Creates a cartesian product of two sets that contains elements as ordered pairs', function () {
      // A = {1,2}; B = {3,4}
      const setA = new Set([1, 2])
      const setB = new Set([3, 4])

      // A × B = {1,2} × {3,4} = {(1,3), (1,4), (2,3), (2,4)}
      // B × A = {3,4} × {1,2} = {(3,1), (3,2), (4,1), (4,2)}
      const axb = Set.cartesian(setA, setB)
      const bxa = Set.cartesian(setB, setA)

      // note, that elements are ordered pairs!
      areEqual(axb, set([1, 3], [1, 4], [2, 3], [2, 4]))
      areEqual(bxa, set([3, 1], [3, 2], [4, 1], [4, 2]))

      // A = B = {1,2}
      const a = set(1, 2)
      const b = set(1, 2)

      // A × B = B × A = {1,2} × {1,2} = {(1,1), (1,2), (2,1), (2,2)}
      areEqual(Set.cartesian(a, b), Set.cartesian(b, a))

      // A = {1,2}; C = ∅
      const c = set()

      // A × C = {1,2} × ∅ = ∅
      // C × A = ∅ × {1,2} = ∅
      areEqual(Set.cartesian(a, c), c)
      areEqual(Set.cartesian(c, a), c)

      // Strictly speaking, the Cartesian product is not associative (unless one of the involved sets is empty).
      // ( A × B ) × C ≠ A × ( B × C )
      const d = set(1)

      // If for example A = {1}, then (A × A) × A = { ((1,1),1) } ≠ { (1,(1,1)) } = A × (A × A).
      const axa1 = Set.cartesian(Set.cartesian(a,a),a)
      const axa2 = Set.cartesian(a, Set.cartesian(a,a))

      areNotEqual(axa1, axa2)
    })

    it('Creates a cartesian product of n sets', function () {
      assert.fail()
    })

    it('recursively respects nested sets', function () {

      const set = (...args) => new Set([...args])

      const setA = new Set([set(1), set(2)])
      const setB = new Set([set(3), set(4)])

      const axb = Set.cartesian(setA, setB)
      const bxa = Set.cartesian(setB, setA)

      assert.deepEqual(axb.toArray(), [[set(1), set(2)], [1, 4], [2, 3], [2, 4]])
      assert.deepEqual(bxa.toArray(), [[3, 1], [3, 2], [4, 1], [4, 2]])
    })

    it('does not alter the involved sets', function () {
      const setA = new Set([1, 2])
      const setB = new Set([3, 4])

      const axb = Set.cartesian(setA, setB)
      const bxa = Set.cartesian(setB, setA)

      assert.deepEqual(setA.toArray(), [1, 2])
      assert.deepEqual(setB.toArray(), [3, 4])
    })
  })

  describe('esdoc added', function () {
    it('is not added', function () {
      assert.fail('nag nag nag....')
    })
  })

})
