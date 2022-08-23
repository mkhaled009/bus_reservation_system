process.env.NODE_ENV = 'test';
import { initDBWithAdmin, clearDestinations, dropDB } from "../utils"
import server from "../";
let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();
chai.use(chaiHttp);


describe("/api/Seats", () => {
  it("should return all seats", async (done)  =>{

    chai.request(server)
      .get('/Seats')
      .end((err, res) => {
        res.should.have.status(201);
        res.body.should.be.a('array');
        res.body.length.should.be.eq(40);
        done();
        
      }).catch(err =>done(err));
  });
});


