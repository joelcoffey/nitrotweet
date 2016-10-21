import React from 'react';
import Tweet from './Tweet';
import './Results.css';

export default function Results(props) {
  return (
    <ul className='Results'>
    {props.tweets.length === 0 && props.username ? <span className="notice">No tweets for {props.username}</span> : null}
    {
      props.tweets.map((tweet, i) => <li key={`${props.username}-${i}`}><Tweet {...tweet} /></li>)
    }
    </ul>
  );
}