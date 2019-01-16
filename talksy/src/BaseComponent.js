import React, { Component } from 'react';

export class BoxComp extends Component {
  render() {
      return(
        <div className="BoxComp">
          <div className="BoxComp-Back" onClick={()=>{
            this.props.history.goBack()
          }}>
          </div>
          <div className="BoxComp-Box">
            {this.props.children}
          </div>
        </div>
      );
  }
};

export class SplitComp extends Component {
  render() {
    if(this.props.show) {
      return(
        <div className="SplitComp">
          {this.props.children}
        </div>
      );
    }
    else {
      return null;
    }
  }
}

export class BackPage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
      return(
        <div className="BackPage">
          <div className="BackPage-Header">
            <div className="BackPage-Back-Button"
            onClick={()=>{
              this.props.history.goBack()
            }}>
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
            <div className="Page-Row-Button">
              <span>OK </span><i className="material-icons">check_circle</i>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export class AddToListPage extends Component {
  constructor(props) {
    super(props);
    // this.state = {
    //   channels: props.channels
    // };
    this.state = {
      list: []
    };
  }

  render() {
    return(
      <div className="Page">
        <div className="Page-Block">
          <div className="Page-Row">
            <div className="Page-Row-Text">
              <h1>{this.props.title}</h1>
              <p> {this.props.description}</p>
            </div>
          </div>
          <div className="Page-Row">
            <div className="Page-Row-Text">
              <h2>{"Add item"}</h2>
              <input placeholder="input here" className="ChPage-Sender-Input"></input>
            </div>
          </div>
          <div className="Page-Row">
            <div className="Page-Row-Button">
              <span>Add </span><i className="material-icons">add_circle</i>
            </div>
          </div>
        </div>

        <div className="Page-Block">
        <div className="Page-Row">
          <div className="Page-Row-Text">
            <h1>{"Items"}</h1>
            <p> {"All your items are below."}</p>
          </div>
        </div>
        </div>

      </div>
    );
  }
};

export class SplitRight extends Component {
  render() {
    return(
      <div className="SplitRight">
        {this.props.children}
      </div>
    );
  }
}

export class SplitLeft extends Component {
  render() {
    return(
      <div className="SplitLeft">
        {this.props.children}
      </div>
    );
  }
}
