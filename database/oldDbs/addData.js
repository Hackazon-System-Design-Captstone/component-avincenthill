const fs = require("fs");
const split = require('split')
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/SDC');

const reviewsSchema = new mongoose.Schema({
  productId: Number,
  productName: String,
  reviewId: Number,
  username: String,
  stars: Number,
  title: String,
  text: String,
  timestamp: Date,
  numHelpful: Number,
  verifiedPurchase: Boolean,
  imageUrl: String,
});

var Review = mongoose.model('Review', reviewsSchema);
let addData = fs.createReadStream('./database/reviewData.json', {flags: 'r', encoding: 'utf-8'});


var lineStream = addData.pipe(split());
lineStream.on('data', function(chunk) {
    var reviewObj = JSON.parse(chunk);
    var id = reviewObj.reviewId;
    if(id % 100000 === 0) {
      console.log('at ' + id / 100000 + '%' + '\m');
    }
    var singleReview = new Review(reviewObj);
    singleReview.save();
});
// let buf;

// addData.on('data', function(d) {
//   buf += d.toString(); // when data is read, stash it in a string buffer
//   pump(); // then process the buffer
// });

// function pump() {
//   var pos;

//   while ((pos = buf.indexOf('\n')) >= 0) { // keep going while there's a newline somewhere in the buffer
//       if (pos == 0) { // if there's more than one newline in a row, the buffer will now start with a newline
//           buf = buf.slice(1); // discard it
//           continue; // so that the next iteration will start with data
//       }
//       processLine(buf.slice(0,pos)); // hand off the line
//       buf = buf.slice(pos+1); // and slice the processed data off the buffer
//   }
// }

// function processLine(line) { // here's where we do something with a line
//   console.log(line)
//   if (line[line.length-1] == '\n') line=line.substr(0,line.length-1); // discard CR (0x0D)

//   if (line.length > 0) { // ignore empty lines
//       var reviewObj = JSON.parse(line); // parse the JSON
//       console.log(typeof reviewObj);
//       // var singleReview = new Review(reviewObj);
//       // singleReview.save();
//   }
// }
