const fs = require("fs");
const split = require('split')
const cassandra = require('cassandra-driver');4
const client = new cassandra.Client({ contactPoints: ['127.0.0.1'], keyspace: 'sdc2' });
let queries = [];

let addData = fs.createReadStream('/media/winds/Disk2/SDC/reviewData.csv', {flags: 'r', encoding: 'utf-8'});
var lineStream = addData.pipe(split());
let count = 0;
lineStream.on('data', function(chunk) {
  // var rev = JSON.parse(chunk);
  // var id = rev.reviewId;
  let tempChunk = chunk.substring(1, chunk.length-1);
  queries.push({ 
    query: "INSERT INTO reviews (productId, productName, reviewId, username, stars, title, text, timestamp, numHelpful, verifiedPurchase, imageUrl) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    params: tempChunk.split(',')
        // [rev.productId, rev.productName, rev.reviewId, rev.username, rev.stars, rev.title, rev.text, rev.timestamp, rev.numHelpful, rev.verifiedPurchase, rev.imageUrl]

  })
  // if(id % 500000 === 0) {
  //   console.log('at ' + id / 500000 + '%' + '\n');
  // }
  count++;
  if(count === 100) {
    lineStream.pause();
    count = 0;
    client.batch(queries, {prepare: true}, function (err, res) {
      if (err) { console.log(err)}
      queries = [];
      lineStream.resume();
    });
  }

  // client.execute(
  //     "INSERT INTO reviews (productId, productName, reviewId, username, stars, title, text, timestamp, numHelpful, verifiedPurchase, imageUrl) VALUES (?, 'temp', ?, ?, ?, ?, ?, ?, ?, ?, ?)", 
  //     Object.values(rev), { prepare: true }, function (err, res) {
  //       if(err) {console.log(err); } 
  //       else { 
  //         if(id % 100000 === 0) {
  //           console.log('at ' + id / 100000 + '%' + '\n');
  //         }
  //       }
  //       //Inserted in the cluster
  //     });
});