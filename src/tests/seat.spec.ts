process.env.NODE_ENV = 'test';
import { initDBWithAdmin, clearDestinations, dropDB } from "../utils"
let chai = require('chai');
let chaiHttp = require('chai-http');
let Server = require('../');
let should = chai.should();
chai.use(chaiHttp);


describe("/api/seats", () => {
  it("should return all seats /api/seats", async (done)  =>{

    chai.request(Server)
      .get("/api/seats")
      .end((err, res) => {
        res.should.have.status(201);
        res.body.should.be.a('array');
        res.body.length.should.be.eq(40);
        done();
        
      }).catch(err =>done(err));
  });
});


