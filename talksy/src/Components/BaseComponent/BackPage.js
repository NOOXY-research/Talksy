import React, { Component } from 'react';
import Ink from 'react-ink';

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
              console.log(this.props);
              if(this.props.onBack) {
                this.props.onBack();
              }
              else {
                this.props.history.goBack()
              }
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
