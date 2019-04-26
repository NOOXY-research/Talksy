import React, { Component } from 'react';
import Ink from 'react-ink';

export class Box extends Component {
  render() {
      return(
        <div className="BoxComp">
          <div className="BoxComp-Back"  onClick={()=>{
            if(this.props.onDistract) {
              this.props.onDistract();
            }
            else {
              this.props.history.goBack()
            }
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
