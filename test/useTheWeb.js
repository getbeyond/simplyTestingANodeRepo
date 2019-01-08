'use strict'


const should = require('should')
const request = require('superagent')

describe('Making external calls works, too', () => {

  it('should ping and pong the Peach-API and return a promise to mocha', () => {

    return request
      .get('https://api.peachworks.com/ping')
      .then((response, err) => {
        should.not.exist(err)
        response.body.should.have.property('pong', true)
      })

  })

})