'use strict'

// this always includes the base testing information (from index.js)
require('./')

const should = require('should')

before(done => {
  let letsTest = true
  should.exist(letsTest)
  return done()
})

describe('Our first and only test', () => {
  it('should find that global variable', done => {
    // someone setup a global, shame on them
    should.exist(mochaOptionsNeeded)
    return done()
  })
})

after(done => {
  let ourTestsAreGood = true

  should.exist(ourTestsAreGood)
  return done()
})
