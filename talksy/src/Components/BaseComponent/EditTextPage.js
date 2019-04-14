import React, { Component } from 'react';
import Ink from 'react-ink';
import './basecomp.css';

export class EditTextPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: props.text
    }
  }

  render() {
    return(
      <div className="Page">
        <div className="Page-Block">
          <div className="Page-Row">
          <Ink/>
            <div className="Page-Row-Text">
              <h1>{this.props.title}</h1>
              <p> {this.props.description}</p>
            </div>
          </div>
          <div className="Page-Row">
            <div className="Page-Row-Text">
              <h2>{"Enter here"}</h2>
              <input placeholder={this.props.text} className="ChPage-Sender-Input" onChange={(e) => {this.setState({text: e.target.value})}}></input>
            </div>
          </div>
          <div className="Page-Row" onClick={()=>{this.props.onFinish(this.state.text)}}>
          <Ink/>
            <div className="Page-Row-Button">
              <span>OK </span><i className="material-icons">check_circle</i>
            </div>
          </div>
        </div>
      </div>
    );
  }
};
