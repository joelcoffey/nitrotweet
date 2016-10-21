# NitroTweet

Allows a user enter a twitter username, then fetch and display their recent tweets. Tested only on Chrome running on Mac OS.


## Build Instructions

~~~~
npm run clientinstall
npm install
npm run build
~~~~

## Run instructions

First add Twitter API details to .env
~~~~
TWITTER_CONSUMER_TOKEN=
TWITTER_CONSUMER_TOKEN_SECRET=
TWITTER_USER_ACCESS_TOKEN=
TWITTER_USER_ACCESS_TOKEN_SECRET=
~~~~

Then start the application: 
~~~~
npm start
~~~~

* server should now be available at http://127.0.0.1:3001
* Note: localhost will not work correctly, please use IP


## Test Instructions

Install and start a selenium server

````
curl -O http://selenium-release.storage.googleapis.com/2.53/selenium-server-standalone-2.53.1.jar
java -jar selenium-server-standalone-2.53.1.jar
````

Start application in another tab

~~~~
npm start
~~~~

run tests in a third tab

~~~~
npm test
~~~~
