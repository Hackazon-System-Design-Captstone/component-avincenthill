require('newrelic');
require('dotenv').config();
const compression = require('compression');
const redis = require("redis");
const bluebird = require('bluebird');
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const url = require('url');
const db = require('../database/index.js');
bluebird.promisifyAll(redis);

class Server {
  constructor() {
    this.port = 1337;
    this.proxyPort = 3000;
    this.serverAddress = `http://localhost:${this.port}`;
    this.proxyAddress = `http://localhost:${this.proxyPort}`;
    this.app = express();
    this.init();
    this.corsOptions = {
      origin: 'http://localhost:1337',
      optionsSuccessStatus: 200
    }
  }

  init() {
    this.app.use(compression());
    this.client = redis.createClient();
    // this.app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));
    this.app.use(bodyParser.urlencoded({
      extended: true,
    }));
    this.app.use(cors({ origin: this.proxyAddress }));
    this.app.listen(this.port);
    // console.log(`server listening on ${this.serverAddress}...`);

    this.app.use(express.static('public'));
    // console.log(`server serving static react from /public on ${this.serverAddress}...`);

    this.handleGets();
    this.handleapiGets();
    this.handlePosts();
    this.handleOptions();
    this.handleDelete();
    this.handlePuts();
  }

  handleOptions() {
    this.app.options(`/reviews/*`, bodyParser.json(), (req, res) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.status(202).send();
    });
  }

  // cache(req, res, next) {
  //   const productId = req.originalUrl.split('/')[2];
  //   this.client.getAsync('key ' + productId).then( (err, data) => {

  //       if (data != null) {
  //           res.send(JSON.parse(data));
  //       } else {
  //           next();
  //       }
  //   });
  // } 
  handleGets() {
    // return reviews with posted productId
    this.app.get(`/reviews/*`, bodyParser.json(), (req, res) => {
      let productId = req.originalUrl.split('/')[2]; 
      if (!!!productId) {productId = 1}// get productId from from url
      this.client.getAsync('key '+ productId).then( (data) => {
        if (data !== null) {
          res.status(200).send(JSON.parse(data))
        } else {
          db.getReviews(productId, (err, data) => {
            if (err) return console.error(err);
            res.status(202).send(data);
            this.client.setAsync('key ' + productId,  JSON.stringify(data) );
          });
        }
      });
    });

    // increment helpfullness
    this.app.get(`/helpful/*`, bodyParser.json(), (req, res) => {
      const reviewId = req.originalUrl.split('/')[2]; // get reviewId from from url
      db.incrementHelpfulness(reviewId, (err, data) => {
        if (err) return console.error(err);
        res.status(202).send();
      });
    });
  }

  handleapiGets() {
    // return reviews with posted productId
    this.app.get(`/api/reviews/*`, cors(this.corsOptions) , (req, res) => {
      const productId = req.originalUrl.split('/')[3]; // get productId from from url
      db.getReviews(productId, (err, data) => {
        if (err) return console.error(err);
        res.status(202).send(data);
      });
    });

    // increment helpfullness
    this.app.get(`/api/helpful/*`, cors(this.corsOptions), (req, res) => {
      const reviewId = req.originalUrl.split('/')[3]; // get reviewId from from url
      db.incrementHelpfulness(reviewId, (err, data) => {
        if (err) return console.error(err);
        res.status(202).send();
      });
    });
  }

  handlePosts() {
    // create a new review
    this.app.post(`/reviews/new`, bodyParser.json(), (req, res) => {
      let data = req.body;
      db.createReview(data, (err, data) => {
        if (err) return console.error(err);
        res.status(202).send();
      });
    });
  }

  handlePuts() {
    this.app.put(`/reviews/update/:id`, bodyParser.json(), (req, res) => {
      let reviewId = req.params.reviewID;
      let data = req.body;
      // console.log(data);
      db.updateReview(data, reviewId, (err, data) => {
        if (err) {
          return console.error(err);
        }
        res.status(202).send(data);
      });
    });
  }
  
  handleDelete() {
    this.app.delete(`/reviews/delete/:id`, bodyParser.json(), (req, res) => {
      let reviewId = req.params.reviewID;
      db.deleteReview(reviewId, (err, data) => {
        if (err) {
          return console.error(err);
        }
        res.status(202).send(data);
      });
    });
  }

}

const server = new Server();
