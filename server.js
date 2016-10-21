const express = require('express');
const app = express();
const session = require('express-session');
const oauth = require('oauth');

// read configuration
require('dotenv').config();

// initialize the server
app.set('port', (process.env.API_PORT || 3001));

app.use(session({
  secret: 'mysecret',
  resave: true,
  saveUninitialized: true,
  cookie: { secure: false }
}));

app.set('view engine', 'pug');

// read twitter configuration from env
app.locals.twitter = {};

[
  'TWITTER_CONSUMER_TOKEN',
  'TWITTER_CONSUMER_TOKEN_SECRET',
  'TWITTER_USER_ACCESS_TOKEN',
  'TWITTER_USER_ACCESS_TOKEN_SECRET'
].forEach((key) => {
  let value = process.env[key];
  if (!value) {
    throw new Error(`Please define ${key} in .env file in project root`);
  }
  app.locals.twitter[key] = value;
});

// authentication middleware
function isAuthorized(req, res, next) {
  if (req.session.authorized) {
    return next();
  }

  if (req.url.startsWith('/api')) {
    res.sendStatus(403);
  } else {
    res.redirect('/auth/twitter');
  }
};


// create a shared oath client
const oa = new oauth.OAuth(
    'https://api.twitter.com/oauth/request_token',
    'https://api.twitter.com/oauth/access_token',
    app.locals.twitter.TWITTER_CONSUMER_TOKEN,
    app.locals.twitter.TWITTER_CONSUMER_TOKEN_SECRET,
    '1.0A',
    'http://127.0.0.1:3001/auth/twitter_callback',
    'HMAC-SHA1'
  );


// redirect to twitter for an authorization request
app.get('/auth/twitter', (req, res) => {
  oa.getOAuthRequestToken(function(error, oauth_token, oauth_token_secret, results) {
    if (error) {
      return res.status(500).render('error', { message: "Authentication failure"});
    } else {
      req.session.oauth = {
        token: oauth_token,
        token_secret: oauth_token_secret
      };
      res.redirect('https://twitter.com/oauth/authorize?oauth_token=' + oauth_token);
    }
  });
});


// twitter authentication callback handler
app.get('/auth/twitter_callback', function(req, res) {
  if (req.session.oauth) {
    req.session.oauth.verifier = req.query.oauth_verifier;
    const oauth_data = req.session.oauth;
  
    oa.getOAuthAccessToken(oauth_data.token, oauth_data.token_secret, oauth_data.verifier, (error, token, secret, results) => {
        if (error) {
          return res.status(500).render('error', { message: "Authentication failure"});
        }
        req.session.oauth.access_token = token;
        req.session.oauth.access_token_secret = secret;
        req.session.authorized = true;
        res.redirect('/');
    });
  }
});


// quick hack to bypass auth for integ tests (wouldn't use for real app)
app.get('/auth/usetestcreds', (req, res) => {
  req.session.oauth = {
    access_token: app.locals.twitter.TWITTER_USER_ACCESS_TOKEN,
    access_token_secret: app.locals.twitter.TWITTER_USER_ACCESS_TOKEN_SECRET
  };
  req.session.authorized = true;
  req.session.testing = true;
  req.session.user = { user: 'nitrotweetapp' }
  res.sendStatus(200);
});


// list tweets
app.get('/api/tweets', isAuthorized, (req, res) => {
  const username = req.query.username;

  if (!username) {
    return res.status(400).json({ error: 'Missing required parameter `username`' });
  }

  oa.get(
      `https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=${username}`,
      req.session.oauth.access_token,
      req.session.oauth.access_token_secret,
      function (error, data, result){
        if (error) {
          console.log(error);
          return res.status(500).json({ error: 'An error was encountered while retrieving tweets' });
        }

        res.json({ tweets: JSON.parse(data) });
      }
    );
});


// retweet
app.post('/api/tweets/retweet/:id', isAuthorized, (req, res) => {
  const id = req.params.id;

  oa.post(
      `https://api.twitter.com/1.1/statuses/retweet/${id}.json`,
      req.session.oauth.access_token,
      req.session.oauth.access_token_secret,
      `id=${id}`,
      'text/plain',
      (error, data, results) => {
        if (error) {
          console.log(error);
          return res.status(500).json({ error: 'An error was encountered while retweeting' });
        }
        res.json({ tweet: JSON.parse(data) });
      }
    );
});


// get currently authorised user
app.get('/api/users/current', (req, res) => {
  if (!req.session.authorized) {
    return res.json({ user: null });
  }

  if (req.session.user) {
    return res.json({ user: req.session.user });
  }

  oa.get(
      'https://api.twitter.com/1.1/account/verify_credentials.json',
      req.session.oauth.access_token,
      req.session.oauth.access_token_secret,
      function (error, twitterResponseData, result) {
        if (error) {
            console.log(error)
            return res.status(500).json({ error: 'Could not get user data'});
        }
        req.session.user = JSON.parse(twitterResponseData);
        res.json({ user: req.session.user });
      }
    );
});


// mount the client app
app.use('/', express.static(`${__dirname}/client/build`));


// start the server
app.listen(app.get('port'), () => {
  console.log(`Find the server at: http://127.0.0.1:${app.get('port')}/`);
})