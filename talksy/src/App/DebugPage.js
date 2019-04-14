import React, { Component } from 'react';
import Ink from 'react-ink';

import {Link } from "react-router-dom";

const CONSTANTS = require('../constants.json');

const nshost = CONSTANTS.NOSERVICE_HOST;
const debug = CONSTANTS.DEBUG;

export default class DebugPage extends Component {
  constructor(props) {
    super(props);
  }

  renderLogs() {
    let elems = [];
    for(let key in this.props.logs) {
      elems.push(
          <div key={key} className="Page-Row">
          <Ink/>
            <div className="Page-Row-Text">
              <h2>{'ln['+key+'] '+(this.props.logs[key])[0]}</h2>
              <p>{(this.props.logs[key])[1]}</p>
            </div>
          </div>
      );
    }
    return (elems);
  }

  render() {
    return(
      <div className="Page">
        <div className="Page-Block">
          <div className="Page-Row">
          <Ink/>
            <div className="Page-Row-Text">
              <h1>{"Debug Component"}</h1>
              <p> {"here are the debug components."}</p>
            </div>
          </div>
          <div className="Page-Row">
          <Ink/>
            <div className="Page-Row-Text">
              <h2>{"NoService Daemon"}</h2>
              <p> {'Host: '+nshost+', Debug: '+debug}</p>
            </div>
          </div>
          <Link to='/noservice/signin'>
            <div className="Page-Row">
            <Ink/>
              <div className="Page-Row-Text">
                <h2>{"NoService signin"}</h2>
                <p> {"NOOXY service SigninPage"}</p>
              </div>
            </div>
          </Link>
          <Link to='/noservice/password'>
            <div className="Page-Row">
            <Ink/>
              <div className="Page-Row-Text">
                <h2>{"NoService Password"}</h2>
                <p> {"NOOXY service auth by password"}</p>
              </div>
            </div>
          </Link>
        </div>

        <div className="Page-Block">
        <div className="Page-Row">
        <Ink/>
          <div className="Page-Row-Text">
            <h1>{"Debug Logs"}</h1>
            <p> {"below are the debug logs."}</p>
          </div>
        </div>
        {this.renderLogs()}
        </div>
      </div>
    );
  }
};
