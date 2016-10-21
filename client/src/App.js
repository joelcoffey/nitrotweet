import React, { Component } from 'react';
import TweetSearch from './TweetSearch';
import Client from './Client';
import Login from './Login';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null
    };
  }

  fetchUserInfo() {
    Client.getUser()
      .then((response) => {
        this.setState({
          user: response.user
        })
      });
  }

  componentDidMount() {
    this.fetchUserInfo();
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>NitroTweet</h2>
          {this.state.user ? <p>@{this.state.user.screen_name}</p> : null}
        </div>
        {this.state.user ? <TweetSearch /> : <Login />}
      </div>
    );
  }
}

export default App;