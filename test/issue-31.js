/*jslint indent: 2*/
/*global require: true, module: true, describe: true, it: true*/

(function () {

  'use strict';

  var should = require('should'),
    express = require('express'),
    supertest = require('supertest'),
    cors = require('../lib'),
    app,
    mainRouter,
    itemsRouter;

  /* -------------------------------------------------------------------------- */

  itemsRouter = express.Router();
  itemsRouter.get('/', function (req, res) {
    res.send('hello world');
  });

  mainRouter = express.Router();
  mainRouter.use('/items', itemsRouter);

  app = express();
  app.use(cors());
  app.use(mainRouter);

  /* -------------------------------------------------------------------------- */

  describe('issue  #31', function () {
    it('OPTIONS works', function (done) {
      supertest(app)
        .options('/items')
        .expect(204)
        .set('Origin', 'http://example.com')
        .end(function (err, res) {
          should.not.exist(err);
          res.headers['access-control-allow-origin'].should.eql('*');
          done();
        });
    });

    it('GET works', function (done) {
      supertest(app)
        .get('/items')
        .expect(200)
        .set('Origin', 'http://example.com')
        .end(function (err, res) {
          should.not.exist(err);
          res.headers['access-control-allow-origin'].should.eql('*');
          res.text.should.eql('hello world');
          done();
        });
    });
  });

}());

