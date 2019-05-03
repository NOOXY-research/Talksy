// /src/flux/service.js
// Description:
// "service.js"
// Copyright 2018-2019 NOOXY. All Rights Reserved.

import Constants from '../constants.json';

const READ_NEW_LINE = Constants.READ_NEW_LINE;
const RETRY_INTERVAL= Constants.RETRY_INTERVAL;
const Localizes = require('./data/localizes.json');

function Service(NoService, Dispatcher, getState) {
  let Services = {
    NoTalk: null,
    gotoandplay: null
  };

  let UserNameToId = {};
  let UserMeta = {};

  this.actions = {
    importLocalize: (data)=> {
      Dispatcher.dispatch({type: 'updateLocalizes', data: data});
    },
    updateLang: (lang)=> {
      Dispatcher.dispatch({type: 'updateLang', data: lang});
    },
    updateMyMeta: (newmeta)=> {
      Services.NoTalk.call('updateMyMeta', newmeta, ()=>{
        this.actions.log('updateMyMeta', 'OK');
      })
    },
    // selectCh: (chid)=> {
    //   Dispatcher.dispatch({type: 'update-channelnow', data: chid});
    // },
    log: (title, contain)=> {
      if(typeof(contain)!== 'string') {
        contain = JSON.stringify(contain);
      }
      Dispatcher.dispatch({type: 'appendLog', data: [title, contain]});
    },

    setDebug: (bool)=> {
      console.log('DEBUG MODE ON');
      this.actions.log('DEBUG MODE ON');
      Dispatcher.dispatch({type: 'updateDebug', data: bool});
    },

    searchUsers: (username, callback)=> {
      if(Services.NoUser)
        Services.NoUser.call("searchUsersByUsername", {n:username}, (err, json)=> {
          this.actions.log("searchUsers", json);
          callback(err, json.r);
        });
    },

    addContacts: (contacts, type, callback)=> {
      if(Services.NoTalk)
        Services.NoTalk.call("addConts", {c:contacts, t:type}, (err, json)=> {
          this.actions.log("addConts", json);
          if(callback)
            callback(err, json);
        });
    },

    getMyContacts: (callback)=> {
      if(Services.NoTalk)
        Services.NoTalk.call("getMyConts", null, (err, json)=> {
          this.actions.log("getMyConts", json);
          Dispatcher.dispatch({type: 'updateContacts', data: json.r});
          if(callback)
            callback(err, json.r);
        });
    },

    refreshUserActivity: (user_id, callback)=> {
      if(Services.NoTalk)
        Services.NoTalk.call("getUserAct", {i: user_id}, (err, json)=> {
          this.actions.log("getUserAct("+user_id+")", json);
          Dispatcher.dispatch({type: 'updateUserActivity', data: {user_id: user_id, active: json.r}}, ()=> {
            if(callback)
              callback(err, json.r);
          });
        });
    },

    addUsersToChannel: (chid, users, callback)=> {
      if(Services.NoTalk)
        Services.NoTalk.call("addUsersToCh", {c:chid,i:users}, (err, json)=> {
          this.actions.log("addUsersToChannel", json);
          callback(err, json);
        });
    },

    readChannelLine: (chid, line, callback)=> {
      if(Services.NoTalk)
        Services.NoTalk.call("readChLine", {i:chid,l:line}, (err, json)=> {
          this.actions.log("readChannelLine", json);
          Dispatcher.dispatch({type: 'updateChannelLatestReadline', data: {
            channel_id: chid,
            line: line
          }});

          callback(err, json);
        });
    },

    loadMoreMessages: (chid, first_index, callback)=> {
      if(first_index!==1) {
        let begin=(first_index-READ_NEW_LINE)>=0?(first_index-READ_NEW_LINE):0;
        let rows = READ_NEW_LINE;
        if(first_index!==1)
          Services.NoTalk.call('getMsgs', {i: chid, b:begin, r:rows}, (err, json)=> {
            this.actions.log('getMsgs ('+chid+')', JSON.stringify(json));
            json.channel_id = chid;
            json.messages = json.r;
            Dispatcher.dispatch({type: 'appendMessages', data: json});
          });
      }
    },

    deleteChannel: (chid, callback)=> {
      // return status
      if(Services.NoTalk)
        Services.NoTalk.call('delCh', {i:chid}, (err, meta)=> {
          this.actions.log('delete Channel', meta);
          if(callback)
            callback(err, meta);
      });
    },

    setUserNameToId: (name, id)=> {
      UserNameToId[name] = id;
    },

    returnUserNameToId: (name)=> {
      return UserNameToId[name];
    },

    getUserMeta: (user_id, callback)=> {
      if(Services.NoTalk&&user_id) {
        if(user_id!==null) {
          if(UserMeta[user_id]) {
            if(callback)
              callback(false, UserMeta[user_id]);
          }
          else {
            UserMeta[user_id] = {};
            Dispatcher.dispatch({type: 'updateUserMeta', data: {user_id: user_id, meta:{}}, callback: ()=> {
              Services.NoTalk.call("getUserMeta", {i:user_id}, (err, meta)=> {
                this.actions.log("getUserMeta", meta);
                UserMeta[user_id] = meta;
                Dispatcher.dispatch({type: 'updateUserMeta', data: {user_id: user_id, meta:meta}, callback: ()=> {
                  this.actions.setUserNameToId(meta.username, user_id);
                  this.actions.refreshUserActivity(user_id, ()=> {
                    if(callback)
                      callback(false, meta);
                  });
                }});
              });
            }});
          }
        }
      }
    },

    logout: ()=> {
      NoService.logout();
    },

    sendNewMessage: (chid, meta, callback)=> {
      // return status
      Services.NoTalk.call('sendMsg', {i:chid, c:meta}, (err, json)=> {
        this.actions.log('sendMsg ('+chid+')', json);
        callback(err);
      });
    },

    createChannel: (meta, callback)=> {
      // return status
      if(Services.NoTalk)
        Services.NoTalk.call('createCh', meta, (err, meta)=> {
          this.actions.log('createCh', meta);
          callback(err, meta);
        });
    },

    updateChannel: (meta, callback)=> {
      // return status
      if(Services.NoTalk)
        Services.NoTalk.call('updateCh', meta, (err, meta)=> {
          this.actions.log('updateCh', meta);
          callback(err, meta);
      });
    }
  };

  this.setupDispatchers = ()=> {
    if(Services.NoTalk) {
      Services.NoTalk.onEvent('MyMetaUpdated', (err, json)=> {
        console.log(json);
        Dispatcher.dispatch({type: 'updateMyUserMeta', data: json});
        this.actions.log('MyMetaUpdated event', json);
      });
      Services.NoTalk.onEvent('Message', (err, json)=> {
        this.actions.log('message event', json);
        json.channel_id = json.i;
        json.message = json.r;
        Dispatcher.dispatch({type: 'appendMessage', data: json});
      });

      Services.NoTalk.onEvent('AddedContacts', (err, json)=> {
        this.actions.log('AddedContacts event', json);
        Dispatcher.dispatch({type: 'updateContacts', data: json.r});
      });

      Services.NoTalk.onEvent('ChannelUpdated', (err, json)=> {
        this.actions.log('ChannelUpdated event', json);
        json.channel_id = json.i;
        json.meta = json.r;
        Dispatcher.dispatch({type: 'updateChannel', data: json});
      });

      Services.NoTalk.onEvent('ChannelDeleted', (err, json)=> {
        this.actions.log('ChannelDeleted event', json);
        Dispatcher.dispatch({type: 'deleteChannel', data: json.i});
      });

      Services.NoTalk.onEvent('AddedToChannel', (err, json)=> {
        this.actions.log('AddedToChannel event', json);
        json.channel_id = json.i;
        json.meta = json.r;
        Dispatcher.dispatch({type: 'updateChannel', data: json, callback: ()=> {
          Services.NoTalk.call('bindChs', {i: [json.i]}, (err, json2)=> {
            json2['ChIds'] = Object.keys(json);
            this.actions.log('bindCh', JSON.stringify(json2));
          });
        }});
      });
    }
    if(Services.NoUser) {
      // Services.NoUser.onEvent();
    }
  };

  this.start = (next)=> {
    this.actions.log('NoService', 'Starting up.');
    this.actions.importLocalize(Localizes);
    Dispatcher.dispatch({type: 'updateLoading', data: true});
    NoService.createActivitySocket('NoTalk', (err1, as1)=>{
      NoService.createActivitySocket('NoUser', (err2, as2)=>{
        if(err1||err2) {
          this.actions.log('NoService', 'Connection Failed.');
          Dispatcher.dispatch({type: 'updateConnectionFail', data: true});
          Services.NoTalk = Services.NoUser = null;
          setTimeout(this.start, RETRY_INTERVAL);
        }
        else {
          Services.NoTalk = as1;
          Services.NoUser = as2;
          Services.NoTalk.on('close', ()=> {
            this.actions.log('NSActivity onClose', 'Activity closed.');
            Dispatcher.dispatch({type: 'updateConnectionFail', data: true});
            Services.NoTalk = Services.NoUser = null;
            setTimeout(this.start, RETRY_INTERVAL);
          });
          Services.NoUser.on('close', ()=> {
            this.actions.log('NSActivity onClose', 'Activity closed.');
            Dispatcher.dispatch({type: 'updateConnectionFail', data: true});
            Services.NoTalk = Services.NoUser = null;
            setTimeout(this.start, RETRY_INTERVAL);
          });

          this.actions.log('NoService', 'Connected to the Service.');

          Services.NoTalk.call('getMyMeta', null, (err, json)=> {
            this.actions.log('getMyMeta', JSON.stringify(json));
            if(json.i) {
              Dispatcher.dispatch({type: 'updateMyUserMeta', data: json})
            }
            else {
              this.actions.updateMyMeta({a:0});
            }

            //
            Dispatcher.dispatch({type: 'updateConnectionFail', data: false});
            //
            Services.NoUser.call('returnUserMeta', null, (err, json2)=> {
              Dispatcher.dispatch({type: 'updateMyUserMeta', data: Object.assign({}, json, json2)});
              this.actions.log('NoUser', JSON.stringify(json2));
              if(json2.country&&json2.country.toLowerCase() === "taiwan") {
                this.actions.updateLang('zh-tw');
              }
            });
            Services.NoTalk.call('getMyChs', null, (err, json)=> {
              Dispatcher.dispatch({type: 'updateChannels', data: json});
              this.actions.log('getMyChs', JSON.stringify(json));

              Services.NoTalk.call('bindChs', {i: Object.keys(json)}, (err, json2)=> {
                json2['ChIds'] = Object.keys(json);
                this.actions.log('bindCh', JSON.stringify(json2));
              });

              for(let chid in json) {
                Services.NoTalk.call('getMsgs', {i: chid, r:30}, (err, json)=> {
                  this.actions.log('getMsgs ('+chid+')', JSON.stringify(json));
                  json.channel_id = chid;
                  json.latest_read_line = json.l;
                  json.messages = json.r;
                  Dispatcher.dispatch({type: 'updateMessages', data: json});
                });
              }
              this.actions.getMyContacts((err, contacts)=> {
                // let users = Object.keys(contacts);
                // let i = 0;
                // let next_step = ()=> {
                //   this.actions.getUserMeta(contacts[users[i]].ToUserId, ()=> {
                //     console.log(1);
                //     if(i<users.length-1) {
                //       i++
                //       next_step();
                //     }
                //     else {
                //       this.setupDispatchers();
                //       Dispatcher.dispatch({type: 'updateLoading', data: false});
                //       next();
                //     }
                //   });
                // };
                // next_step();
                this.setupDispatchers();
                Dispatcher.dispatch({type: 'updateLoading', data: false});
                next();
              });
            });
          });
        }
      });
    });

  };
}

export default Service;
