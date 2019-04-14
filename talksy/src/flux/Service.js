// /src/flux/service.js
// Description:
// "service.js"
// Copyright 2018-2019 NOOXY. All Rights Reserved.

function Service(NoService, Dispatcher) {
  let Services = {
    NoTalk: null,
    gotoandplay: null
  };

  this.Actions = {
    getMyContacts: (err, contacts)=>{
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
    },
    updateMyMeta: (newmeta)=> {
      as.call('updateMyMeta', newmeta, ()=>{
        this.log('updateMyMeta', 'OK');
      })
    },
    selectCh: (chid)=> {
      Dispatcher.dispatch({type: 'update-channelnow', data: chid});
    },

    log: (title, contain)=> {
      if(typeof(contain)!= 'string') {
        contain = JSON.stringify(contain);
      }
      Dispatcher.dispatch({type: 'append-log', data: [title, contain]});
    },

    setDebug: (bool)=> {
      console.log('DEBUG MODE ON');
      this.Actions.log('DEBUG MODE ON');
      Dispatcher.dispatch({type: 'update-debug', data: bool});
    },

    searchUsers: (username, callback)=> {
      if(Services.NoUser)
        Services.NoUser.call("searchUsersByUsername", {n:username}, (err, json)=> {
          this.Actions.log("searchUsers", json);
          callback(err, json.r);
        });
    },

    addContacts: (contacts, type, callback)=> {
      if(Services.NoTalk)
        Services.NoTalk.call("addConts", {c:contacts, t:type}, (err, json)=> {
          this.Actions.log("addConts", json);
          if(callback)
            callback(err, json);
        });
    },

    getMyContacts: (callback)=> {
      if(NoTalk)
        NoTalk.call("getMyConts", null, (err, json)=> {
          this.log("getMyConts", json);
          callback(err, json.r);
        });
    },

    getUserActivity: (userid, callback)=> {
      if(NoTalk)
        NoTalk.call("getUserAct", {i: userid}, (err, json)=> {
          this.log("getUserAct("+userid+")", json);
          callback(err, json.r);
        });
    },

    addUsersToChannel: (chid, users, callback)=> {
      if(NoTalk)
        NoTalk.call("addUsersToCh", {c:chid,i:users}, (err, json)=> {
          this.log("addUsersToChannel", json);
          callback(err, json);
        });
    },

    readChannelLine: (chid, line, callback)=> {
      if(NoTalk)
        NoTalk.call("readChLine", {i:chid,l:line}, (err, json)=> {
          this.log("readChannelLine", json);
          this.setState(prevState=>{
            prevState.channels[chid]['LatestReadline'] = line;
            return prevState;
          });
          callback(err, json);
        });
    },

    getMoreMessages: (chid, callback)=> {
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
    },

    deleteChannel: (chid, callback)=> {
      // return status
      if(NoTalk)
        NoTalk.call('delCh', {i:chid}, (err, meta)=> {
          this.log('delete Channel', meta);
          if(callback)
            callback(err, meta);
      });
    },

    setUserNameToId: (name, id)=> {
      this.UserNameToId[name] = id;
    },

    returnUserNameToId: (name)=> {
      return this.UserNameToId[name];
    },

    loadUserMeta: (userid)=> {
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
    },

    logout: ()=> {
      NoService.logout();
    },

    sendNewMessage: (chid, meta, callback)=> {
      // return status
      NoTalk.call('sendMsg', {i:chid, c:meta}, (err, json)=> {
        this.log('sendMsg ('+chid+')', json);
        callback(err);
      });
    },

    createChannel: (meta, callback)=> {
      // return status
      if(NoTalk)
        NoTalk.call('createCh', meta, (err, meta)=> {
          this.log('createCh', meta);
          callback(err, meta);
        });
    },

    updateChannel: (meta, callback)=> {
      // return status
      if(NoTalk)
        NoTalk.call('updateCh', meta, (err, meta)=> {
          this.log('updateCh', meta);
          callback(err, meta);
      });
    }
  },

  this.setupDispatchers = ()=> {
    if(Service.NoTalk) {
      Services.NoTalk.onEvent('whatever', ()=> {
        NoTalk.onEvent('MyMetaUpdated', (err, json)=> {
          console.log(json);
          for(let i in this.state.mymeta) {
            if(typeof(json[i]) === 'undefined') {
              json[i] = this.state.mymeta[i];
            }
          }
          this.log('MyMetaUpdated event', json);
          this.setState({mymeta: json});
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
      });
    }
    if(Service.NoUser) {
      Services.gotoandplay.onEvent();
    }
  };

  this.start = (next)=> {
    this.log('NoService', 'Starting up.');
    this.setState({loading: true});
    NoService.createActivitySocket('NoTalk', (err1, as1)=>{
      NoService.createActivitySocket('NoUser', (err2, as2)=>{
        if(err1||err2) {
          this.log('NoService', 'Connection Failed.');
          this.setState({connectionfailed: true});
          Services.NoTalk = Services.NoUser = null;
          setTimeout(this.start, RETRY_INTERVAL);
        }
        else {
          Services.NoTalk = as1;
          Services.NoUser = as2;

          Services.NoTalk.on('close', ()=> {
            this.log('NSActivity onClose', 'Activity closed.');
            this.setState({connectionfailed: true});
            NoTalk = NoUser = null;
            setTimeout(_startup, RETRY_INTERVAL);
          });
          Services.NoUser.on('close', ()=> {
            this.log('NSActivity onClose', 'Activity closed.');
            this.setState({connectionfailed: true});
            NoTalk = NoUser = null;
            setTimeout(_startup, RETRY_INTERVAL);
          });

          this.log('NoService', 'Connected to the Service.');

          Services.NoTalk.call('getMyMeta', null, (err, json)=> {
            this.log('getMyMeta', JSON.stringify(json));
            if(json.i) {
              this.setState({mymeta: json});
            }
            else {
              this.updateMyMeta({a:0});
            }

            //
            this.setState({connectionfailed: false});
            //
            Services.NoUser.call('returnUserMeta', null, (err, json2)=> {
              this.setState({mymeta: Object.assign({}, json, json2)});
              this.log('NoUser', JSON.stringify(json2));
              if(json2.country&&json2.country.toLowerCase()=="taiwan") {
                this.setState({langs: require('./langs.json')['zh-tw']});
              }
            });
            Services.NoTalk.call('getMyChs', null, (err, json)=> {
              this.setState((prevState)=> {
                prevState.channels = json;
                return prevState;
              });
              this.log('getMyChs', JSON.stringify(json));

              Services.NoTalk.call('bindChs', {i: Object.keys(json)}, (err, json2)=> {
                json2['ChIds'] = Object.keys(json);
                this.log('bindCh', JSON.stringify(json2));
              });

              for(let chid in json) {
                Services.NoTalk.call('getMsgs', {i: chid, r:30}, (err, json)=> {
                  this.log('getMsgs ('+chid+')', JSON.stringify(json));
                  this.setState(prevState=> {
                    prevState.channels[chid]['Messages'] = json.r;
                    prevState.channels[chid]['LatestReadline'] = json.l;
                    return prevState;
                  });
                });
              }
              this.setupDispatchers();
              this.setState({loading: false});
            });
          });
        }
      });
    });
    this.setupDispatchers();
    next();
  };
}

export default Service;
