// /src/flux/dispatcher.js
// Description:
// "dispatcher.js"
// Copyright 2018-2019 NOOXY. All Rights Reserved.
import Dispatcher from './lib/dispatcher';

function generateDispatcher(setState) {
  let _dispatcher = new Dispatcher();
  let id1 = _dispatcher.register((payload)=> {
    if(payload.type === 'updateContacts') {
      let contacts = payload.data;
      setState(prevState=> {
        for(let i in contacts) {
          prevState.contacts[contacts[i].ToUserId] = contacts[i];
        }
        return prevState;
      }, payload.callback)
    }
    else if(payload.type === 'updateLoading') {
      setState({loading: payload.data}, payload.callback);
    }
    else if (payload.type === 'updateLocalizes') {
      setState({ localizes: payload.data }, payload.callback);
    }
    else if (payload.type === 'updateLang') {
      setState(prevstate=>{
        return({ lang: payload.data });
      }, payload.callback)
    }
    else if (payload.type === 'updateMyUserMeta') {
      setState(prevstate=>{
        return({ my_user_meta: payload.data });
      }, payload.callback)
    }
    else if (payload.type === 'updateMyUserMeta') {
      setState(prevstate=>{
        return({ my_user_meta: payload.data });
      }, payload.callback)
    }
    else if (payload.type === 'updateConnectionFail') {
      setState(prevstate=>{
        return({ connection_failed: payload.data });
      }, payload.callback)
    }
    else if (payload.type === 'updateChannels') {
      setState({channels:payload.data}, payload.callback);
    }
    else if (payload.type === 'updateContacts') {
      setState({contacts:payload.data}, payload.callback);
    }
    else if (payload.type === 'updateChannelLatestReadline') {
      this.setState(prevState=>{
        prevState.channels[payload.data.channel_id]['LatestReadline'] = payload.data.line;
        return prevState;
      });
    }
    else if (payload.type === 'updateMesseges') {
      setState(prevState=> {
        prevState.channels[payload.data.channel_id]['Messages'] = payload.data.messages;
        prevState.channels[payload.data.channel_id]['LatestReadline'] = payload.data.latest_read_line;
        return prevState;
      }, payload.callback);
    }
    else if (payload.type === 'updateUserMeta') {
      setState(prevState=> {
        prevState.users[payload.data.user_id] = payload.data.meta;
        return prevState;
      }, payload.callback);
    }
    else if (payload.type === 'updateUserActivity') {
      setState(prevState=> {
        prevState.users[payload.data.user_id].active = payload.data.active;
        return prevState;
      });
    }
  });

  return {dispatch: (payload)=> {_dispatcher.dispatch(payload)}};
}

export default {generateDispatcher: generateDispatcher};
