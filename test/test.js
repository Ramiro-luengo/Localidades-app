const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');

const app = require('../src');

chai.use(chaiHttp);
chai.should();
describe("Localidades", () => {
    describe("GET /api/localidades", () => {
        it("fail to get localidades without auth token", (done) => {
            chai.request(app)
                .get('/api/localidades')
                .end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.be.a('object');
                    done();
                });
        });
    });
});