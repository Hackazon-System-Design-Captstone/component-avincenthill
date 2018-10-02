DROP KEYSPACE SDC
;

CREATE KEYSPACE SDC
  WITH REPLICATION = { 
   'class' : 'SimpleStrategy',
   'replication_factor' : 3
  }
;

CREATE TABLE SDC.reviews (
  productId int,
  productName text,
  reviewId int,
  username text,
  stars int,
  title text,
  text text,
  timestamp text,
  numHelpful int,
  verifiedPurchase boolean,
  imageUrl text,
  PRIMARY KEY (productId, reviewId)
)WITH CLUSTERING ORDER BY (reviewId ASC)
;