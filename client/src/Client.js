import 'whatwg-fetch';

function search(query) {
  return fetch(`/api/tweets?username=${query}`, {
      accept: 'application/json',
      credentials: 'same-origin'
    })
    .then(checkStatus)
    .then(parseJSON);
}

function retweet(id) {
  return fetch(`/api/tweets/retweet/${id}`, {
      accept: 'application/json',
      credentials: 'same-origin',
      method: 'POST'
    })
    .then(checkStatus);
}

function getUser() {
  return fetch('/api/users/current', {
      accept: 'application/json',
      credentials: 'same-origin',
    })
  .then(checkStatus)
  .then(parseJSON);
}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    if (response.status === 403) {
      location.href = 'http://127.0.0.1:3001/auth/twitter';
    }
    const error = new Error(`HTTP Error ${response.statusText}`);
    error.status = response.statusText;
    error.response = response;
    console.log(error);
    return response.then(err => {throw error;});
  }
}

function parseJSON(response) {
  return response.json();
}

export default { search, retweet, getUser };