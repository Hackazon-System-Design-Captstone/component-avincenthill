const pg = require('pg');

const client = new pg.Client({
  user: 'postgres',
  host: 'localhost',
  database: 'sdc',
  password: 'sd7763sd',
  port: 5432,
});
client.connect();
const query = client.query(
  'CREATE TABLE reviews(productId INTEGER, productName VARCHAR(40) not null, reviewId INTEGER PRIMARY KEY, username TEXT, stars SMALLINT, title TEXT, text TEXT, timestamp TEXT, numHelpful SMALLINT, verifiedPurchase BOOLEAN, imageUrl TEXT)');
