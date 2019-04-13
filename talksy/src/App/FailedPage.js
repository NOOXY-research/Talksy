import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Ink from 'react-ink';

export default class FailedPage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return(
      <div className="NotificationPage">
        <div className="Page-Block">
          <div className="Page-Row">
            <div className="Page-Row-Text">
              <h1>{"Disconnected"}</h1>
              <p> {"Error occured while connecting to NoService. We are trying to reconnect."}</p>
            </div>
          </div>
          <div className="Page-Row" onClick={()=> {window.location.reload();}}>
          <Ink/>
            <div className="Page-Row-Text">
              <h2>{"Retry now"}</h2>
              <p> {'Click this buttom to reload the page now.'}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
};
