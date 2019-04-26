import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import logo from '../../imgs/logo.png';

import ChatIcon from '@material-ui/icons/Chat';
import PeopleIcon from '@material-ui/icons/People';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import BugReportIcon from '@material-ui/icons/BugReport';



import './header.css';

export class HeaderPage extends Component {
  constructor (props) {
    super(props);
    let regex_result = /(http[s]?:\/\/)?([^\/\s]+)\/([^\/\s]+)[\/]?(.*)/g.exec(window.location.href);
    this.state = {
      headertitle: "Talksy",
      headerbuttons: [
        ['channels', '/channels/', <ChatIcon className="material-icons"/>],
        ['contacts', '/contacts/', <PeopleIcon className="material-icons"/>],
        ['trending', '/trending/', <TrendingUpIcon className="material-icons"/>],
        ['account', '/account/', <AccountCircleIcon className="material-icons"/>],
        // ['debug', '/debug/', 'bug_report']
      ],
      selectedheaderbuttons: regex_result?regex_result[3]:'channels'
    }
  };

  renderHeaderBar() {
    return(
      this.state.headerbuttons.map((button)=>{
        return(
          <Link to={button[1]}>
            <div key={button[0]}
              className={(button[0]===this.state.selectedheaderbuttons?"HeaderPage-header-bar-button-selected":"HeaderPage-header-bar-button")+" tooltip"}
              onClick={()=>{
                this.setState({selectedheaderbuttons: button[0]});
              }}
            >
              {button[2]}
              <span className="tooltiptext tooltip-bottom">{this.props.localize[button[0]]}</span>
            </div>
          </Link>
        );
      })
    );
  };

  renderDebugButton() {
    if(this.props.debug) {
      return (
        <Link to={'/debug/'}>
          <div key='debug'
          className={('debug'===this.state.selectedheaderbuttons?"HeaderPage-header-bar-button-selected":"HeaderPage-header-bar-button")+" tooltip"}
          onClick={()=>{
            this.setState({selectedheaderbuttons: 'debug'});
          }}
          >
            <BugReportIcon className="material-icons"/>
              <span className="tooltiptext tooltip-bottom">{"Debug components"}</span>
          </div>
        </Link>
      )
    }
  }

  render() {
    return (
      <div className="HeaderPage">
        <header className="HeaderPage-header">
          <h1 className="HeaderPage-title"><img height="32px" src={logo}/> {this.state.headertitle} </h1>
          <div className="HeaderPage-header-bar">
            {this.renderHeaderBar()}
            {this.renderDebugButton()}
          </div>
        </header>
        <div className="HeaderPage-Container">
        <div className="HeaderPage-Contain">
        {this.props.children}
        </div>
        </div>
      </div>
    );
  }
}
