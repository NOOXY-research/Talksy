// /src/flux/dispatcher.js
// Description:
// "dispatcher.js"
// Copyright 2018-2019 NOOXY. All Rights Reserved.
import Dispatcher from './lib/dispatcher';

let sortOnKeys = (dict)=> {

    let sorted = [];
    for(let key in dict) {
        sorted[sorted.length] = key;
    }
    sorted.sort();

    let tempDict = {};
    for(let i = 0; i < sorted.length; i++) {
        tempDict[sorted[i]] = dict[sorted[i]];
    }
    return tempDict;
}

function generateDispatcher(setState) {
  let _dispatcher = new Dispatcher();
  let id1 = _dispatcher.register((payload)=> {
    setTimeout(()=> {
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
      else if (payload.type === 'updateDebug') {
        setState({ debug: payload.data }, payload.callback);
      }
      else if (payload.type === 'updateLang') {
        setState(prevstate=>{
          return({ lang: payload.data });
        }, payload.callback)
      }
      else if (payload.type === 'updateMyUserMeta') {
        setState(prevstate=>{
          for(let i in prevstate.my_user_meta) {
            if(typeof(payload.data[i]) === 'undefined') {
              payload.data[i] = prevstate.my_user_meta[i];
            }
          }
          return {my_user_meta: payload.data};
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
      else if (payload.type === 'updateChannel') {
        setState(prevState=> {
          if(!prevState.channels[payload.data.channel_id]) {
            prevState.channels[payload.data.channel_id] = {};
          }
          for(let key in payload.data.meta) {
            prevState.channels[payload.data.channel_id][key] = payload.data.meta[key];
          }
          return prevState;
        }, payload.callback);
      }
      else if (payload.type === 'deleteChannel') {
        setState(prevState=> {
          delete prevState.channels[payload.data];
          return prevState;
        }, payload.callback);
      }
      else if (payload.type === 'updateContacts') {
        setState({contacts:payload.data}, payload.callback);
      }
      else if (payload.type === 'updateChannelLatestReadline') {
        setState(prevState=>{
          prevState.channels[payload.data.channel_id]['LatestReadline'] = payload.data.line;
          return prevState;
        });
      }
      else if (payload.type === 'updateMessages') {
        setState(prevState=> {
          prevState.channels[payload.data.channel_id]['Messages'] = payload.data.messages;
          prevState.channels[payload.data.channel_id]['LatestReadline'] = payload.data.latest_read_line;
          return prevState;
        }, payload.callback);
      }
      else if (payload.type === 'updateUserMeta') {
        setState(prevState=> {
          if(!prevState.users[payload.data.user_id]) {
            prevState.users[payload.data.user_id] = {};
          }
          for(let i in payload.data.meta) {
            prevState.users[payload.data.user_id][i] = payload.data.meta[i];
          }
          return prevState;
        }, payload.callback);
      }
      else if (payload.type === 'updateUserActivity') {
        setState(prevState=> {
          if(!prevState.users[payload.data.user_id]) {
            prevState.users[payload.data.user_id] = {};
          }
          prevState.users[payload.data.user_id].active = payload.data.active;
          return prevState;
        }, payload.callback);
      }
      else if (payload.type === 'appendMessage') {
        setState(prevState=> {
          let beadded ={};
          // add to last index
          if(prevState.channels[payload.data.channel_id]['Messages']&&Object.keys(prevState.channels[payload.data.channel_id]['Messages']).length!==0) {
            beadded[parseInt(Object.keys(prevState.channels[payload.data.channel_id]['Messages']).sort((a,b)=>{return b - a;})[0])+1] = payload.data.message;
            prevState.channels[payload.data.channel_id]['Messages'] = Object.assign({}, beadded, prevState.channels[payload.data.channel_id]['Messages']);
          }
          else {
            prevState.channels[payload.data.channel_id]['Messages'] ={1: payload.data.message};
          }
          return prevState;
        }, payload.callback);
      }
      else if (payload.type === 'appendMessages') {
        setState(prevState=> {
          prevState.channels[payload.data.channel_id]['Messages'] = sortOnKeys(Object.assign(payload.data.messages, prevState.channels[payload.data.channel_id]['Messages']));
          return prevState;
        }, payload.callback);
      }
      else if (payload.type === 'appendLog') {
        setState(prevState=> {
          prevState.logs.push(payload.data);
          return prevState;
        }, payload.callback);
      }
      else {
        console.log('Unsupported type.');
        console.log(payload);
      }
    }, 1);
  });

  return {dispatch: (payload)=> {_dispatcher.dispatch(payload)}};
}

export default {generateDispatcher: generateDispatcher};
