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

// //////////////////////////////////////////////////////////////////////////////// //
//                                                                                  //
// INTERNAL                                                                         //
//                                                                                  //
// //////////////////////////////////////////////////////////////////////////////// //

/**
 * @private
 */
function checkRules (rules) {
  rules.forEach(rule => {
    if (typeof rule !== 'function') {
      throw new Error(`Expected [rule] to be typeof [function], got [${typeof value}]`)
    }
  })
  return true
}

/**
 * @private
 */
function checkSet (set) {
  if (!set || !set.constructor || !(set instanceof global.Set)) {
    throw new Error(`Expected [set] to be instanceof [Set], got [${set && set.constructor}]`)
  }
  return true
}

// //////////////////////////////////////////////////////////////////////////////// //
//                                                                                  //
// OVERRIDES                                                                        //
//                                                                                  //
// //////////////////////////////////////////////////////////////////////////////// //

/**
 * The original add function.
 * @private
 */
const _originalAdd = global.Set.prototype.add

/**
 * Adds a value to the set. If the set already contains the value, nothing happens.
 * Overrides Set.prototype.add.
 * @name Set.prototype.add
 * @throws Error if rules function exists and {value} failed the rules check.
 * @param {*} value - Required. Any arbitrary value to be added to the set.
 * @returns {Set} the Set object
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set/add
 */
function add (value) {
  if (this.rulesFct && !this.rulesFct.call(null, value)) {
    throw new Error(`Value [${value}] does not match ruleset.`)
  }
  return _originalAdd.call(this, value)
}

global.Set.prototype.add = add

/**
 * The original has function reference.
 * @private
 */
const originalHas = global.Set.prototype.has

/**
 * Resolves
 * @private
 */
function resolve (obj, circ = new _originalSet([obj])) {
  if (typeof obj === 'undefined' ||
    typeof obj === 'string' ||
    typeof obj === 'number' ||
    typeof obj === 'boolean' ||
    obj === null) {
    return obj
  }

  if (typeof obj === 'function') {
    const fctObj = { fctStr: String(obj).replace(/\s+/g, '') } // function body to string
    // resolve all function properties / attached references
    fctObj.refs = Object.getOwnPropertyNames(obj).map(key => originalHas.call(circ, obj[key]) ? 'circular' : resolve(obj[key], circ))
    return fctObj
  }

  const isArray = Array.isArray(obj)
  if (typeof obj !== 'object' && !isArray) {
    return obj
  }

  // add obj to check for
  // circular references
  circ.add(obj)

  if (isArray) {
    return obj.map(el => originalHas.call(circ, el) ? 'circular' : resolve(el, circ))
  }

  const copy = {}
  Object.getOwnPropertyNames(obj)
    .sort((a, b) => a.localeCompare(b))
    .forEach(key => {
      copy[key] = originalHas.call(circ, obj[key]) ? 'circular' : resolve(obj[key], circ)
    })
  return copy
}

/**
 * Checks if the current set instance contains a given value by recursive deep compare.
 * Overrides the original Set.prototype.has.
 * The check is recursive and respects
 * <ul>
 *   <li>primitive types</li>
 *   <li>complex types, such as Objects or Arrays</li>
 *   <li>nested Objects and cyclic references</li>
 *   <li>functions</li>
 *   <li>functions with properties attached</li>
 *   <li>sets, sets of sets</li>
 * </ul>
 *
 * Note, that functions will be checked against their whitespace-trimmed bodies, which can return false negatives,
 * if for example a comment is added to the compare function that not exists in the original function.
 *
 * @param {*} - value - The value to be checked.
 * @returns {boolean} - True, if the value is contained by the set. False, if otherwise.
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set/has
 */
global.Set.prototype.has = function has (value) {
  const valType = typeof value
  if (valType === 'string' || valType === 'number' || valType === 'boolean') {
    return originalHas.call(this, value)
  }

  const iterator = this.values()
  let element
  while ((element = iterator.next().value) !== void 0) {
    const elType = typeof element
    const setCompare = (element instanceof Set && value instanceof Set)

    // if both point to the same reference
    if (element === value) {
      return true
    } else

    // if we want to check if this set has a set with the
    // same elements as the given set in the argument,
    // we need to check for equality of all elements of this set
    // and the argument set
    if (setCompare && element.equal(value)) {
      return true
    } else

    // - if we want to check if ordered pairs (represented as arrays),
    //   are equal, we resolve their children and compare their strings.
    // - For all nested objects we recursively create a "sorted"
    //   version of both and compare their strings.
    // - functions are string-ed and their properties are resolved
    //   like objects
    if ((elType === 'function' && valType === 'function') ||
      (!setCompare && elType === 'object' && valType === 'object') ||
      (Array.isArray(element) && Array.isArray(value))) {
      const sortedElmnt = resolve(element)
      const sortedValue = resolve(value)

      if (JSON.stringify(sortedElmnt) === JSON.stringify(sortedValue)) {
        return true
      }
    }
  }

  // and if nothing has matched, we assume
  // that it is not contained in this set
  return false
}

// //////////////////////////////////////////////////////////////////////////////// //
//                                                                                  //
// PROTOTYPES                                                                       //
//                                                                                  //
// //////////////////////////////////////////////////////////////////////////////// //

/**
 * Pass a function that dictates the rules for elements to be part of this set.
 * Use without args to get the current rules function.
 * @param value (Optional) a Function that obtains a single argument and returns either a truthy or falsey value.
 * @returns {Function|*} Returns the current rules Function if called without args, else nothing.
 */
function rules (value) {
  if (value) {
    checkRules([value])
    this.rulesFct = value
  } else {
    return this.rulesFct
  }
}

global.Set.prototype.rules = rules

/**
 * Creates an array from all elements of this set in unsorted order.
 * @returns {Array} Array containing all elements of this set in unsorted order.
 */
function toArray () {
  const self = this
  const out = []
  out.length = self.size
  let count = 0
  self.forEach(value => {
    out[count++] = value
  })
  return out
}

global.Set.prototype.toArray = toArray

/**
 * Returns an arbitrary element of this collection.
 * Basically the first element, retrieved by iterator.next().value will be used.
 * @returns {T} An arbitrary element of the current set.
 */
function any () {
  const self = this
  const iterator = self.values()
  return iterator.next().value
}

global.Set.prototype.any = any

/**
 *
 * @param set
 * @returns {boolean}
 */
function isSupersetOf (set) {
  const iterator = set.values()
  let value
  while ((value = iterator.next().value) !== void 0) {
    if (!this.has(value)) return false
  }
  return true
}

global.Set.prototype.isSupersetOf = isSupersetOf

/**
 *
 * @param set
 * @returns {boolean}
 */
function isSubsetOf (set) {
  return set.isSupersetOf(this)
}

global.Set.prototype.isSubsetOf = isSubsetOf

/**
 *
 * @param set
 * @returns {boolean}
 */
function isProperSupersetOf (set) {
  return this.size !== set.size && this.isSupersetOf(set)
}

global.Set.prototype.properSupersetOf = isProperSupersetOf

/**
 *
 * @param set
 * @returns {boolean}
 */
function isProperSubsetOf (set) {
  return this.size !== set.size && this.isSubsetOf(set)
}

global.Set.prototype.properSubsetOf = isProperSubsetOf

/**
 * Checks, whether two sets are equal in terms of their contained elements.
 * Use the strict equals operator to determine, if they are equal in term of instances.
 * @param set
 * @returns {boolean}
 */
function equal (set) {
  checkSet(set)
  if (this.size !== set.size) {
    return false
  }
  return this.isSubsetOf(set)
}

global.Set.prototype.equal = equal

// //////////////////////////////////////////////////////////////////////////////// //
//                                                                                  //
// CONSTRUCTOR                                                                      //
//                                                                                  //
// //////////////////////////////////////////////////////////////////////////////// //

/**
 * @private
 */
const _originalSet = global.Set

/**
 * Use <code>new Set(elements, rulesFct)</code> to create new sets. Alternatively you can use <code>Set.from</code>
 * @name Set
 * @class
 * @classdesc Extended version of <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set">Set (MDN link)</a>
 * @param elements {array} - an Array of element.
 * @param rulesFct {function} - a function which every element added to the set needs to pass.
 * @see Set.from
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set
 * @returns {Set} An instance of the extended version of <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set">Set (MDN link)</a>
 */
function ExtendedSet (elements, rulesFct) {
  const original = new _originalSet()
  if (rulesFct) {
    original.rules(rulesFct)
  }
  if (elements) { elements.forEach(element => original.add(element)) }
  return original
}

global.Set = ExtendedSet
global.Set.prototype = _originalSet.prototype

// //////////////////////////////////////////////////////////////////////////////// //
//                                                                                  //
// STATICS                                                                          //
//                                                                                  //
// //////////////////////////////////////////////////////////////////////////////// //

/**
 * Creates a new Set from arbitrary arguments wihtout the need of "new" and the array notation.
 * @name Set.from
 * @example Set.from(1,2,3,4,5) // returns Set { 1, 2, 3, 4, 5 }
 * @example
 * const ints = Set.from(1,2,3)
 * const flts = Set.from(4.5, 5.6, 6.7)
 * Set.from(ints, flts) // returns Set { Set {1, 2, 3}, Set { 4.5, 5.6, 6.7 } }
 * @param args Any types / length (using comma notation or spread operator)
 * @returns {Set} A set containing the given argument values.
 */
function from (...args) {
  return new Set([...args])
}

global.Set.from = from

/**
 * Autowraps a value to a Set, unless it is already a Set.
 * @name Set.toSet
 * @param {*} value - Any arbitrary value
 * @returns {Set} A Set containing the value or the value if it is already a Set.
 */
function toSet (value) {
  return value instanceof Set ? value : Set.from(value)
}

global.Set.toSet = toSet

/**
 * Copies all elements of a given Set instance into a new Set and returns it.
 * <strong>It does not deep-clone the elements of the set.</strong>
 * @name Set.copy
 * @throws Throws an error if the argument is not a Set instance.
 * @param set {Set} a set instance from which to copy from
 * @returns {Set} a new Set instance containing all elements of the source.
 */
function copy (set) {
  checkSet(set)
  const c = new Set()
  set.forEach(el => c.add(el))
  return c
}

global.Set.copy = copy

/**
 * Creates a unified set of an arbitrary number of sets.
 * A union of A and B is a set containing all elements of A and B.
 * <br>Expression: <code>C = A ∪ B</code>
 * <br>Example: <code>{1,2} ∪ {2,3,4} = {1,2,3,4}</code>
 * @name Set.union
 * @param {...Set} args - an arbitrary list of Set instances
 * @throws Throws an error if any of the argument is not a Set instance.
 * @returns {Set} a Set instance with the unified elements of the given args.
 */
function union (...args) {
  const set3 = new Set()
  args.forEach(set => checkSet(set) && set.forEach(value => set3.add(value)))
  return set3
}

global.Set.union = union

/**
 * Creates an intersection set of an arbitrary number of sets.
 * An intersection is a set of A and B, which contains all elements that appear in A, as well as in B: <code>C = A ∩ B</code>
 * Example: <code>{1, 2, 3} ∩ {2, 3, 4} = {2, 3}.</code>
 * @name Set.intersect
 * @param {...Set} args - an arbitrary list of Set instances
 * @throws Throws an error if any of the argument is not a Set instance.
 * @returns {Set} a Set instance with the unified elements of the given args.
 * @see https://en.wikipedia.org/wiki/Intersection_(set_theory)
 */
function intersect (...args) {
  args.forEach(arg => checkSet(arg))
  const set3 = new Set([])
  args.forEach(set => {
    set.forEach(value => {
      if (args.every(compare => compare.has(value))) {
        set3.add(value)
      }
    })
  })
  return set3
}

global.Set.intersect = intersect

/**
 * Creates a complement of two sets (subtracts B from A): <code>C = A \ B</code>
 *
 * @name Set.complement
 * @throws Throws an error if any of the argument is not a Set instance.
 * @param set1 - A the set to be subtracted from
 * @param set2 - B the set which elements will be subtracted from A
 * @returns {ExtendedSet|*} A new Set with all elements of A minus the elements of B
 */
function complement (set1, set2) {
  checkSet(set1)
  checkSet(set2)
  const set3 = new Set([])
  set1.forEach(value => {
    if (!set2.has(value)) {
      set3.add(value)
    }
  })
  return set3
}

global.Set.complement = complement

/**
 * @private
 */
function symDiff (set1, set2) {
  const set3 = new Set()

  function addToSet (source, compare, target) {
    source.forEach(value => {
      if (!compare.has(value)) {
        target.add(value)
      }
    })
  }

  addToSet(set1, set2, set3)
  addToSet(set2, set1, set3)
  return set3
}

/**
 * Creates the symmetric difference of an arbitrary number (2 .. n) of sets.
 * @param args
 * @returns {Set<any>}
 */
function symmetricDifference (...args) {
  args.forEach(arg => checkSet(arg))

  if (args.length === 2) {
    return symDiff(...args)
  }

  let set3 = symDiff(args.shift(), args.shift())
  while (args.length > 0) {
    set3 = symDiff(set3, args.shift())
  }
  return set3
}

global.Set.symDiff = symmetricDifference

/**
 *
 * @param set1
 * @param set2
 */
global.Set.cartesian = function cartesianProduct (set1, set2) {
  checkSet(set1)
  checkSet(set2)
  const set3 = new Set()
  set1.forEach(value1 => set2.forEach(value2 => set3.add([value1, value2])))
  return set3
}

/**
 * @private
 */
function addToSubset (e, T) {
  T.forEach(X => X.add(e))
  return T
}

/**
 * @private
 */
function subsets (S) {
  checkSet(S)
  if (S.size === 0) {
    return Set.from(S)
  }

  const e = S.any()
  let T = Set.complement(S, Set.from(e))
  const PT = subsets(T)
  const PTe = addToSubset(e, subsets(T))
  return Set.union(PT, PTe)
}

/**
 * Creates the powerset of a set.
 * @param S
 * @returns {*}
 */
function powerSet (S) {
  checkSet(S)

  const subs = subsets(S)
  subs.add(new Set())
  S.forEach(value => subs.add(Set.from(value)))
  return subs
}

global.Set.power = powerSet

/**
 *
 * @param rules
 * @returns {function(*=): boolean}
 */
function mergeRules (...rules) {
  checkRules(rules)
  return value => {
    let passed = rules.some(rule => rule.call(value))
    if (!passed) {
      throw new Error(`Value [${value}] does not match any rule of the ruleset.`)
    }
    return true
  }
}

global.Set.mergeRules = mergeRules

/**
 *
 * @param rules
 * @returns {function(*=): boolean}
 */
function mergeRulesStrict (...rules) {
  checkRules(rules)
  return value => {
    let passed = rules.every(rule => rule.call(value))
    if (!passed) {
      throw new Error(`Value [${value}] does not match any rule of the ruleset.`)
    }
    return true
  }
}

global.Set.mergeRulesStrict = mergeRulesStrict
