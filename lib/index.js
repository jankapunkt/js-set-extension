const OriginalSet = Set

/**
 *
 * @param elements
 * @param rulesFct
 * @returns {ExtendedSet|*}
 * @constructor
 */
function ExtendedSet (elements, rulesFct) {
  const original = new OriginalSet()
  original.rulesFct = rulesFct
  if (elements)
    elements.forEach(element => original.add(element))
  return original
}

Set = ExtendedSet
Set.prototype = OriginalSet.prototype

/**
 *
 */
Set.prototype.add = (function () {
  const originalAdd = Set.prototype.add
  return function add (value) {
    if (this.rulesFct && !this.rulesFct.call(null, value)) {
      throw new Error(`Value [${value}] does not match ruleset.`)
    }
    return originalAdd.call(this, value)
  }
})()

/**
 *
 * @param set
 * @returns {boolean}
 */
Set.prototype.isSupersetOf = function isSupersetOf (set) {
  const iterator = set.values()
  let value
  while (value = iterator.next().value) {
    if (!this.has(value)) return false
  }
  return true
}

/**
 *
 * @param set
 * @returns {boolean}
 */
Set.prototype.isSubsetOf = function isSubsetOf (set) {
  return set.isSupersetOf(this)
}

/**
 *
 * @param set
 * @returns {boolean}
 */
Set.prototype.properSupersetOf = function isSuperset (set) {
  return this.size !== set.size && this.isSupersetOf(set)
}

/**
 *
 * @param set
 * @returns {boolean}
 */
Set.prototype.properSubsetOf = function isSubset (set) {
  return this.size !== set.size && this.isSubsetOf(set)
}

/**
 *
 * @param set
 * @returns {boolean}
 */
Set.prototype.equal = function equal (set) {
  if (this.size !== set.size) {
    return false
  }
  return this.isSubsetOf(set)
}

/**
 *
 * @param set1
 * @param set2
 * @param rulesFct
 * @returns {ExtendedSet|*}
 */
Set.union = function union (set1, set2, rulesFct) {
  const set3 = new Set(set1, rulesFct)
  const iterator = set2.values()
  let value
  while ((value = iterator.next().value) !== void 0) {
    set3.add(value)
  }
  return set3
}

/**
 *
 * @param set1
 * @param set2
 * @returns {ExtendedSet|*}
 */
Set.intersect = function intersect (set1, set2) {
  const set3 = new Set([])
  const iterator = set1.values()
  let value
  while ((value = iterator.next().value) !== void 0) {
    if (set2.has(value)) {
      set3.add(value)
    }
  }
  return set3
}

/**
 *
 * @param set1
 * @param set2
 * @returns {ExtendedSet|*}
 */
Set.complement = function complement (set1, set2) {
  const set3 = new Set([])
  const iterator = set1.values()
  let value
  while ((value = iterator.next().value) !== void 0) {
    if (!set2.has(value)) {
      set3.add(value)
    }
  }
  return set3
}

/**
 *
 * @param set1
 * @param set2
 * @returns {ExtendedSet|*}
 */
Set.symDiff = function symmetricDifference (set1, set2) {
  const set3 = new Set([])

  function addToSet (source, compare, target) {
    const iterator = source.values()
    let value
    while ((value = iterator.next().value) !== void 0) {
      if (!compare.has(value)) {
        target.add(value)
      }
    }
  }

  addToSet(set1, set2, set3)
  addToSet(set2, set1, set3)
  return set3
}

/**
 *
 * @param set1
 * @param set2
 */
Set.cartesian = function cartesianProduct (set1, set2) {
  throw new Error('not yet implemented')
}
