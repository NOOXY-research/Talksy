import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import logo from '../pics/logo.png';

import './header.css';

export default class HeaderPage extends Component {
  constructor (props) {
    super(props);
    let regex_result = /(http[s]?:\/\/)?([^\/\s]+)\/([^\/\s]+)[\/]?(.*)/g.exec(window.location.href);
    this.state = {
      headertitle: "Talksy",
      headerbuttons: [
        ['channels', '/channels/', 'chat'],
        ['contacts', '/contacts/', 'people'],
        ['trending', '/trending/', 'trending_up'],
        ['account', '/account/', 'account_circle'],
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
              <i className="material-icons">{button[2]}</i>
              <span className="tooltiptext tooltip-bottom">{this.props.langs[button[0]]}</span>
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
            <i className="material-icons">{'bug_report'}</i>
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
