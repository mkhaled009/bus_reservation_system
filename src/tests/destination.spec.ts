process.env.NODE_ENV = 'test';
import { initDBWithAdmin, clearDestinations, dropDB, jwtSecret, clearDB, createAdmin, initDBWithData } from "../utils";
let chai = require('chai');
let chaiHttp = require('chai-http');
let Server = require('../');
let should = chai.should();
chai.use(chaiHttp);


describe("/api/destinations",  ()=>{
  it("should return all destantions /api/destinations", async (done) => {

    chai.request(Server)
      .get("/api/destinations")
      .end((err, res) => {
        res.should.have.status(201);
        res.body.should.be.a('array');
        res.body.length.should.be.eq(2);
        console.log(res)
        done();
      }).catch(err =>done(err));
  });

});




