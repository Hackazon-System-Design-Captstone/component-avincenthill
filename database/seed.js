const faker = require('faker');
const fs = require("fs");
 
let writeTimes = 200
let dataNumber = 250000;
let drainevent = true;
let dataFile;

dataFile = fs.createWriteStream('/home/winds/Desktop/reviewData.csv');
let writeData = (i, revId) => {
  let reviewId = revId
  let csvString = '';
  for (;i <= dataNumber; i++) {
    let productId = Math.ceil(reviewId / 5);
    let review = {
      productId: productId,
      reviewId: reviewId,
      username: faker.internet.userName(),
      stars: Math.floor(Math.random() * 6),
      title: faker.lorem.sentence(),
      text: faker.lorem.sentence(),
      timestamp: faker.date.past(),
      numHelpful: Math.floor(Math.random() * 10000),
      verifiedPurchase: Math.random() < 0.5,
      imageUrl: faker.image.avatar(),
    };
    reviewId = reviewId + 1;
    csvString += `${review.productId}|${review.reviewId}|${review.username}|${review.stars}|${review.title}|${review.text}|${review.timestamp}|${review.numHelpful}|${review.verifiedPurchase}|${review.imageUrl}\n`;
    productId = null;
    review = null;
  }
  if(writeTimes > 0) {
    writeTimes--;
    drainevent = dataFile.write(csvString);
    if(!drainevent){
      drainevent = true;
      csvString = null;
      reviewId = null;
      console.log(Math.floor(revId/ 500000) + '% \n')
      dataFile.once('drain', (err) => {
        writeData(1, dataNumber * (200 - writeTimes)+1)
      })
      return;
    }
  }
};
  
writeData(1, 1);