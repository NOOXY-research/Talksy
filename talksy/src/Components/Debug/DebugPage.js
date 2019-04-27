import React, { Component } from 'react';
import Ink from 'react-ink';

import {Link} from "react-router-dom";
import Dialog from '@material-ui/core/Dialog';

export class DebugPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      show_app_state: false
    };
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
      <div className="Page Page-Root">
        <Dialog open={this.state.show_app_state} onClose={()=>{this.setState({show_app_state: false})}}>
          <div className="Page-Block">
            <div className="Page-Row">
            <Ink/>
              <div className="Page-Row-Text">
                <h1>{"Talksy app state"}</h1>
                <p>{"View your app's state."}</p>
              </div>
            </div>
          </div>
          <div className="Page-Block">
            <div className="Page-Row">
              <div className="Page-Row-Text">
                <h2>{"JSON form:"}</h2>
                <plaintext>{JSON.stringify(this.props.app_state, null, 2)}</plaintext>
              </div>
            </div>
          </div>
        </Dialog>

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
              <p> {'Host: '+this.props.noservice_host+', Debug: '+this.props.debug}</p>
            </div>
          </div>
          <div className="Page-Row" onClick={()=>{this.setState({show_app_state: true})}}>
          <Ink/>
            <div className="Page-Row-Text">
              <h2>{"Show app state"}</h2>
              <p> {"Show App react app state."}</p>
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
