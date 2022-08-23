process.env.NODE_ENV = 'test';
import { initDBWithAdmin, clearDestinations, dropDB, jwtSecret, clearDB, createAdmin, initDBWithData } from "../utils";
import * as jwt from "jsonwebtoken";
let chai = require('chai');
let chaiHttp = require('chai-http');
let Server = require('../');
let should = chai.should();
chai.use(chaiHttp);

describe(" reservation api", () => {
  let token = "";

    const newToken = jwt.sign({ userid: 1, email: 'admin@bRS.com' }, jwtSecret, {
      expiresIn: "1h",
    });

  describe("POST /api/Reservations",  () => {
    it("It should POST a new reservation", async(done) => {
      const newreservation = {
        seatnumbers: ["A8"],
        pickup: "cairo",
        destination: "aswan"

      };
      chai.request(Server)
        .post("/api/Reservations")
        .set('auth', token)
        .send(newreservation)
        .end((err, response) => {
          response.should.have.status(201);
          response.body.should.be.a('array');
          response.body.length.should.be.eq(1);
          done()
        }).catch(err =>done(err));
    });
  });

  describe("POST /api/Reservations/confirm",  () => {
    it("It should confrim a new reservation", async(done) => {
      const newconfirmation = {

        "ticketnumbers": ["1"],
        "confirmed": "true"

      };
      chai.request(Server)
        .post("/api/Reservations/confirm")
        .set('auth', token)
        .send(newconfirmation)
        .end((err, response) => {
          response.should.have.status(201);
          response.body.should.be.a('array');
          response.body.length.should.be.eq(1);
          done();
        })
    });
  });

  describe('bus reservation api',  () => {
    it("sshould return most freq destnation for users /api/reservation/getfreq", async (done) => {
      chai.request(Server)
        .get("api/Reservations/getfreq")
        .set('auth', newToken)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a('array');
          done();
        }).catch(err =>done(err));
    });
  });

});


