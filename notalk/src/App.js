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

  render() {
    console.log(this.props.match.params.id);
    return(
      <div className="ChPage">
        <div className="ChPage-Header">
          {"ChannelID: " + (this.props.match.params.id?this.props.match.params.id:"NO ID")}
        </div>
        <div>
          {"Messeges"}
        </div>
      </div>
    );
  }
}

class ChList extends Component {
  constructor (props) {
    super(props);
    this.rootpath = props.rootpath;
    this.state = {
      channels: {
        'ch1': ['Channel1', 'lastmsg', 23],
        'ch5': ['Channel1', 'lastmsg', 23],
        'ch3': ['Channel1', 'lastmsg', 23],
        'ch2': ['Chanel2', 'yves: lastmsg', 1]
      }

    }
  };

  renderRows() {
    let elems = [];
    for(let key in this.state.channels) {
      elems.push(
        <a href={this.rootpath+key}>
          <div key={key} className={this.props.selected===key?"ChList-Row-selected":"ChList-Row"}>
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
        </a>
      );
    }
    return(
      elems
    );
  };

  render() {
    return(
      <div className="Messeges">
        <div className="ChList-Rows">
          {this.renderRows()}
        </div>
      </div>
    );
  }
}

class HomePage extends Component {
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
          <a key={button[0]} href={button[1]}>
            <div className={button[0]===this.state.selectedheaderbuttons?"Home-header-bar-button-selected":"Home-header-bar-button"} onClick={null}>
              <i className="material-icons">{button[2]}</i>
            </div>
          </a>
        );
      })
    );
  };

  render() {
    return (
      <div className="Home">
        <header className="Home-header">
          <h1 className="Home-title">{this.state.headertitle}</h1>
          <div className="Home-header-bar">
            {this.renderHeaderBar()}
          </div>
        </header>
        <Route exact path="/" component={ChList}/>
        <Route exact path={this.state.msglistroot+':id(.*)'} render={(props)=>{
          return(
            <SplitComp>
              <SplitLeft>
                <ChList selected={props.match.params.id} rootpath={this.state.msglistroot}/>
              </SplitLeft>
              <SplitRight>
                <ChPage  match={props.match} />
              </SplitRight>
            </SplitComp>
          )
        }}/>
        <Route exact path='/friends' component={ChList}/>
      </div>
    );
  }
}

class App extends Component {

  render() {
    // let HomePageReg = '/:page([^/]*)';
    // let ChPageReg = '/messeges/:id([0-9]+)';
    let HomePageReg = '/:page(.*)';
    return (
      <Router>
        <div>
          <Route exact path={HomePageReg} component={HomePage}/>
        </div>
      </Router>
    );
  }
}

export default App;
