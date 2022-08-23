process.env.NODE_ENV = 'test';
import { application } from "express";
import { initDBWithAdmin, clearDestinations, dropDB, jwtSecret, clearDB, createAdmin, initDBWithData } from "../utils";
import Server from "../";
let chai = require('chai');
let chaiHttp = require('chai-http');

let should = chai.should();
chai.use(chaiHttp);


describe("/api/destinations",  ()=>{
  it("should return all destantions /api/destinations", async (done) => {

    chai.request(Server)
      .get("/destination")
      .end((err, res) => {
        res.should.have.status(201);
        res.body.should.be.a('array');
        res.body.length.should.be.eq(2);
        done();
      }).catch(err =>done(err));
  });

});




