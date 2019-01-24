// APP.js
// Description:
// "APP.js" is a NOOXY NoTalk Service client.
// Copyright 2019-2019 NOOXY. All Rights Reserved.

import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { SigninPage, PasswordPage } from "./NScReact.js";
import { BoxComp, SplitComp, BackPage, EditTextPage, EditListPage, AddToListPage, SplitLeft, SplitRight} from "./BaseComponent";
import {ChannelPage, ChannelList, NewChannelPage, ChannelSettingsPage} from "./channel";
import {ContactsPage, NewContactsPage} from "./contact";
import {MyAccountPage, UserAccountPage} from "./account";
import NSClient from './NSc.js';
import logo from './logo.png';
import './App.css';
import './tooltip.css';

const NoService = new NSClient();
const VERSION = "alpha 2019.1.25"
const REFRESH_ACTIVITY_INTERVAL= 1000*60;

const NOSERVICE_SIGNUPURL = "https://nooxy.org/static/NoService/signup.html";


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
              <p> {"Knowing what's people are taking about. (Not avalible now)"}</p>
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
              <h1>{"Debug Component"}</h1>
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
        <div className="Page-Row">
          <div className="Page-Row-Text">
            <h1>{"Debug Logs"}</h1>
            <p> {"below are the debug logs."}</p>
          </div>
        </div>
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
        <div className="HeaderPage-Container">
        <div className="HeaderPage-Contain">
        {this.props.children}
        </div>
        </div>
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
          Description: "Talksy is loading your messages."
        }
      },
      contacts: {},
      users:{},
    }

    this.UserNameToId = {};

    this.onSelectCh = (chid, history)=> {
      this.setState((prevState) => {
          history.push(channelroot+chid);
          return { channelnow: chid}

      })
    }

    this.log = (title, contain)=> {
      if(typeof(contain)!= 'string') {
        contain = JSON.stringify(contain);
      }
      this.setState((prevState) => {
        return prevState.debuglogs.push([title, contain]);
      });
    };

    this.setDebug = (bool)=> {
      console.log('DEBUG MODE ON');
      this.log('DEBUG MODE ON');
      this.setState({debug: bool});
    };

    this.searchUsers = (username, callback)=> {
      NoUser.call("searchUsersByUsername", {n:username}, (err, json)=> {
        this.log("searchUsers", json);
        callback(err, json.r);
      });
    }

    this.addContacts =(contacts, type, callback)=> {
      NoTalk.call("addConts", {c:contacts, t:type}, (err, json)=> {
        this.log("addConts", json);
        if(callback)
          callback(err, json);
      });
    }

    this.getMyContacts = (callback)=> {
      NoTalk.call("getMyConts", null, (err, json)=> {
        this.log("getMyConts", json);
        callback(err, json.r);
      });
    }

    this.getUserActivity = (userid, callback)=> {
      NoTalk.call("getUserAct", {i: userid}, (err, json)=> {
        this.log("getUserAct("+userid+")", json);
        callback(err, json.r);
      });
    }

    this.addUsersToChannel = (chid, users, callback)=> {
      NoTalk.call("addUsersToCh", {c:chid,i:users}, (err, json)=> {
        this.log("addUsersToChannel", json);
        callback(err, json);
      });
    }

    this.setUserNameToId= (name, id)=> {
      this.UserNameToId[name] = id;
    }

    this.returnUserNameToId = (name)=> {
      return this.UserNameToId[name];
    }

    this.loadUserMeta = (userid)=> {
      if(NoTalk&&userid) {
        if(!Object.keys(this.state.users).includes(userid)&&userid!=null) {
          this.setState(prevState=> {
            prevState.users[userid] = {};
            return prevState;
          }, ()=> {
            NoTalk.call("getUserMeta", {i:userid}, (err, meta)=> {
              this.log("loadUserMeta", meta);
              this.setState(prevState=> {
                prevState.users[userid] = meta;
                this.setUserNameToId(meta.username, userid);
                this.getUserActivity(userid, (err, active)=> {
                  this.setState(prevState=> {
                    prevState.users[userid].active = active;
                    return prevState;
                  });
                });
                return prevState;
              });
            });
          });
        }
      }
    }

    this.createChannel = (meta, callback)=> {
      // return status
      NoTalk.call('createCh', meta, (err, meta)=> {
        this.log('createCh', meta);
        callback(err, meta);
      });
    }

    this.updateChannel = (meta, callback)=> {
      // return status
      NoTalk.call('updateCh', meta, (err, meta)=> {
        this.log('updateCh', meta);
        callback(err, meta);
      });
    }
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
          NoTalk.onEvent('MyMetaUpdated', (err, json)=> {
            let newmeta = json;
            for(let i in this.state.mymeta) {
              if(!newmeta[i]) {
                newmeta[i] = this.state.mymeta[i];
              }
            }
            this.log('MyMetaUpdated event', json);
            this.setState({mymeta: newmeta});
          });
          NoTalk.onEvent('Message', (err, json)=> {
            this.log('message event', json);
            this.setState(prevState=> {
              let beadded ={};
              // add to last index
              if(prevState.channels[json.i]['Messages']) {
                beadded[Object.keys(prevState.channels[json.i]['Messages']).sort((a,b)=>{return b - a;})[0]+1] = json.r;
                prevState.channels[json.i]['Messages'] = Object.assign({}, beadded, prevState.channels[json.i]['Messages']);
              }
              else {
                prevState.channels[json.i]['Messages'] ={1: json.r};
              }
              return prevState;
            });
          });

          NoTalk.onEvent('AddedContacts', (err, json)=> {
            this.log('AddedContacts event', json);
            this.setState(prevState=> {
              for(let i in json.r) {
                prevState.contacts[json.r[i].ToUserId] = json.r[i];
              }
              return prevState;
            });
          });

          NoTalk.onEvent('ChannelUpdated', (err, json)=> {
            this.log('ChannelUpdated event', json);
            this.setState(prevState=> {
              console.log(json);
              for(let key in json.r) {
                prevState.channels[json.i][key] = json.r[key];
              }
              return prevState;
            });
          });

          NoTalk.onEvent('AddedToChannel', (err, json)=> {
            this.log('AddedToChannel event', json);
            this.setState(prevState=> {
              console.log(json);
              prevState.channels[json.i] = json.r;
              return prevState;
            }, ()=> {
              NoTalk.call('bindChs', {i: [json.i]}, (err, json2)=> {
                json2['ChIds'] = Object.keys(json);
                this.log('bindCh', JSON.stringify(json2));
              });
            });
          });
          this.updateMyMeta = (newmeta)=> {
            as.call('updateMyMeta', newmeta, ()=>{
              this.log('updateMyMeta', 'OK');
            })
          }
          this.log('NoService', 'Connected to the Service.');

          NoTalk.call('getMyMeta', null, (err, json)=> {
            this.log('getMyMeta', JSON.stringify(json));
            if(json.i) {
              this.setState({mymeta: json});
            }
            else {
              this.updateMyMeta({a:0});
            }
            NoService.createActivitySocket('NoUser', (err, as2)=>{
              NoUser = as2;
              NoUser.call('returnUserMeta', null, (err, json2)=> {
                this.setState({mymeta: Object.assign({}, json, json2)});
                this.log('NoUser', JSON.stringify(json2));
              });
              NoTalk.call('getMyChs', null, (err, json)=> {
                this.setState((prevState)=> {
                  prevState.channels = json;
                  return prevState;
                });
                this.log('getMyChs', JSON.stringify(json));

                NoTalk.call('bindChs', {i: Object.keys(json)}, (err, json2)=> {
                  json2['ChIds'] = Object.keys(json);
                  this.log('bindCh', JSON.stringify(json2));
                });

                this.getMyContacts((err, contacts)=>{
                  this.setState(prevState=> {
                    for(let i in contacts) {
                      prevState.contacts[contacts[i].ToUserId] = contacts[i];
                    }
                    return prevState;
                  })
                  setInterval(()=> {
                    let contacts = this.state.contacts;
                    for(let i in contacts) {
                      this.getUserActivity(contacts[i].ToUserId, (err, active)=> {
                        this.setState(prevState=> {
                          if(prevState.users[contacts[i].ToUserId])
                            prevState.users[contacts[i].ToUserId].active = active;
                          return prevState;
                        });
                      });
                    }
                  }, REFRESH_ACTIVITY_INTERVAL);
                });

                for(let chid in json) {
                  NoTalk.call('getMsgs', {i: chid, r:30}, (err, json)=> {
                    this.log('getMsgs ('+chid+')', JSON.stringify(json));
                    this.setState(prevState=> {
                      prevState.channels[chid]['Messages'] = json.r;
                      return prevState;
                    });
                  });
                }
              });
            });
          });

          as.onData = (data) => {
            this.log('NSActivity onData', data);
            // this.setState({debuglogs: this.state.debuglogs.push(['NoService', data])}) ;
          }
          as.onClose = ()=> {
            this.log('NSActivity onClose', 'Activity closed.');
            this.setState({connectionfailed: true});
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
        <Route exact path={this.state.channelroot+':id([^/]+):more(/?)'} render={(props)=>{
          return(
            <ChannelPage
              contacts={this.state.contacts}
              mymeta={this.state.mymeta}
              channelid={key}
              channelmeta={this.state.channels[key]}
              show={this.state.channelnow==key}
              match={props.match} history={props.history}
              rootpath={this.state.channelroot}
              sendNewMessage={this.sendNewMessage.bind(this)}
              loadUserMeta={this.loadUserMeta.bind(this)}
              users={this.state.users}
              onSettingsClick={()=> {
                props.history.push(this.state.channelroot+props.match.params.id+'/settings');
              }}
            />
          )
        }}/>

      );
      elems.push(
        <Route exact path={this.state.channelroot+':id([^/]+)/settings:more(.*)'} render={(props)=>{
          if(this.state.channelnow==key) {
            return(
              <BackPage title="Channel Settings" history={props.history}>
                <ChannelSettingsPage
                  contacts={this.state.contacts}
                  mymeta={this.state.mymeta}
                  channelid={key}
                  channelmeta={this.state.channels[key]}
                  updateChannel={this.updateChannel}
                  addUsersToChannel={this.addUsersToChannel}
                  history={props.history}
                  users={this.state.users}
                  loadUserMeta={this.loadUserMeta}
                  returnUserNameToId={this.returnUserNameToId}
                />
              </BackPage>
            )
          }
          else {
            return null;
          }
        }}/>
      )
    }
    return elems;
  }
  sendNewMessage(chid, meta, callback) {
    // return status
    NoTalk.call('sendMsg', {i:chid, c:meta}, (err, json)=> {
      this.log('sendMsg ('+chid+')', json);
      callback(err);
    });
  }

  logout() {
    NoService.logout();
  }

  render() {
    // let HeaderPageReg = '/:page([^/]*)';
    // let ChannelPageReg = '/channels/:id([0-9]+)';
    let HeaderPageReg = ':page(.*)';
    return (
      <Router>
        <div className="App">
          <Route exact path={HeaderPageReg} render={(props)=>{
            this.history = props.history;
            return(
              <HeaderPage history={props.history} debug={this.state.debug}>
                <Route exact path=":path(/|/channels/)" render={(props)=>{
                  return (
                    <ChannelList
                    loadUserMeta={this.loadUserMeta}
                    users={this.state.users}
                    onSelect={this.onSelectCh}
                    channels={this.state.channels}
                    history={props.history}
                    selected={props.match.params.id}
                    rootpath={this.state.channelroot}
                    />
                  )
                }}/>
                <Route exact path={this.state.channelroot+':id([^/]+):more(.*)'} render={(props)=>{
                  return(
                    <SplitComp show={true}>
                      <SplitLeft>
                        <ChannelList
                        loadUserMeta={this.loadUserMeta}
                        users={this.state.users}
                        onSelect={this.onSelectCh}
                        channels={this.state.channels}
                        history={props.history}
                        selected={props.match.params.id}
                        rootpath={this.state.channelroot}/>
                      </SplitLeft>
                      <SplitRight>
                        <NewChannelPage
                        show={this.state.channelnow=='new'}
                        createChannel={this.createChannel.bind(this)}
                        history={props.history}
                        setDebug={this.setDebug}
                        returnUserNameToId={this.returnUserNameToId}
                        users={this.state.users}
                        loadUserMeta={this.loadUserMeta.bind(this)}
                        contacts={this.state.contacts}
                        addUsersToChannel= {this.addUsersToChannel}
                        />
                        {this.renderChannels(props)}
                      </SplitRight>
                    </SplitComp>
                  )
                }}/>
                <Route exact path='/contacts:path(/|/.*)' render={(props)=> {
                  return(
                    <div className="Page">
                      <Route exact path="/contacts/:path(.*)" render={(props)=>{
                        return(
                          <ContactsPage
                            key={props.match.params.path}
                            users={this.state.users}
                            contacts={this.state.contacts}
                            getUserMetaByUserId={this.getUserMetaByUserId}
                            loadUserMeta={this.loadUserMeta.bind(this)}
                            history={props.history}
                          />
                        )
                      }}/>
                      <Route exact path="/contacts/new" render={(props)=>{
                        return(
                          <BoxComp history={props.history}>
                            <BackPage title="New Contact" history={props.history}>
                              <NewContactsPage
                                searchUsers={this.searchUsers}
                                addContacts={this.addContacts}
                                setUserNameToId={this.setUserNameToId}
                                returnUserNameToId={this.returnUserNameToId}
                                history={props.history}
                              />
                            </BackPage>
                          </BoxComp>
                        )
                      }}/>
                    </div>
                  )
                }}/>
                <Route exact path='/users/:id(.*)' render={(props)=> {
                  if(!Object.keys(this.state.users).includes(props.match.params.id)) {
                    this.loadUserMeta(props.match.params.id);
                  }
                  return(
                    <div className="Page">
                      <ContactsPage
                        users={this.state.users}
                        contacts={this.state.contacts}
                        loadUserMeta={this.loadUserMeta.bind(this)}
                        history={props.history}
                      />
                      <BoxComp history={props.history}>
                        <BackPage title={this.state.users[props.match.params.id]?this.state.users[props.match.params.id].username:'User'} history={props.history}>
                          <UserAccountPage addContacts={this.addContacts} contacts={this.state.contacts} loadUserMeta={this.loadUserMeta.bind(this)} usermeta={this.state.users[props.match.params.id]}/>
                        </BackPage>
                      </BoxComp>
                    </div>
                  )
                }}/>
                <Route exact path='/settings:path(/|/.*)' component={SettingsPage}/>
                <Route exact path='/trending:path(/|/.*)' component={TrendingPage}/>
                <Route exact path='/account:path(/|/.*)' render={(props)=>{
                  return(
                    <MyAccountPage version={VERSION} history={props.history} logout={this.logout} mymeta={this.state.mymeta} updateMyMeta={this.updateMyMeta}/>
                  );
                }}/>
                <Route exact path='/debug' render={(props)=>{
                  return(
                    <DebugPage history={props.history} logs={this.state.debuglogs}/>
                  );
                }}/>
                <Route exact path='/noservice/signin' render={(props)=>{
                  return(
                    <SigninPage SignupURL={NOSERVICE_SIGNUPURL} NSc={NoService} onFinish={window.location.reload}/>
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
