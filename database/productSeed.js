const faker = require('faker');
const fs = require("fs");
 
let writeTimes = 200
let dataNumber = 50000;
let drainevent = true;
let dataFile;

dataFile = fs.createWriteStream('/home/winds/Desktop/productData.csv');
let writeData = (i, proId) => {
  let productId = proId
  let csvString = '';
  for (;i <= dataNumber; i++) {
    let product = {
      id: productId,
      productName: "Clean-O-Bot " + productId,
    };
    productId = productId + 1;
    csvString += `${product.id}|${product.productName}\n`;
    review = null;
  }
  if(writeTimes > 0) {
    writeTimes--;
    drainevent = dataFile.write(csvString);
    if(!drainevent){
      drainevent = true;
      csvString = null;
      console.log(Math.floor(productId/ 1000000) + '% \n')
      dataFile.once('drain', (err) => {
        writeData(1, dataNumber * (200 - writeTimes) + 1)
      })
      return;
    }
  }
};
  
writeData(1, 1);