const chai = require('chai');
const chaiHttp = require('chai-http');

const app = require('../src');

chai.use(chaiHttp);
chai.should();
describe("Localidades", () => {
    describe("GET /api/localidades", () => {
        it("without auth token", (done) => {
            chai.request(app)
                .get('/api/localidades')
                .end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.be.a('object');
                    done();
                });
        });
        it("with valid auth token", (done) => {
            const validToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiUGVkcm8iLCJpZCI6IjYyYzZmYjExNDUyYjE0ZmJmMDhmZGZjYSIsImlhdCI6MTY1NzIxMjk0Nn0.h15VvzimwKnuvl7UO7uCbAWALrIvgzLWyUER02UcVs8"
            chai.request(app)
                .get('/api/localidades')
                .set('auth-token', validToken)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    done();
                });
        });
    });
});