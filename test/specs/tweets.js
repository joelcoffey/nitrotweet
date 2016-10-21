var assert = require('assert');

// Note: I ended up spending too much time on the app itself so drastically cut short the time spent on testing. Obviously not an acceptable tradeoff for production code!



describe('tweets screen', function() {
  it('should have the right title', function () {
    browser.url('http://127.0.0.1:3001');
    
    var title = browser.getTitle();
    assert.equal(title, 'NitroTweet');
  });

  it('should display NitroHQ tweets by default', function () {
    // I added little workaround to bypass the oauth process for the test browser
    // (not a very nice solution but it allowed me to at least put a few tests together in the time I had available)
    browser.url('http://127.0.0.1:3001/auth/usetestcreds');

    browser
      .url('http://127.0.0.1:3001')
      .waitForText('.Results');
    
    var tweets = browser.elements('.Results .Tweet .fullname').value;
    assert(tweets.length > 0);    
    tweets.forEach(function(tweet, i) {
      assert.equal(browser.elementIdText(tweet.ELEMENT).value, 'Nitro');
    });
  });

  it('should display other tweets when the input is changed', function () {
    browser.url('http://127.0.0.1:3001/auth/usetestcreds');

    browser
      .url('http://127.0.0.1:3001')
      .setValue('input', 'Google')
      .click('button')
      .waitUntil(function() {
      return browser.elementIdText(browser.elements('.Results .Tweet .fullname').value[0].ELEMENT).value === 'Google';
      });

    var tweets = browser.elements('.Results .Tweet .fullname').value;
    assert(tweets.length > 0);    
    tweets.forEach(function(tweet, i) {
      assert.equal(browser.elementIdText(tweet.ELEMENT).value, 'Google');
    });
  });
});