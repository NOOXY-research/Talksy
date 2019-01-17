// APP.js
// Description:
// "APP.js" is a NOOXY NoTalk Service client.
// Copyright 2018 NOOXY. All Rights Reserved.

import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { SigninPage, PasswordPage } from "./NScReact.js";
import { BoxComp, SplitComp, BackPage, EditTextPage, EditListPage, AddToListPage, SplitLeft, SplitRight} from "./BaseComponent";
import {ChPage, ChList, NewChannelPage} from "./channel";
import {ContactsPage} from "./contact";
import {AccountPage} from "./account";
import NSClient from './NSc.js';
import logo from './logo.png';
import './App.css';
import './tooltip.css';

const NoService = new NSClient();

const nshost = '0.0.0.0';
const debug = true;
const nsport = null;

let NoTalk;
let NoUser;

NoService.setDebug(debug);
// EditListPage
class MainCtrlComp extends Component {
  constructor (props) {
    super(props);
    let regex_result = /(http[s]?:\/\/)?([^\/\s]+)\/([^\/\s]+)[\/]?(.*)/g.exec(window.location.href);
    this.state = {
      headertitle: "NOTalk alpha (avalible 2019 summer, still in development)",
      buttons: {
        'channels': [ '/channels/', 'chat'],
        'contacts': [ '/contacts/', 'people'],
        'trending': ['/trending/', 'trending_up'],
        'account': ['/account/', 'account_circle'],
        // 'debug': ['/debug/', 'bug_report']
      },
      selectedbutton: regex_result?regex_result[3]:'channels'
    }
  };

  renderButton() {
    return(
      Object.keys(this.state.buttons).map((key, index)=>{
        return(
            <div key={key}
              className={key===this.state.selectedbutton?"MainCtrlComp-button-selected":"MainCtrlComp-button"}
              onClick={()=>{
                this.setState({selectedbutton: key});
                this.props.history.push(this.state.buttons[key][0]);
              }}
            >
              <i className="material-icons">{this.state.buttons[key][1]}</i>
            </div>
        );
      })
    );
  };

  render() {
    if(this.props.debug) {
      this.state.buttons['debug'] = ['/debug/', 'bug_report'];
    }
    else {
      delete this.state.buttons['debug'];
    }
    return (
      <div className="MainCtrlComp">
          <div className="MainCtrlComp-buttons">

            {this.renderButton()}
            <div className="MainCtrlComp-button">
              <i className="material-icons">unfold_more</i>
            </div>
          </div>
      </div>
    );
  }
}

class SettingsPage extends Component {
  render() {
    return(
      <div className="">
        {"settings"}
      </div>
    );
  }
};

class TrendingPage extends Component {
  render() {
    return(
      <div className="Page">
        <div className="Page-Block">
          <div className="Page-Row">
            <div className="Page-Row-Text">
              <h1>{"Trending"}</h1>
              <p> {"Knowing what's people are taking about."}</p>
            </div>
          </div>
        </div>

        <div className="Page-Block">
          <div className="Page-Row">
            <div className="Page-Row-Text">
              <h1>{"Global"}</h1>
              <p> {"Knowing what's people are taking about."}</p>
            </div>
          </div>
          <div className="Page-Row">
            <div className="Page-Row-Text">
              <h2>{"#Whatever"}</h2>
              <p> {"some talk."}</p>
            </div>
          </div>
          <div className="Page-Row">
            <div className="Page-Row-Text">
              <h2>{"#Whatever"}</h2>
              <p> {"some talk."}</p>
            </div>
          </div>
        </div>

        <div className="Page-Block">
          <div className="Page-Row">
            <div className="Page-Row-Text">
              <h1>{"Your Contacts"}</h1>
              <p> {"Knowing what's people are taking about."}</p>
            </div>
          </div>
          <div className="Page-Row">
            <div className="Page-Row-Text">
              <h2>{"#Whatever"}</h2>
              <p> {"some talk."}</p>
            </div>
          </div>
          <div className="Page-Row">
            <div className="Page-Row-Text">
              <h2>{"#Whatever"}</h2>
              <p> {"some talk."}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

class DebugPage extends Component {
  constructor(props) {
    super(props);
  }

  renderLogs() {
    let elems = [];
    for(let key in this.props.logs) {
      elems.push(
          <div key={key} className="Page-Row">
            <div className="Page-Row-Text">
              <h2>{'ln['+key+'] '+(this.props.logs[key])[0]}</h2>
              <p>{(this.props.logs[key])[1]}</p>
            </div>
          </div>
      );
    }
    return (elems);
  }

  render() {
    return(
      <div className="Page">
        <div className="Page-Block">
          <div className="Page-Row">
            <div className="Page-Row-Text">
              <h1>{"Debug"}</h1>
              <p> {"here are the debug components."}</p>
            </div>
          </div>
          <div className="Page-Row">
            <div className="Page-Row-Text">
              <h2>{"NoService Daemon"}</h2>
              <p> {'Host: '+nshost+', Debug: '+debug}</p>
            </div>
          </div>
          <div className="Page-Row" onClick={()=>{
            this.props.history.push('/noservice/signin');
          }}>
            <div className="Page-Row-Text">
              <h2>{"NoService signin"}</h2>
              <p> {"NOOXY service SigninPage"}</p>
            </div>
          </div>
          <div className="Page-Row" onClick={()=>{
            this.props.history.push('/noservice/password');
          }}>
            <div className="Page-Row-Text">
              <h2>{"NoService Password"}</h2>
              <p> {"NOOXY service auth by password"}</p>
            </div>
          </div>

        </div>

        <div className="Page-Block">
        {this.renderLogs()}
        </div>
      </div>
    );
  }
};

class FailedPage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return(
      <div className="NotificationPage">
        <div className="Page-Block">
          <div className="Page-Row">
            <div className="Page-Row-Text">
              <h1>{"Connection Failed"}</h1>
              <p> {"Error occured while connecting to NoService."}</p>
            </div>
          </div>
          <div className="Page-Row">
            <div className="Page-Row-Text">
              <h2>{"NoService Daemon"}</h2>
              <p> {'Host: '+nshost+', Debug: '+debug}</p>
            </div>
          </div>
          <div className="Page-Row" onClick={()=> {window.location.reload();}}>
            <div className="Page-Row-Text">
              <h2>{"Retry"}</h2>
              <p> {'Click this buttom to reload the page.'}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

class HeaderPage extends Component {
  constructor (props) {
    super(props);
    let regex_result = /(http[s]?:\/\/)?([^\/\s]+)\/([^\/\s]+)[\/]?(.*)/g.exec(window.location.href);
    this.state = {
      headertitle: "Talksy(DEV)",
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
            <div key={button[0]}
              className={(button[0]===this.state.selectedheaderbuttons?"HeaderPage-header-bar-button-selected":"HeaderPage-header-bar-button")+" tooltip"}
              onClick={()=>{
                this.setState({selectedheaderbuttons: button[0]});
                this.props.history.push(button[1]);
              }}
            >
              <i className="material-icons">{button[2]}</i>
              <span className="tooltiptext tooltip-bottom">{button[0]}</span>
            </div>
        );
      })
    );
  };

  renderDebugButton() {
    if(this.props.debug) {
      return (
        <div key='debug'
        className={('debug'===this.state.selectedheaderbuttons?"HeaderPage-header-bar-button-selected":"HeaderPage-header-bar-button")+" tooltip"}
        onClick={()=>{
          this.setState({selectedheaderbuttons: 'debug'});
          this.props.history.push('/debug/');
        }}
        >
          <i className="material-icons">{'bug_report'}</i>
            <span className="tooltiptext tooltip-bottom">{"Debug components"}</span>
        </div>
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
        {this.props.children}
      </div>
    );
  }
}

class App extends Component {
  constructor (props) {
    let channelroot = "/channels/";
    super(props);
    this.state = {
      debug: debug,
      mymeta: {},
      debuglogs: [['debug', 'debug']],
      channelroot: channelroot,
      channelnow: window.location.href.split(channelroot)[1]?window.location.href.split(channelroot)[1].split('/')[0]: null,
      channels: {
        'loading': {
          Displayname: "Loading...",
          Description: "Talksy is loading your messeges."
        }
      }
    }

    this.onSelectCh = (chid, history)=> {
      this.setState((prevState) => {
          history.push(channelroot+chid);
          return { channelnow: chid}

      })
    }

    this.log = (title, contain)=> {
      this.setState((prevState) => {
        return prevState.debuglogs.push([title, contain]);
      });
    };

    this.setDebug = (bool)=> {
      console.log('DEBUG MODE ON');
      this.log('DEBUG MODE ON');
      this.setState({debug: bool});
    };
  }




  componentDidMount() {
    this.log('NoService', 'Setting up NOOXY service implementations.');
    NoService.getImplement((err, NSimplementation)=>{
      NoService.connect(nshost);
      this.log('NoService', 'Connecting to NOOXY service.');
      NSimplementation.setImplement('signin', (connprofile, data, data_sender)=>{
        this.log('NoService Auth', 'NOOXY service signin emitted.');
        this.history.push('/noservice/signin');
      });
      NSimplementation.setImplement('AuthbyPassword', (connprofile, data, data_sender) => {
        this.log('NoService Auth', 'NOOXY service Authby Password emitted.');
        this.history.push('/noservice/password?authtoken='+data.d.t);
      });
      this.log('NoService', 'Have set up NOOXY service implementations.');
      NoService.createActivitySocket('NoTalk', (err, as)=>{
        NoTalk = as;
        if(err) {
          this.log('NoService', 'Connection Failed.');
          this.setState({connectionfailed: true});
        }
        else {
          as.onEvent('MyMetaUpdated', (err, json)=> {
            let newmeta = json;
            for(let i in this.state.mymeta) {
              if(!newmeta[i]) {
                newmeta[i] = this.state.mymeta[i];
              }
            }
            this.setState({mymeta: newmeta});
          });
          this.updateMyMeta = (newmeta)=> {
            as.call('updateMyMeta', newmeta, ()=>{
              this.log('updateMyMeta', 'OK');
            })
          }
          this.log('NoService', 'Connected to the Service.');

          as.call('getMyMeta', null, (err, json)=> {
            this.log('getMyMeta', JSON.stringify(json));
            this.setState({mymeta: json});

            NoService.createActivitySocket('NoUser', (err, as2)=>{
              NoUser = as2;
              console.log(as2);
              NoUser.call('returnUserMeta', null, (err, json2)=> {
                this.setState({mymeta: Object.assign({}, json, json2)});
                this.log('NoUser', JSON.stringify(json2));
              });
            });

            as.call('getMyChs', null, (err, json)=> {
              this.setState((prevState)=> {
                prevState.channels = json;
                return prevState;
              });
              this.log('getMyChs', JSON.stringify(json));
            });
          });

          as.onData = (data) => {
            this.log('NSActivity onData', data);
            // this.setState({debuglogs: this.state.debuglogs.push(['NoService', data])}) ;
          }
          as.onClose = ()=> {
            this.log('NSActivity onClose', 'Activity closed.');
          }
        }
      });
    });
  }

  renderConnectionFailed() {
    if(this.state.connectionfailed) {
      return <FailedPage/>;
    }
    else {
      return null;
    }
  }

  renderChannels(props) {
    let elems = [];
    for(let key in this.state.channels) {
      elems.push(
        <ChPage
          mymeta = {this.state.mymeta}
          channelid={key}
          channelmeta={this.state.channels[key]}
          show={this.state.channelnow==key}
          match={props.match} history={props.history}
          rootpath={this.state.channelroot}
        />
      );
    }
    return elems;
  }

  emitChCreate(meta, callback) {
    // return status
    NoTalk.call('createCh', meta, (err, meta)=> {
      callback(err, meta);
    });
  }

  logout() {
    NoService.logout();
  }

  render() {
    // let HeaderPageReg = '/:page([^/]*)';
    // let ChPageReg = '/channels/:id([0-9]+)';
    let HeaderPageReg = ':page(.*)';
    return (
      <Router>
        <div className="App">
          <Route exact path={HeaderPageReg} render={(props)=>{
            this.history = props.history;
            return(
              <HeaderPage history={props.history} debug={this.state.debug}>
                <MainCtrlComp history={props.history} debug={this.state.debug}/>
                <Route exact path=":path(/|/channels/)" render={(props)=>{
                  return (
                    <ChList
                    onSelect={this.onSelectCh}
                    channels={this.state.channels}
                    history={props.history}
                    selected={props.match.params.id}
                    rootpath={this.state.channelroot}
                    />
                  )
                }}/>
                <Route exact path={this.state.channelroot+':id(.+)'} render={(props)=>{
                  return(
                    <SplitComp show={true}>
                      <SplitLeft>
                        <ChList
                        onSelect={this.onSelectCh}
                        channels={this.state.channels}
                        history={props.history}
                        selected={props.match.params.id}
                        rootpath={this.state.channelroot}/>
                      </SplitLeft>
                      <SplitRight>
                        <NewChannelPage show={this.state.channelnow=='new'} emitChCreate={this.emitChCreate} history={props.history} setDebug={this.setDebug}/>
                        {this.renderChannels(props)}
                      </SplitRight>
                    </SplitComp>
                  )
                }}/>
                <Route exact path='/contacts:path(/|/.*)' component={ContactsPage}/>
                <Route exact path='/settings:path(/|/.*)' component={SettingsPage}/>
                <Route exact path='/trending:path(/|/.*)' component={TrendingPage}/>
                <Route exact path='/account:path(/|/.*)' render={(props)=>{
                  return(
                    <AccountPage history={props.history} logout={this.logout} mymeta={this.state.mymeta} updateMyMeta={this.updateMyMeta}/>
                  );
                }}/>
                <Route exact path='/debug' render={(props)=>{
                  return(
                    <DebugPage history={props.history} logs={this.state.debuglogs}/>
                  );
                }}/>
                <Route exact path='/noservice/signin' render={(props)=>{
                  return(
                    <SigninPage NSc={NoService} onFinish={window.location.reload}/>
                  );
                }}/>
                <Route exact path='/noservice/password' render={(props)=>{
                  return(
                    <PasswordPage NSc={NoService} onFinish={props.history.goBack}/>
                  );
                }}/>
                {this.renderConnectionFailed()}

              </HeaderPage>
            );
          }}/>
        </div>
      </Router>
    );
  }
}

export default App;
