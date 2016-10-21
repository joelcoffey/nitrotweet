import React, { Component } from 'react';
import Spinner from 'react-spinkit';
import moment from 'moment';
import Client from './Client';
import './Tweet.css';

class Tweet extends Component {

  constructor(props) {
    super(props);
    this.state = {
      retweetRequested: false,
      retweeted: false,
      retweeting: false
    }
    this.handleRetweetClick = this.handleRetweetClick.bind(this);
    this.handleConfirmClick = this.handleConfirmClick.bind(this);
    this.handleCancelClick = this.handleCancelClick.bind(this);
    this.handleRetweetComplete = this.handleRetweetComplete.bind(this);
  }

  handleRetweetClick() {
    this.setState({
      retweetRequested: true
    })
  }

  handleConfirmClick() {
    this.setState({
          retweeting: true,
          retweetRequested: false,
        },
        () => Client.retweet(this.props.id_str)
          .then(this.handleRetweetComplete)
      );
  }

  handleCancelClick() {
    this.setState({
      retweetRequested: false
    });
  }

  handleRetweetComplete() {
    this.setState({
      retweeted: true,
      retweeting: false
    });
  }

  retweetElement() {
    if (this.state.retweeted) {
      return <span>Retweeted!</span>;
    }

    if (this.state.retweetRequested) {
      return (
          <span>
            Are you sure?&nbsp;
            <a onClick={this.handleConfirmClick}>Yes</a> /&nbsp;
            <a onClick={this.handleCancelClick}>No</a>
          </span>
        );
    }

    if (this.state.retweeting) {
      return <Spinner spinnerName='three-bounce' />;
    }

    return <a onClick={this.handleRetweetClick}>Retweet</a>;
  }

  photo(m, i) {
    if (m.type === 'photo') {
      return <img key={i} src={m.media_url} role='presentation' />;
    }
    return null;
  }

  render() {
    const data = this.props;

    return (
      <div className='Tweet'>
        <div className='header'>
          <a href={`http://twitter.com/${data.user.screen_name}`}>
            <img role='presentation' src={data.user.profile_image_url} />
            <strong className='fullname'>{data.user.name} </strong>
            <span className='username'>
              <b>@{data.user.screen_name}</b>
            </span>
          </a>
          <small className='time'>
            <a href={`http://twitter.com/${data.user.screen_name}/status/${data.id_str}`} className='tweet-timestamp'>
              {' • '}{moment(data.created_at, 'dd MMM DD HH:mm:ss ZZ YYYY', 'en').fromNow()}
            </a>
          </small>
        </div>
        <div className='body'>
          <p className='tweet-text'>{data.text}</p>
          {(data.entities.media || []).map(this.photo)}
        </div>
        <div className='footer'>
          {this.retweetElement()}
        </div>
      </div>
    );
  }
}

export default Tweet;