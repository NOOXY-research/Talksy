// APP.js
// Description:
// "APP.js" is a NOOXY NoTalk Service client.
// Copyright 2019-2019 NOOXY. All Rights Reserved.

const CONSTANTS = require('../constants.json');

const VERSION = CONSTANTS.VERSION;
const REFRESH_ACTIVITY_INTERVAL= CONSTANTS.REFRESH_ACTIVITY_INTERVAL;
const RETRY_INTERVAL= CONSTANTS.RETRY_INTERVAL;
const READ_NEW_LINE = CONSTANTS.READ_NEW_LINE;

const NOSERVICE_SIGNUP_URL = CONSTANTS.NOSERVICE_SIGNUP_URL;

import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Ink from 'react-ink';

import Snackbar from '@material-ui/core/Snackbar';
import LinearProgress from '@material-ui/core/LinearProgress';

// Flux
import Flux from './flux';

import Theme from './Theme';
import { SigninPage, PasswordPage } from "./NScReact.js";
import DebugPage from './DebugPage';
import HeaderPage from './HeaderPage';
import FailedPage from './FailedPage';

import {Box, Split, BackPage, EditTextPage, EditListPage, AddToListPage, SplitLeft, SplitRight} from "../Components/BaseComponent";
import {ChannelPage, ChannelList, NewChannelPage, ChannelSettingsPage} from "../Components/Channel";
import {ContactsPage, NewContactsPage} from "../Components/Contact";
import {MyAccountPage, UserAccountPage} from "../Components/Account";
import TrendingPage from '../Components/TrendingPage';


import './App.css';
import './tooltip.css';


export class App extends Component {
  constructor (props) {
    let channelroot = "/channels/";
    super(props);
    this.state = {
      langs: require('./langs.json')['en'],
      debug: debug,
      mymeta: {},
      debuglogs: [['debug', 'debug']],
      channelnow: window.location.href.split(channelroot)[1]?window.location.href.split(channelroot)[1].split('/')[0]: null,
      channels: {
        'loading': {
          Displayname: "Loading...",
          Description: "Talksy is loading your messages."
        }
      },
      contacts: {},
      users:{},
      loading: true
    }

    this.controller = new Flux(this.setState);
    this.UserNameToId = {};
  }

  componentDidMount() {
    this.log('NoService', 'Setting up NOOXY service implementations.');
    this.controller.NoService.getImplementationModule((err, NSimplementation)=>{
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
      this.controller.start(()=> {

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
        <Route key={key} exact path={this.state.channelroot+':id([^/]+):more(/?)'} render={(props)=>{
          return(
            <ChannelPage
              actions={this.actions}
              contacts={this.state.contacts}
              mymeta={this.state.mymeta}
              channelid={key}
              channelmeta={this.state.channels[key]}
              show={this.state.channelnow==key}
              match={props.match}
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
                  actions={this.actions}
                  contacts={this.state.contacts}
                  mymeta={this.state.mymeta}
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
        <MuiThemeProvider Theme={Theme}>
          <Route exact path={HeaderPageReg} render={(props)=>{
            this.history = props.history;
            return(
              <HeaderPage {...props} langs={this.state.langs} debug={this.state.debug}>
              {this.state.loading?<LinearProgress color='primary'/>:null}
                <Route exact path=":path(/|/channels/)" render={(props)=>{
                  return (
                    <ChannelList
                    {...props}
                    actions={this.actions}
                    users={this.state.users}
                    channels={this.state.channels}
                    selected={props.match.params.id}
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
                        actions={this.actions}
                        users={this.state.users}
                        channels={this.state.channels}
                        selected={props.match.params.id}
                        langs={this.state.langs}
                        />
                      </SplitLeft>
                      <SplitRight>
                        <NewChannelPage
                        {...props}
                        actions={this.actions}
                        langs={this.state.langs}
                        show={this.state.channelnow=='new'}
                        users={this.state.users}
                        contacts={this.state.contacts}
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
                            actions={this.actions}
                            key={props.match.params.path}
                            users={this.state.users}
                            contacts={this.state.contacts}
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
                                actions={this.actions}
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
                        actions={this.actions}
                        users={this.state.users}
                        contacts={this.state.contacts}
                        langs={this.state.langs}
                      />
                      <Box history={props.history}>
                        <BackPage {...props} title={this.state.users[props.match.params.id]?this.state.users[props.match.params.id].username:'User'}>
                          <UserAccountPage
                          actions={this.actions}
                          langs={this.state.langs}
                          contacts={this.state.contacts}
                          usermeta={this.state.users[props.match.params.id]}/>
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
                    <MyAccountPage
                    {...props}
                    actions={this.actions}
                    langs={this.state.langs}
                    version={VERSION}
                    mymeta={this.state.mymeta}
                    />
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
        </MuiThemeProvider>
        </div>
      </Router>
    );
  }
}
