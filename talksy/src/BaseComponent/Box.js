import React, { Component } from 'react';
import Ink from 'react-ink';
import './basecomp.css';

export class Box extends Component {
  render() {
      return(
        <div className="BoxComp">
          <div className="BoxComp-Back" onClick={()=>{
            this.props.history.goBack()
          }}>
          <Ink/>
          </div>
          <div className="BoxComp-Box">
            {this.props.children}
          </div>
        </div>
      );
  }
};
