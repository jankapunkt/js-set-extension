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

    it('is not implemented', function () {
      assert.fail()
    })

  })

})
