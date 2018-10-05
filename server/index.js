require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const url = require('url');
const db = require('../database/index.js');

class Server {
  constructor() {
    this.port = 1337;
    this.proxyPort = 3000;
    this.serverAddress = `http://localhost:${this.port}`;
    this.proxyAddress = `http://localhost:${this.proxyPort}`;
    this.app = express();
    this.init();
  }

  init() {
    this.app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));
    this.app.use(bodyParser.urlencoded({
      extended: true,
    }));
    this.app.use(cors({ origin: this.proxyAddress }));
    this.app.listen(this.port);
    console.log(`server listening on ${this.serverAddress}...`);

    this.app.use(express.static('public'));
    console.log(`server serving static react from /public on ${this.serverAddress}...`);

    this.handleGets();
    this.handlePosts();
    this.handleOptions();
    this.handleDelete();
    this.handlePuts();
  }

  handleOptions() {
    this.app.options(`/reviews/*`, (req, res) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.status(202).send();
    });
  }

  handleGets() {
    // return reviews with posted productId
    this.app.get(`/reviews/*`, bodyParser.json(), (req, res) => {
      const productId = req.originalUrl.split('/')[2]; // get productId from from url
      db.getReviews(productId, (err, data) => {
        if (err) return console.error(err);
        res.status(202).send(data);
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

  handlePosts() {
    // create a new review
    this.app.post(`/reviews/new`, bodyParser.json(), (req, res) => {
      // TBD do stuff
      // console.log("POST to new review");
      res.status(202).send();
    });
  }

  handlePuts() {
    this.app.put(`/reviews/update/:reviewID`, bodyParser.json(), (req, res) => {
      let reviewId = req.params.reviewID;
      let data = req.body;
      console.log(data);
      db.updateReview(data, reviewId, (err, data) => {
        if (err) {
          return console.error(err);
        }
        res.status(202).send(data);
      });
    });
  }
  
  handleDelete() {
    this.app.delete(`/reviews/delete/:reviewID`, bodyParser.json(), (req, res) => {
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
