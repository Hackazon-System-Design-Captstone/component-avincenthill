const pg = require('pg');

const client = new pg.Client({
  user: 'jun',
  host: 'localhost',
  database: 'sdc',
  password: 'sd7763sd',
  port: 5432,
});
client.connect();
// client.query(
//   `CREATE TABLE products(
//     id INTEGER PRIMARY KEY, 
//     productName VARCHAR(40) not null
//   )`
// )
// client.query(
//   `CREATE TABLE reviews(
//     productId INTEGER REFERENCES products(id) ON DELETE RESTRICT, 
//     reviewId INTEGER, 
//     username TEXT, 
//     stars SMALLINT, 
//     title TEXT, 
//     text TEXT, 
//     timestamp TEXT, 
//     numHelpful SMALLINT, 
//     verifiedPurchase BOOLEAN, 
//     imageUrl TEXT,
//     PRIMARY KEY (reviewId, productId)
//   )`
// );

let getReviews = (productId, cb) => {
  client.query(`SELECT * FROM products INNER JOIN reviews ON reviews.productId = products.id WHERE id=${productId}`, (err, res) => {
    if (err) {
      db(err, null);
    }
    cb(null, res.rows);
  });
}

let incrementHelpfulness = (reviewId, cb) => {
  client.query(`SELECT numhelpful FROM reviews WHERE reviewid = ${reviewId}`, (err, res) => {
    client.query(`UPDATE reviews SET numhelpful = ${res.rows[0].numhelpful+1} WHERE reviewid = ${reviewId}`, (err, res) => {
      console.log(err)
      cb(err, res.rows);
    });
  });
}

let updateReviews = (productId, cb) => {

}

exports.getReviews = getReviews;
exports.incrementHelpfulness = incrementHelpfulness;