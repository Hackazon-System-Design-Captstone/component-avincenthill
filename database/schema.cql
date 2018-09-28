DROP KEYSPACE SDC2
;

CREATE KEYSPACE SDC2
  WITH REPLICATION = { 
   'class' : 'SimpleStrategy',
   'replication_factor' : 3
  };
;

CREATE TABLE SDC2.reviews (
  productId int,
  productName text,
  reviewId int,
  username text,
  stars int,
  title text,
  text text,
  timestamp timestamp,
  numHelpful int,
  verifiedPurchase boolean,
  imageUrl text,
  PRIMARY KEY (productId, reviewId)
)WITH CLUSTERING ORDER BY (reviewId ASC)
;