// APP.js
// Description:
// "APP.js" is a NOOXY NoTalk Service client.
// Copyright 2019-2019 NOOXY. All Rights Reserved.

import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { SigninPage, PasswordPage } from "./NScReact.js";
import {Box, Split, BackPage, EditTextPage, EditListPage, AddToListPage, SplitLeft, SplitRight} from "../BaseComponent";
import {ChannelPage, ChannelList, NewChannelPage, ChannelSettingsPage} from "../Channel";
import {ContactsPage, NewContactsPage} from "../Contact";
import {MyAccountPage, UserAccountPage} from "../Account";
import DebugPage from './DebugPage';
import HeaderPage from './HeaderPage';
import FailedPage from './FailedPage';
import TrendingPage from '../TrendingPage';
import Ink from 'react-ink';
import NSClient from '../flux/NSc.js';
import './App.css';
import './tooltip.css';

const CONSTANTS = require('../constants.json');

const VERSION = CONSTANTS.VERSION;
const REFRESH_ACTIVITY_INTERVAL= CONSTANTS.REFRESH_ACTIVITY_INTERVAL;
const RETRY_INTERVAL= CONSTANTS.RETRY_INTERVAL;
const READ_NEW_LINE = CONSTANTS.READ_NEW_LINE;

const NOSERVICE_SIGNUP_URL = CONSTANTS.NOSERVICE_SIGNUP_URL;

const nshost = CONSTANTS.NOSERVICE_HOST;
const debug = CONSTANTS.DEBUG;
const nsport = null;

const NoService = new NSClient(nshost);
NoService.setDebug(debug);

let NoTalk;
let NoUser;

NoService.setDebug(debug);

export class Main extends Component {
  constructor (props) {
    let channelroot = "/channels/";
    super(props);
    this.state = {
      langs: require('./langs.json')['en'],
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
      users:{}
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
      if(NoUser)
        NoUser.call("searchUsersByUsername", {n:username}, (err, json)=> {
          this.log("searchUsers", json);
          callback(err, json.r);
        });
    }

    this.addContacts =(contacts, type, callback)=> {
      if(NoTalk)
        NoTalk.call("addConts", {c:contacts, t:type}, (err, json)=> {
          this.log("addConts", json);
          if(callback)
            callback(err, json);
        });
    }

    this.getMyContacts = (callback)=> {
      if(NoTalk)
        NoTalk.call("getMyConts", null, (err, json)=> {
          this.log("getMyConts", json);
          callback(err, json.r);
        });
    }

    this.getUserActivity = (userid, callback)=> {
      if(NoTalk)
        NoTalk.call("getUserAct", {i: userid}, (err, json)=> {
          this.log("getUserAct("+userid+")", json);
          callback(err, json.r);
        });
    }

    this.addUsersToChannel = (chid, users, callback)=> {
      if(NoTalk)
        NoTalk.call("addUsersToCh", {c:chid,i:users}, (err, json)=> {
          this.log("addUsersToChannel", json);
          callback(err, json);
        });
    }

    this.readChannelLine = (chid, line, callback)=> {
      if(NoTalk)
        NoTalk.call("readChLine", {i:chid,l:line}, (err, json)=> {
          this.log("readChannelLine", json);
          this.setState(prevState=>{
            prevState.channels[chid]['LatestReadline'] = line;
            return prevState;
          });
          callback(err, json);
        });
    }

    this.getMoreMessages = (chid, callback)=> {
      let _fl = Object.keys(this.state.channels[chid]['Messages']).sort((a,b)=>{return a - b;})[0];

      if(_fl!=1) {
        let begin=(_fl-READ_NEW_LINE)>=0?(_fl-READ_NEW_LINE):0;
        let rows =READ_NEW_LINE;
        NoTalk.call('getMsgs', {i: chid, b:begin, r:rows}, (err, json)=> {
          this.log('getMsgs ('+chid+')', JSON.stringify(json));
          this.setState(prevState=> {
            prevState.channels[chid]['Messages'] = Object.assign({}, json.r, prevState.channels[chid]['Messages']);
            callback(false);
            return prevState;
          });
        });
      }
    }

    this.deleteChannel = (chid, callback)=> {
      // return status
      if(NoTalk)
        NoTalk.call('delCh', {i:chid}, (err, meta)=> {
          this.log('delete Channel', meta);
          if(callback)
            callback(err, meta);
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
      if(NoTalk)
        NoTalk.call('createCh', meta, (err, meta)=> {
          this.log('createCh', meta);
          callback(err, meta);
        });
    }

    this.updateChannel = (meta, callback)=> {
      // return status
      if(NoTalk)
        NoTalk.call('updateCh', meta, (err, meta)=> {
          this.log('updateCh', meta);
          callback(err, meta);
      });
    }
  }

  componentDidMount() {
    this.log('NoService', 'Setting up NOOXY service implementations.');
    NoService.getImplementationModule((err, NSimplementation)=>{
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

      let _startup = ()=> {
        this.log('NoService', 'Starting up.');
        NoService.createActivitySocket('NoTalk', (err, as)=>{
          NoTalk = as;
          if(err) {
            this.log('NoService', 'Connection Failed.');
            this.setState({connectionfailed: true});
            NoTalk = NoUser = null;
            setTimeout(_startup, RETRY_INTERVAL);
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
                if(prevState.channels[json.i]['Messages']&&Object.keys(prevState.channels[json.i]['Messages']).length!=0) {
                  beadded[parseInt(Object.keys(prevState.channels[json.i]['Messages']).sort((a,b)=>{return b - a;})[0])+1] = json.r;
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
                for(let key in json.r) {
                  prevState.channels[json.i][key] = json.r[key];
                }
                return prevState;
              });
            });

            NoTalk.onEvent('ChannelDeleted', (err, json)=> {
              this.log('ChannelDeleted event', json);
              this.setState(prevState=> {
                delete prevState.channels[json.i];
                return prevState;
              });
            });

            NoTalk.onEvent('AddedToChannel', (err, json)=> {
              this.log('AddedToChannel event', json);
              this.setState(prevState=> {
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
                //
                this.setState({connectionfailed: false});
                //
                NoUser.call('returnUserMeta', null, (err, json2)=> {
                  this.setState({mymeta: Object.assign({}, json, json2)});
                  this.log('NoUser', JSON.stringify(json2));
                  if(json2.country&&json2.country.toLowerCase()=="taiwan") {
                    this.setState({langs: require('./langs.json')['zh-tw']});
                  }
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
                        prevState.channels[chid]['LatestReadline'] = json.l;
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
              NoTalk = NoUser = null;
              setTimeout(_startup, RETRY_INTERVAL);
            }
          }
        });
      }
      _startup();
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
        <Route key={key} exact path={this.state.channelroot+':id([^/]+):more(/?)'} render={(props)=>{
          return(
            <ChannelPage
              readChannelLine = {this.readChannelLine}
              contacts={this.state.contacts}
              mymeta={this.state.mymeta}
              channelid={key}
              channelmeta={this.state.channels[key]}
              show={this.state.channelnow==key}
              match={props.match} history={props.history}
              rootpath={this.state.channelroot}
              sendNewMessage={this.sendNewMessage.bind(this)}
              loadUserMeta={this.loadUserMeta.bind(this)}
              getMoreMessages = {this.getMoreMessages.bind(this)}
              users={this.state.users}
              onSettingsClick={()=> {
                props.history.push(this.state.channelroot+props.match.params.id+'/settings');
              }}
            />
          )
        }}/>

      );
      elems.push(
        <Route key={key+'more'} exact path={this.state.channelroot+':id([^/]+)/settings:more(.*)'} render={(props)=>{
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
                  deleteChannel={this.deleteChannel}
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
      <Router basename='/'>
        <div className="App">
          <Route exact path={HeaderPageReg} render={(props)=>{
            this.history = props.history;
            return(
              <HeaderPage langs={this.state.langs} history={props.history} debug={this.state.debug}>
                <Route exact path=":path(/|/channels/)" render={(props)=>{
                  return (
                    <ChannelList
                    {...props}
                    loadUserMeta={this.loadUserMeta}
                    users={this.state.users}
                    onSelect={this.onSelectCh}
                    channels={this.state.channels}
                    selected={props.match.params.id}
                    rootpath={this.state.channelroot}
                    langs={this.state.langs}
                    />
                  )
                }}/>
                <Route exact path={this.state.channelroot+':id([^/]+):more(.*)'} render={(props)=>{
                  return(
                    <Split show={true}>
                      <SplitLeft>
                        <ChannelList
                        {...props}
                        loadUserMeta={this.loadUserMeta}
                        users={this.state.users}
                        onSelect={this.onSelectCh}
                        channels={this.state.channels}
                        selected={props.match.params.id}
                        rootpath={this.state.channelroot}
                        langs={this.state.langs}
                        />
                      </SplitLeft>
                      <SplitRight>
                        <NewChannelPage
                        {...props}
                        langs={this.state.langs}
                        show={this.state.channelnow=='new'}
                        createChannel={this.createChannel.bind(this)}
                        setDebug={this.setDebug}
                        returnUserNameToId={this.returnUserNameToId}
                        users={this.state.users}
                        loadUserMeta={this.loadUserMeta.bind(this)}
                        contacts={this.state.contacts}
                        addUsersToChannel= {this.addUsersToChannel}
                        />
                        {this.renderChannels(props)}
                      </SplitRight>
                    </Split>
                  )
                }}/>
                <Route exact path='/contacts:path(/|/.*)' render={(props)=> {
                  return(
                    <div className="Page">
                      <Route exact path="/contacts/:path(.*)" render={(props)=>{
                        return(
                          <ContactsPage
                            {...props}
                            key={props.match.params.path}
                            users={this.state.users}
                            contacts={this.state.contacts}
                            getUserMetaByUserId={this.getUserMetaByUserId}
                            loadUserMeta={this.loadUserMeta.bind(this)}
                            langs={this.state.langs}
                          />
                        )
                      }}/>
                      <Route exact path="/contacts/new" render={(props)=>{
                        return(
                          <Box {...props}>
                            <BackPage title={this.state.langs.new_contacts} {...props}>
                              <NewContactsPage
                                {...props}
                                searchUsers={this.searchUsers}
                                addContacts={this.addContacts}
                                setUserNameToId={this.setUserNameToId}
                                returnUserNameToId={this.returnUserNameToId}
                              />
                            </BackPage>
                          </Box>
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
                        {...props}
                        users={this.state.users}
                        contacts={this.state.contacts}
                        loadUserMeta={this.loadUserMeta.bind(this)}
                        langs={this.state.langs}
                      />
                      <Box history={props.history}>
                        <BackPage {...props} title={this.state.users[props.match.params.id]?this.state.users[props.match.params.id].username:'User'}>
                          <UserAccountPage langs={this.state.langs} addContacts={this.addContacts} contacts={this.state.contacts} loadUserMeta={this.loadUserMeta.bind(this)} usermeta={this.state.users[props.match.params.id]}/>
                        </BackPage>
                      </Box>
                    </div>
                  )
                }}/>
                <Route exact path='/trending:path(/|/.*)'  component={(props)=> {
                  return(
                    <TrendingPage langs={this.state.langs}/>
                  )
                }}/>
                <Route exact path='/account:path(/|/.*)' render={(props)=>{
                  return(
                    <MyAccountPage {...props} langs={this.state.langs} version={VERSION} logout={this.logout} mymeta={this.state.mymeta} updateMyMeta={this.updateMyMeta}/>
                  );
                }}/>
                <Route exact path='/debug' render={(props)=>{
                  return(
                    <DebugPage {...props} logs={this.state.debuglogs}/>
                  );
                }}/>
                <Route exact path='/noservice/signin' render={(props)=>{
                  return(
                    <SigninPage SignupURL={NOSERVICE_SIGNUP_URL} NSc={NoService} onFinish={window.location.reload}/>
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
