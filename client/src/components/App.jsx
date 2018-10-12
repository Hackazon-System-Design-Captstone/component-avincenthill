import React from 'react';
import $ from 'jquery';
import Header from './Header.jsx';
import Mentions from './Mentions.jsx';
import TopReviews from './TopReviews.jsx';
import styles from '../styles/main.css';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      reviews: [],
      currentProductId: 1,
    };
  }

  componentDidMount() {
    this.getReviews();
  }

  getReviews() {
    // pull query fron url
    let newCurrentProductId;
    if (window.location.href.match(/(\?|\&)id=(\d\d?\d?\d?\d?\d?\d?\d?)/)) {
      newCurrentProductId = window.location.href.match(/(\?|\&)id=(\d\d?\d?\d?\d?\d?\d?\d?)/)[2];
      this.setState({
        currentProductId: newCurrentProductId,
      });
    } else if(window.location.href.split('/').length > 3){
      console.log(window.location.href + '')
      newCurrentProductId = (window.location.href.split('/')[3]);
    }
    if (newCurrentProductId === undefined) {
      newCurrentProductId = 1;
    }
    // TBD refactor ajax request to fetch/promises/await
    const settings = {
      async: true,
      crossDomain: true,
      // TBD might fix below id query
      url: `/reviews/${newCurrentProductId}`,
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        'cache-control': 'no-cache',
      },
    };

    $.ajax(settings).done((data) => {
      let daata = data;
      if(typeof data === 'string') {
        daata = JSON.parse(data);
      }
      console.log('get data again', dataa[0].numhelpful)
      //console.log(`A successful GET request to server returned ${data.length} review objects`);
      this.setState({ reviews: daata });
    });
  }

  incrementHelpfulness(productId, reviewId) {
    const settings = {
      async: true,
      crossDomain: true,
      url: `/helpful/${productId}/${reviewId}`,
      method: 'GET',
      headers: {
        'content-type': 'application/json',
      },
    };

    $.ajax(settings).done((data) => {
      console.log(data)
      this.getReviews();
      //console.log(`A successful GET request to server incremented the helpfulness of review ${reviewId}`);
    });
  }

  renderStarRating(rating, vmin) {
    var style = {
      width: `${vmin}vmin`,
      height: `${vmin}vmin`,
    };

    const numFullStars = Math.floor(rating);
    const numEmptyStars = 5 - numFullStars;
    const remainder = rating - numFullStars;
    let hasHalf = remainder >= .25;

    let ratingArr = new Array(5).fill('');

    const starArray = ratingArr.map((element, index) => {
      if (index + 1 <= numFullStars) {
        return <img key={index} style={style} src='https://s3-us-west-1.amazonaws.com/avh-fec-component/img/fullStar.png'></img>;
      } else if (hasHalf) {
        hasHalf = false;
        return <img key={index} style={style} src='https://s3-us-west-1.amazonaws.com/avh-fec-component/img/halfStar.png'></img>;
      } else {
        return <img key={index} style={style} src='https://s3-us-west-1.amazonaws.com/avh-fec-component/img/emptyStar.png'></img>;
      }
    });

    return starArray;
  }

  getState() {
    return this.state;
  }

  render() {
    const { state } = this;
    const stringState = JSON.stringify(state.reviews[0]);
    return (
      <React.Fragment>
        <Header getState={this.getState.bind(this)} renderStarRating={this.renderStarRating.bind(this)} />
        <Mentions getState={this.getState.bind(this)} />
        <TopReviews getState={this.getState.bind(this)} renderStarRating={this.renderStarRating.bind(this)} incrementHelpfulness={this.incrementHelpfulness.bind(this)} />
      </React.Fragment>
    );
  }
}
