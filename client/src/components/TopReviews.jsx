import React from 'react';
import Review from './Review.jsx';

class TopReviews extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const state = this.props.getState();
    const { reviews } = state;
    const reviewElements = reviews.map((review, index) => {
      // TBD toggle show reviews all on button press
      if (index < 5) {
        return <Review key={index} review={review} />;
      }
    });
    return (
      <React.Fragment>
        <h4>Top customer reviews</h4>
        {reviewElements}
        <p>See all {reviews.length} reviews > </p>
        <button>Write a customer review</button>
      </React.Fragment>
    );
  }
}

export default TopReviews;
