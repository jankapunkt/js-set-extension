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

/* global describe it */

import './index.js'
import { assert } from 'chai'

function areEqual (set1, set2) {
  assert.isTrue(set1.equal(set2))
}

function areNotEqual (set1, set2) {
  assert.isFalse(set1.equal(set2))
}

const isInt = n => Number.isInteger(n)
const set = (...args) => new Set([...args])

describe('Constructor', function () {
  it('has a flag to indicate the polyfill being present', function () {
    assert.isTrue(Set.__isExtended__)
  })

  it('keeps the name and original prototype constructor name', function () {
    assert.equal(Set.name, 'Set')
    assert.equal(Set.prototype.constructor.name, 'Set')
  })

  it('allows to create empty sets', function () {
    assert.equal(new Set().size, 0)
    assert.equal(new Set([]).size, 0)
  })

  it('allows to create sets of sets', function () {
    assert.equal(new Set([new Set()]).size, 1)
  })

  it('allows to create sets of functons', function () {
    assert.equal(new Set([isInt]).size, 1)
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
      assert.isDefined(set)
    })
  })
})

describe('Relations', function () {
  describe(Set.prototype.has.name, function () {
    it('returns true if a set has a given element', function () {
      assert.isTrue(set(1).has(1))
      assert.isTrue(set([1]).has([1]))
      assert.isTrue(set({ 1: true, 2: false }).has({ 2: false, 1: true }))
      assert.isTrue(set([{ 1: { foo: 'bar' } }]).has([{ 1: { foo: 'bar' } }]))
      assert.isTrue(set([{ 1: [{ foo: 'bar' }] }]).has([{ 1: [{ foo: 'bar' }] }]))
      assert.isTrue(set('foo').has('foo'))
      assert.isTrue(set(NaN).has(NaN))
      assert.isTrue(set(isInt).has(isInt))
      assert.isTrue(set(isInt).has(n => Number.isInteger(n)))
    })

    it('returns false if a set has not a given element', function () {
      assert.isFalse(set(1).has(2))
      assert.isFalse(set([1]).has([1, 2]))
      assert.isFalse(set({ 1: true }).has({ 1: false }))
      assert.isFalse(set({ 1: { foo: 'bar' } }).has({ 1: { foo: 'baz' } }))
      assert.isFalse(set([{ 1: [{ foo: 'bar' }] }]).has([{ 1: [{ foo: 'baz' }] }]))
      assert.isFalse(set('foo').has('foo '))
      assert.isFalse(set([undefined]).has(null))
      assert.isFalse(set([null]).has(undefined))
      assert.isFalse(set(isInt).has(function isInt (n) {
        return Number.isInteger(n)
      }))
    })

    it('works recursively for nested sets', function () {
      assert.isTrue(set(set(1), set(2)).has(set(2)))
      assert.isFalse(set(set(1), set(2)).has(set(3)))

      assert.isTrue(set(set([1, 2, 3]), set([4, 5, 6])).has(set([1, 2, 3])))
      assert.isFalse(set(set([1, 2, 3]), set([4, 5, 6])).has(set([1, 2, 3, 4])))

      assert.isTrue(set(set(isInt)).has(set(n => Number.isInteger(n))))
      assert.isFalse(set(set(isInt)).has(set(function isInt (n) {
        return Number.isInteger(n)
      })))

      const s1 = set(3)
      const s2 = set(3)
      const s3 = set()
      s3.add(s1)

      assert.isTrue(s3.has(s1))
      assert.isTrue(s3.has(s2))
    })
  })

  describe(Set.prototype.isEmpty.name, function () {
    it('returns true if the set has no elements', function () {
      assert.isTrue((new Set()).isEmpty())
      assert.isTrue((new Set([])).isEmpty())
      assert.isTrue((Set.from()).isEmpty())

      const A = new Set([1])
      A.delete(1)
      assert.isTrue(A.isEmpty())
    })

    it('returns false if the set has at least 1 element', function () {
      const A = new Set([1, 2])
      A.delete(1)
      assert.isFalse(A.isEmpty())

      const B = new Set()
      B.add('thing')
      assert.isFalse(B.isEmpty())

      const C = new Set([7])
      assert.isFalse(C.isEmpty())

      const D = Set.from(8, 8, 8, 8)
      assert.isFalse(D.isEmpty())
    })
  })

  describe(Set.prototype.randomElement.name, function () {
    // TODO: test for actual 'randomness' and for a uniform distribution, too.
    it('chooses an element in the set', function () {
      const A = new Set([2, 6, 8, 3, 'z'])
      for (let i = 0; i < 10; i++) {
        const el = A.randomElement()
        assert.isTrue(A.has(el))
      }
    })
  })

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

      areEqual(
        set(3),
        set(3)
      )
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

    it('recursively respects elements, that are in arrays', function () {
      const set1 = set([1, 2, 3], [4, 5, 6])
      const set2 = set([1, 2, 3], [4, 5, 6])
      areEqual(set1, set2)
    })

    it('recursively respected elements, that are (nested, circular etc.) objects', function () {
      const date = new Date()
      const obj1 = {
        some: 'notnoested',
        nested: {
          value: NaN,
          foo: {
            bar: undefined
          },
          date
        },
        keys: [1, 2, { b: 2, a: 1 }]
      }

      const obj2 = {
        keys: [1, 2, { a: 1, b: 2 }],
        nested: {
          foo: {
            bar: undefined
          },
          value: NaN,
          date,
          parent: this.nested
        },
        some: 'notnoested'
      }

      obj1.nested.parent = obj1
      obj2.nested.parent = obj2

      obj1.fct = function fct (a, b) { return a + b }
      obj1.fct.ref = obj1

      obj2.fct = function fct (a, b) { return a + b }
      obj2.fct.ref = obj2

      obj1.keys.push(obj1)
      obj2.keys.push(obj2)

      const set1 = set(obj1)
      const set2 = set(obj1)

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
  describe(Set.toSet.name, function () {
    it('Autowraps a value to a Set, unless it is already a Set', function () {
      const a = Set.toSet(2)
      assert.equal(a.size, 1)
      assert.equal(a.any(), 2)

      // does not convert the array to set members!
      const b = Set.toSet([1, 2])
      assert.equal(b.size, 1)
      assert.deepEqual(b.any(), [1, 2])

      const c = Set.toSet(Set.from(1, 2))
      assert.equal(c.size, 2)
      assert.deepEqual(c.any(), 1)
    })
  })
  describe(Set.prototype.any.name, function () {
    it('returns an arbitrary element of the set', function () {
      const a = new Set([1, 2])
      assert.equal(a.any(), 1)
    })
  })
  describe('binary operation args', function () {
    const a = new Set([1, 2])
    const binaryOpNames = ['union', 'intersect']
    for (const binaryOpName of binaryOpNames) {
      it('throws an error if you give it no argument', function () {
        assert.throws(function () {
          a[binaryOpName]()
        }, /The function must be given exactly 1 argument\./)
      })

      it('throws an error if you give it more than 1 argument', function () {
        assert.throws(function () {
          a[binaryOpName](a, a)
        }, /The function must be given exactly 1 argument\./)
        assert.throws(function () {
          a[binaryOpName](a, a, a)
        }, /The function must be given exactly 1 argument\./)
      })
    }
  })

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

    it('skips to add sets, which are already contained', function () {
      const set1 = set(3)
      const set2 = set(3)
      const set3 = set()
      set3.add(set1)
      set3.add(set2)
      assert.equal(set3.size, 1)
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
  describe(Set.copy.name, function () {
    it('clones a set', function () {
      assert.throws(function () {
        Set.copy([])
      })
      const a = Set.from(1, 2, 3, { a: 1 }, ['foo'])
      const b = Set.copy(a)
      assert.notEqual(a, b)
      assert.deepEqual(b.toArray(), [1, 2, 3, { a: 1 }, ['foo']])
    })
  })
  describe(Set.union.name, function () {
    // use with https://en.wikipedia.org/wiki/Union_(set_theory)
    const createUnion = setA => arr => Set.union(setA, new Set(arr)).toArray().sort()

    it('creates a union of two sets', function () {
      // this test includes both the binary and arbitrary union operators
      const a = new Set([1, 2])
      const b = new Set([2, 3])
      const c = new Set([1, 2, 3])
      const d = new Set([3, 4, 5])
      const f = new Set([1, 2, 3, 4, 5])
      const union = createUnion(a)

      // {1, 2} ∪ {1, 2} = {1, 2}.
      assert.deepEqual(union([1, 2]), [1, 2])
      assert.deepEqual(a.union(a), a)

      // {1, 2} ∪ {2, 3} = {1, 2, 3}.
      assert.deepEqual(union([2, 3.0]), [1, 2, 3])
      assert.deepEqual(a.union(b), c)

      // {1, 2, 3} ∪ {3, 4, 5} = {1, 2, 3, 4, 5}
      a.add(3)
      assert.deepEqual(union([3, 4, 5]), [1, 2, 3, 4, 5])
      assert.deepEqual(c.union(d), f)
    })

    it('creates a union of 0 sets', function () {
      const e = new Set()
      const u = Set.union()
      assert.deepEqual(e, u)
    })

    it('creates a union of 1 sets', function () {
      const a = set(1, 2, 3)
      const u = Set.union(a)
      assert.deepEqual(a, u)
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
      const u = new Set([1, 2, 3, 4, 5, 6, 7])
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

      // A ∪ U = U.
      areEqual(u, Set.union(a, u))

      // A ∪ ∅ = A.
      areEqual(Set.union(a, new Set()), a)

      // A ⊆ B if and only if A ∪ B = B.
      assert.isTrue(c.isSubsetOf(u))
      areEqual(u, Set.union(c, u))
      assert.isFalse(c.isSubsetOf(b))
      areNotEqual(b, Set.union(c, b))
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

    it('throws if given parameters are not a Set', function () {
      assert.throws(function () {
        Set.union(set(1), 1)
      }, /Expected \[set\] to be instanceof \[Set\]/)

      assert.throws(function () {
        Set.union(1, set(1))
      }, /Expected \[set\] to be instanceof \[Set\]/)

      assert.throws(function () {
        Set.union(null, null)
      }, /Expected \[set\] to be instanceof \[Set\]/)

      assert.throws(function () {
        Set.union(set(1), null)
      }, /Expected \[set\] to be instanceof \[Set\]/)
    })
  })

  describe(Set.intersection.name, function () {
    // use with https://en.wikipedia.org/wiki/Intersection_(set_theory)

    it('returns a set of all objects that are members of both the sets A and B', function () {
      // The intersection of the sets {1, 2, 3} and {2, 3, 4} is {2, 3}.
      const set1 = new Set([1, 2, 3])
      const set2 = new Set([2, 3, 4])
      assert.deepEqual(Set.intersection(set1, set2).toArray().sort(), [2, 3])

      // The number 9 is not in the intersection of the set of prime numbers {2, 3, 5, 7, 11, ...}
      // and the set of odd numbers {1, 3, 5, 7, 9, 11, ...}, because 9 is not prime.
      const prms = new Set([2, 3, 5, 7, 11])
      const odds = new Set([1, 3, 5, 7, 9])
      assert.isFalse(Set.intersection(prms, odds).has(9))

      // Intersection is an associative operation; that is, for any sets A, B, and C, one has A ∩ (B ∩ C) = (A ∩ B) ∩ C.
      const a = new Set([1, 2, 3])
      const b = new Set([3, 4, 5])
      const c = new Set([5, 6, 7])

      const aib = Set.intersection(a, b)
      const bic = Set.intersection(b, c)
      areEqual(Set.intersection(a, bic), Set.intersection(aib, c))

      // Intersection is also commutative; for any A and B, one has A ∩ B = B ∩ A.
      const bia = Set.intersection(b, a)
      areEqual(aib, bia)
    })

    it('does not create an intersection of 0 sets', function () {
      assert.throws(function () {
        Set.intersection()
      }, /The intersection operator currently does not support 0 arguments\./)
    })

    it('creates an intersection of 1 sets', function () {
      const a = set(1, 2, 3)
      const u = Set.intersection(a)
      assert.deepEqual(a, u)
    })

    it('creates an intersection of 2 sets', function () {
      const a = set(1, 2, 3)
      const b = set(1, 3, 5)
      const expected = set(1, 3)
      assert.deepEqual(Set.intersection(a, b), expected)
      assert.deepEqual(a.intersect(b), expected)
    })

    it('returns an intersection in n sets', function () {
      const a = new Set([1, 2, 3, 4])
      const b = new Set([2, 3, 4, 5])
      const c = new Set([3, 4, 5, 6])

      const aibic = Set.intersection(a, b, c)
      const compare = set(3, 4)
      areEqual(aibic, compare)
    })

    it('recursively respects nested sets', function () {
      const a = set(set(1), set(2), set(3))
      const b = set(set(3), set(4), set(5))
      const c = set(set(7), set(6), set(7))

      const aib = Set.intersection(a, b)
      const bic = Set.intersection(b, c)
      areEqual(Set.intersection(a, bic), Set.intersection(aib, c))

      // Intersection is also commutative; for any A and B, one has A ∩ B = B ∩ A.
      const bia = Set.intersection(b, a)
      areEqual(aib, bia)
    })

    it('does not alter the involved sets', function () {
      const set1 = new Set([1, 2, 3])
      const set2 = new Set([2, 3, 4])
      assert.deepEqual(Set.intersection(set1, set2).toArray().sort(), [2, 3])
      assert.deepEqual(set1.toArray(), [1, 2, 3])
      assert.deepEqual(set2.toArray(), [2, 3, 4])
    })

    it('throws if given parameters are not a Set', function () {
      assert.throws(function () {
        Set.intersection(set(1), 1)
      }, /Expected \[set\] to be instanceof \[Set\]/)

      assert.throws(function () {
        Set.intersection(1, set(1))
      }, /Expected \[set\] to be instanceof \[Set\]/)

      assert.throws(function () {
        Set.intersection(null, null)
      }, /Expected \[set\] to be instanceof \[Set\]/)

      assert.throws(function () {
        Set.intersection(set(1), null)
      }, /Expected \[set\] to be instanceof \[Set\]/)
    })
  })

  describe(Set.difference.name, function () {
    // used with https://en.wikipedia.org/wiki/Complement_(set_theory)#Relative_complement

    it('returns the difference of a set from another', function () {
      const u = new Set([1, 2, 3, 4, 5])
      const a = new Set([1, 2])
      const b = new Set([1, 3])
      const c = new Set([1, 2, 3, 4])
      const e = new Set([])

      // {1, 2} \ {1, 2} = ∅.
      // A \ A = ∅.
      assert.equal(Set.difference(a, a).size, 0)

      // {1, 2, 3, 4} \ {1, 3} = {2, 4}.
      areEqual(Set.difference(c, b), new Set([2, 4]))

      // A \ B ≠ B \ A for A ≠ B.
      const acb = Set.difference(a, b)
      const bca = Set.difference(b, a)
      areNotEqual(acb, bca)

      // ∅ \ A = ∅.
      assert.equal(Set.difference(e, a).size, 0)

      // A \ ∅ = A.
      areEqual(Set.difference(a, e), a)

      // A ∪ A′ = U.
      areEqual(Set.union(a, Set.difference(u, a)), u)

      // A ∩ A′ = ∅.
      areEqual(Set.intersection(a, Set.difference(u, a)), e)

      // (A′)′ = A.
      areEqual(a, Set.difference(u, Set.difference(u, a)))

      // A \ U = ∅.
      areEqual(e, Set.difference(a, u))

      // A \ A′ = A and A′ \ A = A′.
      areEqual(a, Set.difference(a, Set.difference(u, a)))
      areEqual(Set.difference(u, a), Set.difference(Set.difference(u, a), a))

      // U′ = ∅ and ∅′ = U.
      areEqual(e, Set.difference(u, u))
      areEqual(u, Set.difference(u, e))

      // A \ B = A ∩ B′.
      areEqual(Set.difference(a, b), Set.intersection(a, Set.difference(u, b)))

      // if B ⊆ C then B \ C = ∅.
      areEqual(e, Set.difference(b, c))
    })

    it('recursively respects nested sets', function () {
      const a = set(set(2), set(4))
      const b = set(set(1), set(3))
      const c = set(set(1), set(2), set(3), set(4))
      const e = new Set()

      assert.equal(Set.difference(a, a).size, 0)

      // {1, 2, 3, 4} \ {1, 3} = {2, 4}.
      areEqual(Set.difference(c, b), set(set(2), set(4)))
      const acb = Set.difference(a, b)
      const bca = Set.difference(b, a)

      areNotEqual(acb, bca)
      assert.equal(Set.difference(e, a).size, 0)
      areEqual(Set.difference(a, e), a)
    })

    it('does not alter the involved sets', function () {
      const a = new Set([1, 2])
      const b = new Set([1, 3])
      const acb = Set.difference(a, b)
      const bca = Set.difference(b, a)
      areNotEqual(acb, bca)

      assert.deepEqual(a.toArray(), [1, 2])
      assert.deepEqual(b.toArray(), [1, 3])
    })

    it('throws if given parameters are not a Set', function () {
      assert.throws(function () {
        Set.difference(set(1), 1)
      }, /Expected \[set\] to be instanceof \[Set\]/)

      assert.throws(function () {
        Set.difference(1, set(1))
      }, /Expected \[set\] to be instanceof \[Set\]/)

      assert.throws(function () {
        Set.difference(null, null)
      }, /Expected \[set\] to be instanceof \[Set\]/)

      assert.throws(function () {
        Set.difference(set(1), null)
      }, /Expected \[set\] to be instanceof \[Set\]/)
    })
  })

  describe(Set.complement.name, function () {
    // used with https://en.wikipedia.org/wiki/Complement_(set_theory)#Absolute_complement

    it('returns the complement of a set from another', function () {
      const u = new Set([1, 2, 3, 4, 5])
      const a = new Set([1, 2])
      const b = new Set([1, 3])
      const c = new Set([1, 2, 3, 4])
      const e = new Set([])

      // {1, 2} \ {1, 2} = ∅.
      // A \ A = ∅.
      assert.equal(Set.complement(a, a).size, 0)

      // {1, 2, 3, 4} \ {1, 3} = {2, 4}.
      areEqual(Set.complement(c, b), new Set([2, 4]))

      // If B has an element not in A (impossible since A must be the entire universe), throw an error.
      assert.throws(function () {
        Set.complement(a, b)
      }, /\[set2\] has an element which is not in the universe \[set1\]\./)

      // A \ ∅ = A.
      areEqual(Set.complement(a, e), a)

      // A ∪ A′ = U.
      areEqual(Set.union(a, Set.complement(u, a)), u)

      // A ∩ A′ = ∅.
      areEqual(Set.intersection(a, Set.complement(u, a)), e)

      // (A′)′ = A.
      areEqual(a, Set.complement(u, Set.complement(u, a)))

      // U′ = ∅ and ∅′ = U.
      areEqual(e, Set.complement(u, u))
      areEqual(u, Set.complement(u, e))

      // A \ B = A ∩ B′.
      areEqual(Set.difference(a, b), Set.intersection(a, Set.complement(u, b)))
    })

    it('recursively respects nested sets', function () {
      const a = set(set(2), set(4))
      const b = set(set(1), set(3))
      const c = set(set(1), set(2), set(3), set(4))
      const e = new Set()

      assert.equal(Set.complement(a, a).size, 0)

      // {1, 2, 3, 4} \ {1, 3} = {2, 4}.
      areEqual(Set.complement(c, b), set(set(2), set(4)))

      areEqual(Set.complement(a, e), a)
    })

    it('does not alter the involved sets', function () {
      const a = new Set([1, 2, 3])
      const b = new Set([1, 3])
      const acb = Set.complement(a, b)
      assert.deepEqual(acb.toArray(), [2])

      assert.deepEqual(a.toArray(), [1, 2, 3])
      assert.deepEqual(b.toArray(), [1, 3])
    })

    it('throws if given parameters are not a Set', function () {
      assert.throws(function () {
        Set.complement(set(1), 1)
      }, /Expected \[set\] to be instanceof \[Set\]/)

      assert.throws(function () {
        Set.complement(1, set(1))
      }, /Expected \[set\] to be instanceof \[Set\]/)

      assert.throws(function () {
        Set.complement(null, null)
      }, /Expected \[set\] to be instanceof \[Set\]/)

      assert.throws(function () {
        Set.complement(set(1), null)
      }, /Expected \[set\] to be instanceof \[Set\]/)
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
      const unionOfRelativeComplements = Set.union(Set.difference(a, b), Set.difference(b, a))
      areEqual(asdb, unionOfRelativeComplements)

      // The symmetric difference can also be expressed as the union of the two sets, minus their intersection:
      const unionMinusIntersection = Set.difference(Set.union(a, b), Set.intersection(a, b))
      areEqual(asdb, unionMinusIntersection)

      // The symmetric difference is commutative and associative:
      const bsda = Set.symDiff(b, a)
      areEqual(asdb, bsda)

      const bsdc = Set.symDiff(b, c)
      areEqual(Set.symDiff(asdb, c), Set.symDiff(a, bsdc))
    })

    it('returns a symmetric difference of n sets', function () {
      const a = new Set([1, 2, 3, 4, 5, 6])
      const b = new Set([3, 4, 5, 6, 7, 8]) // -> minus 3, 4, 5, 6
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

    it('throws if given parameters are not a Set', function () {
      assert.throws(function () {
        Set.symDiff(set(1), 1)
      }, /Expected \[set\] to be instanceof \[Set\]/)

      assert.throws(function () {
        Set.symDiff(1, set(1))
      }, /Expected \[set\] to be instanceof \[Set\]/)

      assert.throws(function () {
        Set.symDiff(null, null)
      }, /Expected \[set\] to be instanceof \[Set\]/)

      assert.throws(function () {
        Set.symDiff(set(1), null)
      }, /Expected \[set\] to be instanceof \[Set\]/)
    })
  })

  describe(Set.power.name, function () {
    it('creates a power set including the set, empty and all subsets of S', function () {
      // the power set of the set {1, 2, 3} is {{1, 2, 3}, {1, 2}, {1, 3}, {2, 3}, {1}, {2}, {3}, ∅}

      const pwr = Set.power(new Set([1, 2, 3, 4]))
      const cmp = set(
        new Set([1, 2, 3, 4]),

        new Set([1, 2, 3]),
        new Set([1, 2, 4]),
        new Set([1, 3, 4]),
        new Set([2, 3, 4]),

        new Set([1, 2]),
        new Set([1, 3]),
        new Set([1, 4]),

        new Set([2, 3]),
        new Set([2, 4]),

        new Set([3, 4]),

        new Set([1]),
        new Set([2]),
        new Set([3]),
        new Set([4]),
        new Set([])
      )

      areEqual(pwr, cmp)
    })

    it('recursively respects nested sets', function () {
      const pwr = Set.power(set(set(1), set(2), set(3), set(4)))

      const cmp = set(
        new Set([set(1), set(2), set(3), set(4)]),

        new Set([set(1), set(2), set(3)]),
        new Set([set(1), set(2), set(4)]),
        new Set([set(1), set(3), set(4)]),
        new Set([set(2), set(3), set(4)]),

        new Set([set(1), set(2)]),
        new Set([set(1), set(3)]),
        new Set([set(1), set(4)]),

        new Set([set(2), set(3)]),
        new Set([set(2), set(4)]),

        new Set([set(3), set(4)]),

        new Set([set(1)]),
        new Set([set(2)]),
        new Set([set(3)]),
        new Set([set(4)]),
        new Set([])
      )

      areEqual(pwr, cmp)
    })

    it('does not alter the involved sets', function () {
      const input = new Set([1, 2, 3])
      const pwr = Set.power(input)
      assert.isDefined(pwr)
      areEqual(input, new Set([1, 2, 3]))
    })

    it('throws if given parameters are not a Set', function () {
      assert.throws(function () {
        Set.power(null)
      }, /Expected \[set\] to be instanceof \[Set\]/)

      assert.throws(function () {
        Set.power(1)
      }, /Expected \[set\] to be instanceof \[Set\]/)
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
      const axa1 = Set.cartesian(Set.cartesian(d, d), d)
      const axa2 = Set.cartesian(d, Set.cartesian(d, d))

      areNotEqual(axa1, axa2)
    })

    it('recursively respects nested sets', function () {
      const set = (...args) => new Set([...args])

      const setA = new Set([set(1), set(2)])
      const setB = new Set([set(3), set(4)])

      const axb = Set.cartesian(setA, setB)
      const bxa = Set.cartesian(setB, setA)

      areEqual(axb, set([set(1), set(3)], [set(1), set(4)], [set(2), set(3)], [set(2), set(4)]))
      areEqual(bxa, set([set(3), set(1)], [set(3), set(2)], [set(4), set(1)], [set(4), set(2)]))
    })

    it('does not alter the involved sets', function () {
      const setA = new Set([1, 2])
      const setB = new Set([3, 4])

      const axb = Set.cartesian(setA, setB)
      const bxa = Set.cartesian(setB, setA)
      assert.isDefined(axb)
      assert.isDefined(bxa)

      assert.deepEqual(setA.toArray(), [1, 2])
      assert.deepEqual(setB.toArray(), [3, 4])
    })

    it('throws if given parameters are not a Set', function () {
      assert.throws(function () {
        Set.cartesian(null)
      }, /Expected \[set\] to be instanceof \[Set\]/)

      assert.throws(function () {
        Set.cartesian(1, set(2))
      }, /Expected \[set\] to be instanceof \[Set\]/)

      assert.throws(function () {
        Set.cartesian(set(2), 1)
      }, /Expected \[set\] to be instanceof \[Set\]/)
    })
  })
  describe(Set.mergeRules.name, function () {
    it('Merges two rules functions with a locigal OR', function () {
      const merged = Set.mergeRules(() => true, () => false)
      assert.equal(merged(), true)

      const throws = Set.mergeRules(() => false, () => false)
      assert.throws(function () {
        throws()
      })
    })
  })
  describe(Set.mergeRulesStrict.name, function () {
    it('Merges two rules functions with a logical AND', function () {
      const merged = Set.mergeRulesStrict(() => true, () => true)
      assert.equal(merged(), true)

      const throws = Set.mergeRulesStrict(() => true, () => false)
      assert.throws(function () {
        throws()
      })
    })
  })
})
