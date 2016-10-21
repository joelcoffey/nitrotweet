import React, { Component } from 'react';
import './Login.css';

class Login extends Component {
  render() {
    return (
      <div className="Login">
        <a href='http://127.0.0.1:3001/auth/twitter'>Authorize with Twitter</a>
      </div>
    );
  }
}

export default Login;