const fs = require("fs");
const split = require('split')
const cassandra = require('cassandra-driver');
const client = new cassandra.Client({ contactPoints: ['127.0.0.1'], keyspace: 'sdc' });
let queries = [];

let addData = fs.createReadStream('/media/winds/Disk2/SDC/reviewData.json', {flags: 'r', encoding: 'utf-8'});
var lineStream = addData.pipe(split());
let count = 0;
let addCount = 500000;

lineStream.on('data', function(chunk) {
  let tempChunk = chunk.substring(0, chunk.length-1);
  queries.push({ 
    query: "INSERT INTO reviews (productId, productName, reviewId, username, stars, title, text, timestamp, numHelpful, verifiedPurchase, imageUrl) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    params: tempChunk.split(',')
        // [rev.productId, rev.productName, rev.reviewId, rev.username, rev.stars, rev.title, rev.text, rev.timestamp, rev.numHelpful, rev.verifiedPurchase, rev.imageUrl]
  });
  count++;
  if(count === 100 && addCount > 0) {
    if(addCount % 5000 === 0) {
      console.log(100 - (addCount / 5000) + '%')
    }
    addCount--;
    lineStream.pause();
    count = 0;
    client.batch(queries, {prepare: true}, function (err, res) {
      if (err) { console.log(err)}
      queries = [];
      lineStream.resume();
    });
  }
});

// client.execute("COPY reviews (productId, productName, reviewId, username, stars, title, text, timestamp, numHelpful, verifiedPurchase, imageUrl) FROM '/media/winds/Disk2/SDC/reviewData.csv' WITH DELIMITER = ', ")