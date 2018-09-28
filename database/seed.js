const faker = require('faker');
const fs = require("fs");
// const pg = require('knex')({
  //     client: 'pg',
  //     connection: {
    //         host : '127.0.0.1',
    //         user : 'your_database_user',
    //         password : 'your_database_password',
    //         database : 'myapp_test'
    //     },
    //     searchPath: ['knex', 'public'],
    // });
//1 mill 
let writeTimes = 200;
let dataNumber = 250000;


//var dataFile = fs.createWriteStream('/media/winds/Disk2/SDC/reviewData.csv');
    
let writeData = (i, revId) => {
  let csvString = '';

  for (;i <= dataNumber; i++) {
    let productId = Math.floor(revId / 5);
    let review = {
      productId: productId,
      productName: "Clean-O-Bot " + productId,
      reviewId: revId,
      username: faker.internet.userName(),
      stars: Math.floor(Math.random() * 6),
      title: faker.lorem.sentence(),
      text: faker.lorem.sentence(),
      timestamp: faker.date.past(),
      numHelpful: Math.floor(Math.random() * 10000),
      verifiedPurchase: Math.random() < 0.5,
      imageUrl: faker.image.avatar(),
    };
    revId = revId + 1;
    csvString += `${review.productId}, ${review.productName}, ${review.reviewId}, ${review.username}, ${review.stars}, ${review.title}, ${review.text}, ${review.timestamp}, ${review.numHelpful}, ${review.verifiedPurchase}, ${review.imageUrl}\n`;

    if( i === dataNumber & writeTimes > 0) {
      writeTimes--;
      fs.appendFile('/media/winds/Disk2/SDC/reviewData.csv', csvString, (err) => {
        drainevent = null;
        csvString = null;
        review = null;
        productId = null;
        console.log(Math.floor((200 - writeTimes)/2));
        writeData(1, revId);   
      });
    
      // if (!drainevent) {
        // dataFile.removeAllListeners('drain');
        // dataFile.once('drain', function() {
        //   dataFile.removeAllListeners('drain');
        //   drainevent = null;
        //   productId = null;
        // });
      // } else {
      //   writeData(1, revId);
      // }
    }
    
    // Wait for it to drain then start writing data from where we left off
    // if(i % 500000 === 0) {
      //   console.log(i / 500000 + ' %', 'time: ' + new Date())
      // }
  }
};
  
// let writeNext = () => {

// }

writeData(1, 0);