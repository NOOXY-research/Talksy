// APP.js
// Description:
// "APP.js" is a NOOXY NoTalk Service client.
// Copyright 2019-2019 NOOXY. All Rights Reserved.

import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, Redirect, Switch } from "react-router-dom";
import Ink from 'react-ink';

import Constants from '../constants.json';

import Snackbar from '@material-ui/core/Snackbar';
import LinearProgress from '@material-ui/core/LinearProgress';

// Flux
import Flux from '../flux';

import Theme from './Theme';
import FailedPage from './FailedPage';

import {Box, Split, BackPage, EditTextPage, EditListPage, AddToListPage, SplitLeft, SplitRight} from "../Components/BaseComponent";
import {ChannelPage, ChannelList, NewChannelPage, ChannelSettingsPage} from "../Components/Channel";
import {ContactsPage, NewContactsPage} from "../Components/Contact";
import {MyAccountPage, UserAccountPage} from "../Components/Account";
import {DebugPage} from '../Components/Debug';
import {HeaderPage} from '../Components/Header';
import {TrendingPage} from '../Components/Trending';
import {SigninPage, PasswordPage} from '../Components/NoService';

import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';


import './App.css';

const CONSTANTS = require('../constants.json');

const VERSION = CONSTANTS.VERSION;
const REFRESH_ACTIVITY_INTERVAL= CONSTANTS.REFRESH_ACTIVITY_INTERVAL;
const NOSERVICE_SIGNUP_URL = CONSTANTS.NOSERVICE_SIGNUP_URL;
const NOSERVICE_HOST = CONSTANTS.NOSERVICE_HOST;

export class App extends Component {
  constructor (props) {
    super(props);
    this.state = {
      localizes: {
        'en': {}
      },
      lang: 'en',
      debug: CONSTANTS.DEBUG,
      my_user_meta: {},
      debuglogs: [['debug', 'debug']],
      channels: {
        'loading': {
          Displayname: "Loading...",
          Description: "Talksy is loading your messages."
        }
      },
      logs: [],
      contacts: {},
      users:{},
      loading: true
    }

    this.controller = new Flux(this.setState.bind(this), this.getState.bind(this));
    this.actions = this.controller.actions;
    this.UserNameToId = {};

    this.actions.log('NoService', 'Setting up NOOXY service implementations.');
    this.controller.NoService.getImplementationModule((err, NSimplementation)=>{
      this.actions.log('NoService', 'Connecting to NOOXY service.');
      NSimplementation.setImplement('signin', (connprofile, data, data_sender)=>{
        this.actions.log('NoService Auth', 'NOOXY service signin emitted.');
        this.history.push('/noservice/signin');
      });
      NSimplementation.setImplement('AuthbyPassword', (connprofile, data, data_sender) => {
        this.actions.log('NoService Auth', 'NOOXY service Authby Password emitted.');
        this.history.push('/noservice/password?authtoken='+data.d.t);
      });
    });
  }

  getState(callback) {
    this.setState((prevState) => {
      callback(prevState);
    });
  }

  componentDidMount() {
    this.actions.log('NoService', 'Have set up NOOXY service implementations.');
    this.controller.start(()=> {
      setInterval(()=> {
        let user_ids = Object.keys(this.state.users);
        for(let i in user_ids) {
          this.actions.refreshUserActivity(user_ids[i]);
        }
      }, Constants.REFRESH_ACTIVITY_INTERVAL);
    });
  }

  renderConnectionFailed() {
    if(this.state.connection_failed) {
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
        <Route key={key} exact path={':channel_root(/channels/):channel_id([^/]+)/'} render={(props)=> {
          return <ChannelPage
            {...props}
            actions={this.actions}
            contacts={this.state.contacts}
            my_user_meta={this.state.my_user_meta}
            channelid={key}
            channelmeta={this.state.channels[key]}
            show={props.match.params.channel_id === key}
            users={this.state.users}
            onSettingsClick={()=> {
              props.history.push(props.match.params.channel_root+props.match.params.id+'/settings');
            }}
          />
        }}/>
      );
      elems.push(
        <Route key={key+'more'} exact path={':channel_root(/channels/):channel_id([^/]+)/settings:more(.*)'} render={(props)=>{
          if(props.match.params.channel_id === key) {
            return(
              <BackPage title="Channel Settings" history={props.history}>
                <ChannelSettingsPage
                  {...props}
                  actions={this.actions}
                  contacts={this.state.contacts}
                  my_user_meta={this.state.my_user_meta}
                  channelid={key}
                  channelmeta={this.state.channels[key]}
                  users={this.state.users}
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


  render() {

    // let HeaderPageReg = '/:page([^/]*)';
    // let ChannelPageReg = '/channels/:id([0-9]+)';
    let HeaderPageReg = ':page(.*)';
    return (
      <Router basename='/'>
        <div className="App">
        <MuiThemeProvider theme={Theme}>
          <Route exact path={HeaderPageReg} render={(props)=>{
            this.history = props.history;
            return(
              <HeaderPage {...props} localize={this.state.localizes[this.state.lang]} debug={this.state.debug}>
              {this.state.loading?<LinearProgress color='primary'/>:null}
              <Switch>
                <Route exact path="/" render={() => {
                  return(<Redirect to="/channels/"/>)
                }}/>
                <Route exact path=":channel_root(/channels/)" render={(props)=>{
                  return (
                    <ChannelList
                    {...props}
                    actions={this.actions}
                    users={this.state.users}
                    channels={this.state.channels}
                    selected={props.match.params.id}
                    localize={this.state.localizes[this.state.lang]}
                    />
                  )
                }}/>
                <Route exact path=':channel_root(/channels/):channel_id([^/]+):more(.*)' render={(props)=>{
                  return(
                    <Split show={true}>
                      <SplitLeft>
                        <ChannelList
                        {...props}
                        actions={this.actions}
                        users={this.state.users}
                        channels={this.state.channels}
                        selected={props.match.params.channel_id}
                        localize={this.state.localizes[this.state.lang]}
                        />
                      </SplitLeft>
                      <SplitRight>
                        <NewChannelPage
                        {...props}
                        actions={this.actions}
                        localize={this.state.localizes[this.state.lang]}
                        show={props.match.params.channel_id === 'new'}
                        users={this.state.users}
                        contacts={this.state.contacts}
                        />
                        {this.renderChannels(props)}
                      </SplitRight>
                    </Split>
                  )
                }}/>
                <Route exact path='/:contacts_users(contacts|users)/:more(.*)' render={(props)=> {
                  return(
                    <div className="Page">
                      <ContactsPage
                        {...props}
                        actions={this.actions}
                        key={props.match.params.path}
                        users={this.state.users}
                        contacts={this.state.contacts}
                        localize={this.state.localizes[this.state.lang]}
                      />
                      <Route exact path="/contacts/new" render={(props)=>{
                        return(
                          <Box {...props}>
                            <BackPage title={this.state.localizes[this.state.lang].new_contacts} {...props}>
                              <NewContactsPage
                                {...props}
                                actions={this.actions}
                              />
                            </BackPage>
                          </Box>
                        )
                      }}/>
                      <Route exact path='/users/:user_id(.*)' render={(props)=> {
                        if(!Object.keys(this.state.users).includes(props.match.params.user_id)) {
                          this.actions.getUserMeta(props.match.params.user_id);
                        }
                        return(
                          <Box {...props}>
                            <BackPage {...props} title={this.state.users[props.match.params.user_id]?this.state.users[props.match.params.user_id].username:'User'}>
                              <UserAccountPage
                              actions={this.actions}
                              localize={this.state.localizes[this.state.lang]}
                              contacts={this.state.contacts}
                              usermeta={this.state.users[props.match.params.user_id]}/>
                            </BackPage>
                          </Box>
                        )
                      }}/>
                    </div>
                  )
                }}/>
                <Route exact path='/trending:path(/|/.*)'  component={(props)=> {
                  return(
                    <TrendingPage localize={this.state.localizes[this.state.lang]}/>
                  )
                }}/>
                <Route exact path='/account:path(/|/.*)' render={(props)=>{
                  return(
                    <MyAccountPage
                    {...props}
                    actions={this.actions}
                    localize={this.state.localizes[this.state.lang]}
                    version={VERSION}
                    my_user_meta={this.state.my_user_meta}
                    />
                  );
                }}/>
                <Route exact path='/debug' render={(props)=>{
                  return(
                    <DebugPage {...props} logs={this.state.logs} noservice_host = {NOSERVICE_HOST} debug={this.state.debug}/>
                  );
                }}/>
                <Route exact path='/noservice/signin' render={(props)=>{
                  return(
                    <SigninPage SignupURL={NOSERVICE_SIGNUP_URL} NSc={this.controller.NoService} onFinish={window.location.reload}/>
                  );
                }}/>
                <Route exact path='/noservice/password' render={(props)=>{
                  return(
                    <PasswordPage NSc={this.controller.NoService} onFinish={props.history.goBack}/>
                  );
                }}/>
                <Route path=':badurl(.*)' render={(props)=>{
                  return([
                    <h3>{'The requested URL "'+props.match.params.badurl+'" does not exist.'}</h3>,
                    <p>Please check your link is a valid link.</p>
                  ]);
                }}/>
              </Switch>
                {this.renderConnectionFailed()}

              </HeaderPage>
            );
          }}/>
        </MuiThemeProvider>
        </div>
      </Router>
    );
  }
}
