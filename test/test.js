var chai = require('chai'),
    expect = chai.expect,
    should = chai.should();
var request = require('request');
var config = require('config');
//Using config module to create a local domain
global.domain = 'http://' + config.host + ':' + config.port;
describe('---Testing the task list api---', function () {
    it('GET: Task list', function (done) {
        /**
         * Follow the request module documentation.
         * go to : https://github.com/request/request
         */
        var options = {
            url: domain + '/task',
            headers: {
                "Content-Type": "application/json"
            },
            json: {
                task: "Hello world"
            }
        };
        request.post(options, function (error, response, body) {
            //Should be conditions
            response.statusCode.should.equal(200);
            //Expected conditions
            expect(body).to.be.a('array');
            expect(body).to.include(options.json.task);
            done();
        });
    });
})

