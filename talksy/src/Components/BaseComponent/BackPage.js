import React, { Component } from 'react';
import Ink from 'react-ink';
import './basecomp.css';

export class BackPage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
      return(
        <div className="BackPage">
          <div className="BackPage-Header">
          <Ink/>
            <div className="BackPage-Back-Button"
            onClick={()=>{
              this.props.history.goBack()
            }}>
            <Ink/>
              <i className="material-icons">arrow_back</i>
            </div>
            {(this.props.title)}
          </div>

          <div className="BackPage-Contain">
            {this.props.children}
          </div>
        </div>
      );
    }
}
