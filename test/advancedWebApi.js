'use strict'


const should = require('should') // full assertions documentation is available at https://shouldjs.github.io/
const request = require('supertest') // see: https://github.com/visionmedia/supertest#readme
const _ = require('lodash') // popular helpers library, see: https://lodash.com/docs/

describe('Advanced tests of external API', () => {
    let sharedRequestObject

    before(() => {
        // we can prepare ourselves to run tests, in this case preset base to the request client that we will use
        sharedRequestObject = request('https://postman-echo.com')
    })

    it('should make a GET request', () => {
        return sharedRequestObject
            .get('/get?param1=alpha')
            .query({
                param2: 'beta',
                param3: true,
                param4: ['foo', 'bar']
            })
            .expect(200) // this asserts response code
            .then(response => {
                // expect already checked the status above
                response.statusCode.should.eql(200)
                response.headers.should.have.property('server', 'nginx')
                response.headers.should.have.property('content-type', 'application/json; charset=utf-8')
                response.charset.should.eql('utf-8')

                // JSON response gets parsed automatically
                response.body.should.be.Object()
                // parameters were combined
                response.body.should.have.property('url', 'https://postman-echo.com/get?param1=alpha&param2=beta' +
                    '&param3=true&param4=foo&param4=bar')
                response.body.should.have.property('args', {
                    param1: 'alpha',
                    param2: 'beta',
                    param3: 'true',
                    param4: ['foo', 'bar']
                })
                response.body.should.have.property('headers')
                response.body.headers.should.have.property('host', 'postman-echo.com')
            })
    })

    it('should make a GET request and accept gzip-encoded response', () => {
        return sharedRequestObject
            .get('/gzip')
            .query({
                param2: 'beta',
                param3: true,
                param4: ['foo', 'bar']
            })
            .set('Accept-Encoding', 'gzip')
            .expect(200)
            .then(response => {
                response.headers.should.have.property('content-type', 'application/json; charset=utf-8')
                response.headers.should.have.property('content-encoding', 'gzip')
                response.charset.should.eql('utf-8')

                // JSON response gets parsed automatically
                response.body.should.be.Object()
                response.body.should.have.property('gzipped', true)
                response.body.should.have.property('method', 'GET')
                response.body.should.have.property('headers')
                response.body.headers.should.have.property('host', 'postman-echo.com')
            })
    })

    it.skip('this test is skipped', () => {
        throw new Error('Failing test')
    })

    it('should make a POST request as JSON', () => {
        return sharedRequestObject
            .post('/post')
            .send({
                param1: 'alpha',
                param2: 'beta',
                param3: true,
                param4: ['foo', 'bar']
            })
            .expect(200)
            .then(response => {
                response.headers.should.have.property('content-type', 'application/json; charset=utf-8')
                response.charset.should.eql('utf-8')

                // JSON response gets parsed automatically
                response.body.should.be.Object()
                response.body.should.have.property('url', 'https://postman-echo.com/post')
                response.body.should.have.property('args', {})
                response.body.should.have.property('data', {
                    param1: 'alpha',
                    param2: 'beta',
                    param3: true,
                    param4: ['foo', 'bar']
                })
                response.body.should.have.property('files', {})
                response.body.should.have.property('form', {})
                response.body.should.have.property('headers')
                response.body.headers.should.have.property('host', 'postman-echo.com')
                response.body.headers.should.have.property('content-type', 'application/json')
            })
    })

    it('should make a POST request as x-www-form-urlencoded', () => {
        return sharedRequestObject
            .post('/post')
            .send('param1=alpha')
            .send('param2=beta')
            .send('param3=true')
            .send('param4=foo&param4=bar')
            .expect(200)
            .then(response => {
                response.headers.should.have.property('content-type', 'application/json; charset=utf-8')
                response.charset.should.eql('utf-8')

                // JSON response gets parsed automatically
                response.body.should.be.Object()
                response.body.should.have.property('url', 'https://postman-echo.com/post')
                response.body.should.have.property('args', {})
                response.body.should.have.property('data', '')
                response.body.should.have.property('files', {})
                response.body.should.have.property('form', {
                    param1: 'alpha',
                    param2: 'beta',
                    param3: 'true',
                    param4: ['foo', 'bar']
                })
                response.body.should.have.property('headers')
                response.body.headers.should.have.property('host', 'postman-echo.com')
                response.body.headers.should.have.property('content-type', 'application/x-www-form-urlencoded')
            })
    })

    it('should make a POST request as multipart', () => {
        return sharedRequestObject
            .post('/post')
            .field('param1', 'alpha')
            .field('param2', 'beta')
            .field('param3', true)
            .field('param4', ['foo', 'bar'])
            .attach('file_upload', 'test/fixtures/logo.svg') // we are sending file attachment
            .expect(200)
            .then(response => {
                response.headers.should.have.property('content-type', 'application/json; charset=utf-8')
                response.charset.should.eql('utf-8')

                // JSON response gets parsed automatically
                response.body.should.be.Object()
                response.body.should.have.property('url', 'https://postman-echo.com/post')
                response.body.should.have.property('args', {})
                response.body.should.have.property('data', {})
                response.body.should.have.property('files')
                    .and.have.property('logo.svg')
                response.body.should.have.property('form', {
                    param1: 'alpha',
                    param2: 'beta',
                    param3: 'true',
                    param4: ['foo', 'bar']
                })
                response.body.should.have.property('headers')
                response.body.headers.should.have.property('host', 'postman-echo.com')
                response.body.headers.should.have.property('content-type')
                    .and.startWith('multipart/form-data; boundary=')
            })
    })

    it('should make a PUT request as JSON', () => {
        return sharedRequestObject
            .put('/put')
            .send({
                param1: 'alpha',
                param2: 'beta',
                param3: true,
                param4: ['foo', 'bar']
            })
            .expect(200)
            .then(response => {
                response.headers.should.have.property('content-type', 'application/json; charset=utf-8')
                response.charset.should.eql('utf-8')

                // JSON response gets parsed automatically
                response.body.should.be.Object()
                response.body.should.have.property('url', 'https://postman-echo.com/put')
                response.body.should.have.property('args', {})
                response.body.should.have.property('data', {
                    param1: 'alpha',
                    param2: 'beta',
                    param3: true,
                    param4: ['foo', 'bar']
                })
                response.body.should.have.property('files', {})
                response.body.should.have.property('form', {})
                response.body.should.have.property('headers')
                response.body.headers.should.have.property('host', 'postman-echo.com')
                response.body.headers.should.have.property('content-type', 'application/json')
            })
    })

    it('should make a DELETE request as JSON', () => {
        return sharedRequestObject
            .del('/delete')
            .send({
                param1: 'alpha',
                param2: 'beta',
                param3: true,
                param4: ['foo', 'bar']
            })
            .expect(200)
            .then(response => {
                response.headers.should.have.property('content-type', 'application/json; charset=utf-8')
                response.charset.should.eql('utf-8')

                // JSON response gets parsed automatically
                response.body.should.be.Object()
                response.body.should.have.property('url', 'https://postman-echo.com/delete')
                response.body.should.have.property('args', {})
                response.body.should.have.property('data', {
                    param1: 'alpha',
                    param2: 'beta',
                    param3: true,
                    param4: ['foo', 'bar']
                })
                response.body.should.have.property('files', {})
                response.body.should.have.property('form', {})
                response.body.should.have.property('headers')
                response.body.headers.should.have.property('host', 'postman-echo.com')
                response.body.headers.should.have.property('content-type', 'application/json')
            })
    })

    describe('Basic auth', () => {

        it('should fail to authorize without Authorization header', () => {
            return sharedRequestObject
                .get('/basic-auth')
                .expect(401)
                .then(response => {
                    // server doesn't tell us content type this time
                    response.headers.should.not.have.property('content-type')
                    // but we get some response text
                    response.text.should.eql('Unauthorized')
                })
        })

        it('should successfully authorize using Authorization header', () => {
            return sharedRequestObject
                .get('/basic-auth')
                .set('Authorization', 'Basic cG9zdG1hbjpwYXNzd29yZA==')
                .expect(200)
                .then(response => {
                    response.headers.should.have.property('content-type', 'application/json; charset=utf-8')

                    response.body.should.eql({
                        authenticated: true
                    })
                })
        })
    })

    // test suites can be nested
    describe('Persisting cookies using request agent', () => {
        let requestAgent

        before(() => {
            requestAgent = request.agent('https://postman-echo.com')
        })

        it('should set some cookies on our agent', () => {
            return requestAgent
                .get('/cookies/set')
                .query({
                    cookie1: 'alpha',
                    cookie2: 'beta'
                })
                .expect(302)
                .then(response => {
                    response.headers.should.have.property('content-type', 'text/plain; charset=utf-8')
                    response.headers.should.have.property('location', '/cookies')
                    response.headers.should.have.property('set-cookie')
                    response.headers['set-cookie'].should.containEql('cookie1=alpha; Path=/')
                    response.headers['set-cookie'].should.containEql('cookie2=beta; Path=/')
                })
        })

        it('should check cookies sent by our agent', () => {
            return requestAgent
                .get('/cookies')
                .expect(200)
                .then(response => {
                    response.headers.should.have.property('content-type', 'application/json; charset=utf-8')
                    response.charset.should.eql('utf-8')

                    // JSON response gets parsed automatically
                    response.body.should.be.Object()
                        .and.have.property('cookies')
                        .and.eql({
                            cookie1: 'alpha',
                            cookie2: 'beta'
                        })
                })
        })

    })

})
