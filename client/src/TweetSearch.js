import React, { Component } from 'react';
import Client from './Client';
import Results from './Results';
import './TweetSearch.css';

class TweetSearch extends Component {

  constructor(props) {
    super(props);
    this.state = {
      username: 'NitroHQ',
      tweets: [],
      error: ''
    }
    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handleSearchClick = this.handleSearchClick.bind(this);
  }

  componentDidMount() {
    this.search(this.state.username);
  }

  handleUsernameChange(e) {
    this.setState({
      username: e.target.value
    });
  }

  handleSearchClick() {
    this.search(this.state.username);
  }

  search(username) {
    if (username === '') {
      this.setState({
        tweets: []
      });
    } else {
      Client.search(username)
        .then((response) => {
          this.setState({
            tweets: response.tweets || [],
            error: response.error || ''
          });
        });
    }
  }

  render() {
    return (
      <div className='TweetSearch'>
        <p>Go on, enter a Twitter handle!</p>
        @<input
          className='prompt'
          placeholder='Enter Twitter username'
          value={this.state.username}
          onChange={this.handleUsernameChange}
        />
        <button onClick={this.handleSearchClick}>Search</button>
        {this.state.error ? <span className='error'>{this.state.error}</span> : null}
        <Results {...this.state} />
      </div>
    );
  }
}

export default TweetSearch;