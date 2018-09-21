import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import logo from './logo.svg';
import './App.css';

class SplitComp extends Component {
  render() {
    return(
      <div className="SplitComp">
        {this.props.children}
      </div>
    );

  }
}

class SplitRight extends Component {
  render() {
    return(
      <div className="SplitRight">
        {this.props.children}
      </div>
    );
  }
}

class SplitLeft extends Component {
  render() {
    return(
      <div className="SplitLeft">
        {this.props.children}
      </div>
    );
  }
}

class ChPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messeges: props.messeges
    };
  }

  render() {
    if(this.props.show) {
      return(
        <div className="ChPage">
          <div className="ChPage-Header">
            {"ChannelID: " + (this.props.match.params.id?this.props.match.params.id:"Not selected")}
          </div>
          <div>
          </div>
          <div className="ChPage-Sender">
            <input placeholder="input text...." className="ChPage-Sender-Input"></input>
            <div className="ChPage-Sender-Buttons">
              <div className="ChPage-Sender-Button"><i className="material-icons">send</i></div>
            </div>
          </div>
        </div>
      );
    }
    else {
      return null;
    }
  }
}

class FriendPage extends Component {
  render() {
    return(
      <div className="">
        {"friends"}
      </div>
    );
  }
};

class SettingsPage extends Component {
  render() {
    return(
      <div className="">
        {"settings"}
      </div>
    );
  }
};

class AccountPage extends Component {
  render() {
    return(
      <div className="">
        {"account"}
      </div>
    );
  }
};

class ChList extends Component {
  constructor (props) {
    super(props);
    this.rootpath = props.rootpath;
    this.state = {
      channels: {
        'ch1': ['Channel1', 'lastmsg', 23, {1: ['text', 'hello', 0]}],
        'ch2': ['Channel2', 'lastmsg', 23],
        'ch3': ['Channel3', 'lastmsg', 23],
        'ch4': ['Channel4', 'lastmsg', 23],
        'ch5': ['Channel5', 'lastmsg', 23],
        'ch6': ['Channel6', 'lastmsg', 23],
        'ch7': ['Channel7', 'lastmsg', 23],
        'ch8': ['Channel8', 'lastmsg', 23],
        'ch9': ['Channel9', 'lastmsg', 23],
        'ch10': ['Chanel10', 'yves: lastmsg', 1]
      }

    }
  };

  renderRows() {
    let elems = [];
    for(let key in this.state.channels) {
      elems.push(
          <div key={key} className={this.props.selected===key?"ChList-Row-selected":"ChList-Row"} onClick={()=>{this.props.history.push(this.rootpath+key)}}>
            <div className="ChList-Row-ChName">
              {this.state.channels[key][0]}
            </div>
            <div className="ChList-Row-ChMore">
              {this.state.channels[key][1]}
            </div>
            <div className="ChList-Row-ChUnread">
              {this.state.channels[key][2]}
            </div>
          </div>
      );
    }
    return elems;
  };

  render() {
    return(
      <div className="ChList-Rows">
        <div className="ChList-Header">
          <span>new messeges </span><i className="material-icons">add_circle</i>
        </div>
        {this.renderRows()}
      </div>
    );
  }
}

class HeaderPage extends Component {
  constructor (props) {
    super(props);
    let msglistroot = "/messeges/";
    this.state = {
      msglistroot: msglistroot,
      headertitle: "NOOXY Talk",
      headerbuttons: [
        ['messeges', msglistroot, 'chat'],
        ['friends', '/friends/', 'people'],
        ['account', '/account/', 'account_circle'],
        ['settings', '/settings/', 'settings']
      ],
      selectedheaderbuttons: props.match.params.page.split('/')[0]
    }
  };

  renderHeaderBar() {
    return(
      this.state.headerbuttons.map((button)=>{
        return(
            <div key={button[0]}
              className={button[0]===this.state.selectedheaderbuttons?"HeaderPage-header-bar-button-selected":"HeaderPage-header-bar-button"}
              onClick={()=>{
                this.setState({selectedheaderbuttons: button[0]});
                this.props.history.push(button[1]);
              }}
            >
              <i className="material-icons">{button[2]}</i>
            </div>
        );
      })
    );
  };

  renderChannels() {
    let elems = [];
    for(let key in this.state.channels) {
      elems.push(

      );
    }
    return elems;
  };

  render() {
    return (
      <div className="HeaderPage">
        <header className="HeaderPage-header">
          <h1 className="HeaderPage-title">{this.state.headertitle} <i className="material-icons">chat_bubble</i></h1>
          <div className="HeaderPage-header-bar">
            {this.renderHeaderBar()}
          </div>
        </header>
        <Route exact path="/" component={ChList}/>
        <Route exact path={this.state.msglistroot+':id(.*)'} render={(props)=>{
          return(
            <SplitComp>
              <SplitLeft>
                <ChList history={props.history} selected={props.match.params.id} rootpath={this.state.msglistroot}/>
              </SplitLeft>
              <SplitRight>
                <ChPage show={true} match={props.match} />
                <ChPage  match={props.match} />
              </SplitRight>
            </SplitComp>
          )
        }}/>
        <Route exact path='/friends' component={FriendPage}/>
        <Route exact path='/settings' component={SettingsPage}/>
        <Route exact path='/account' component={AccountPage}/>
      </div>
    );
  }
}

class App extends Component {

  render() {
    // let HeaderPageReg = '/:page([^/]*)';
    // let ChPageReg = '/messeges/:id([0-9]+)';
    let HeaderPageReg = '/:page(.*)';
    return (
      <Router>
        <div>
          <Route exact path={HeaderPageReg} component={HeaderPage}/>
        </div>
      </Router>
    );
  }
}

export default App;
