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
 * @private
 */
const _originalAdd = global.Set.prototype.add

/**
 * Overrides {Set.add} to respect the internal rules function.
 * @throws Error if rules function exists and {value} failed the rules check.
 * @param value (any)
 * @returns {*}
 */
function add (value) {
  if (this.rulesFct && !this.rulesFct.call(null, value)) {
    throw new Error(`Value [${value}] does not match ruleset.`)
  }
  return _originalAdd.call(this, value)
}

global.Set.prototype.add = add

// //////////////////////////////////////////////////////////////////////////////// //

function resolve (obj, circ = new _originalSet([obj])) {
  if (typeof obj === 'undefined' ||
    typeof obj === 'string' ||
    typeof obj === 'number' ||
    obj === null) {
    return obj
  }

  if (typeof obj === 'function') {
    const fctObj = { fctStr: String(obj).replace(/\s+/g, '') } // function body to string
    // resolve all function properties / attached references
    fctObj.refs = Object.getOwnPropertyNames(obj).map(key => circ._has(obj[key]) ? 'circular' : resolve(obj[key], circ))
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
    return obj.map(el => circ._has(el) ? 'circular' : resolve(el, circ))
  }

  const copy = {}
  Object.getOwnPropertyNames(obj)
    .sort((a, b) => a.localeCompare(b))
    .forEach(key => {
      copy[key] = circ._has(obj[key]) ? 'circular' : resolve(obj[key], circ)
    })
  return copy
}

/**
 * @private
 */
const originalHas = global.Set.prototype.has

/**
 * @private
 */
global.Set.prototype._has = originalHas

/**
 * Determindes if a set contains an element by deep recursive compare.
 * @param value
 * @returns {*}
 */
global.Set.prototype.has = function has (value) {
  const valType = typeof value
  if (valType === 'string' || valType === 'number') {
    return this._has(value)
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
  self.each(value => {
    out[count++] = value
  })
  return out
}

global.Set.prototype.toArray = toArray

/**
 * Executes a function on each element of the set.
 * The argument, that is passed is the current value of the iterator.
 * @param fct a function with a single argument (value)
 */
function each (fct) {
  const self = this
  const iterator = self.values()
  let value
  while ((value = iterator.next().value) !== void 0) {
    fct.call(self, value)
  }
}

global.Set.prototype.each = each

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
 * Extended version of the Set constructor. Use the default Set constructor to create new sets.
 * @class
 * @param elements {array} - an Array of element.
 * @param rulesFct {function} - a function which every element added to the set needs to pass.
 * @returns {ExtendedSet|*} The extended Set.
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
 *
 * For example:
 *
 * @param args Any types / length (using comma notation or spread operator)
 * @returns {Set<*>} A set containing the given argument values.
 */
function from (...args) {
  return new Set([...args])
}

global.Set.from = from

/**
 * Autowraps a value to a Set, unless it is already a Set.
 * @param value {any} Any arbitrary value
 * @returns {Set} A Set containing the value or the value if it is already a Set.
 */
function toSet (value) {
  return value instanceof Set ? value : Set.from(value)
}

global.Set.toSet = toSet

function copy (set) {
  checkSet(set)
  const c = new Set()
  set.each(el => c.add(el))
  return c
}

global.Set.copy = copy

/**
 * Creates a unified set of an arbitrary number of sets.
 * @param args
 * @returns {Set<any>}
 */
function union (...args) {
  const set3 = new Set()
  args.forEach(set => checkSet(set) && set.each(value => set3.add(value)))
  return set3
}

global.Set.union = union

/**
 *
 * @param args
 * @returns {Set<*>}
 */
function intersect (...args) {
  args.forEach(arg => checkSet(arg))
  const set3 = new Set([])
  args.forEach(set => {
    set.each(value => {
      if (args.every(compare => compare.has(value))) {
        set3.add(value)
      }
    })
  })
  return set3
}

global.Set.intersect = intersect

/**
 * Creates a complement of two sets (subtracts B from A).
 * C = A \ B
 *
 * @param set1 - A the set to be subtracted from
 * @param set2 - B the set which elements will be subtracted from A
 * @returns {ExtendedSet|*} A new Set with all elements of A minus the elements of B
 */
function complement (set1, set2) {
  checkSet(set1)
  checkSet(set2)
  const set3 = new Set([])
  set1.each(value => {
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
    source.each(value => {
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
  set1.each(value1 => set2.each(value2 => set3.add([value1, value2])))
  return set3
}

/**
 * @private
 */
function addToSubset (e, T) {
  T.each(X => X.add(e))
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
  S.each(value => subs.add(Set.from(value)))
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
