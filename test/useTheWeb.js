'use strict'


const should = require('should')
const request = require('superagent')
const postmanEchoUrl = 'https://postman-echo.com/get?beyond=thepeaches'

describe('Making external calls works, too', () => {

  it('should get an echo from a public server and return a promise to mocha', () => {

    return request
      .get(postmanEchoUrl)
      .then(response => {
        response.statusCode.should.equal(200)
        response.body.should.have.property('url', postmanEchoUrl)
      })
      .catch(err => {
        should.not.exist(err)
      })

  })

})