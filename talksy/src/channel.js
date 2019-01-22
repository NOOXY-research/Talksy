
import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { BoxComp, SplitComp, AddToListPageRestrictedItems, BackPage, EditTextPage, EditListPage, AddToListPage, SplitLeft, SplitRight} from "./BaseComponent";
import './tooltip.css';

export class ChannelPage extends Component {
  constructor(props) {
    super(props);
    this.ToBeSent = null;
    this.sendNewMessage =()=> {
      if(this.ToBeSent&&this.ToBeSent.length>0)
        this.props.sendNewMessage(this.props.channelid, [0, this.ToBeSent, null], (err, meta)=> {
          this.resetInput();
      });
    };
    this.requestedUsers = [];

  }

  renderUserName(msgidx) {
      let username;
      if(this.props.channelmeta.Messages[msgidx][0]&&this.props.users[this.props.channelmeta.Messages[msgidx][0]]) {
        username = this.props.users[this.props.channelmeta.Messages[msgidx][0]].username;
      }
      else if(this.props.channelmeta.Messages[msgidx][0]) {
        if(!this.requestedUsers.includes(this.props.channelmeta.Messages[msgidx][0])) {
          this.props.loadUserMeta(this.props.channelmeta.Messages[msgidx][0]);
          this.requestedUsers.push(this.props.channelmeta.Messages[msgidx][0]);
        }

        username = this.props.channelmeta.Messages[msgidx][0];
      }
      else {
        username="Guest";
      }
      return username;
  }

  renderMessages() {
    let elems = [];
    let keys = Object.keys(this.props.channelmeta.Messages?this.props.channelmeta.Messages:{}).sort((a,b)=>{return a - b;});
    for(let i in keys) {
      let key = keys[i];
      let align = 'left';
      if(this.props.channelmeta.Messages[key][0]==this.props.mymeta.i) {
        align = 'right';
      }
      elems.push(
        <div key={key} className="ChPage-Messege" style={{'textAlign': align}}>
          <div className="ChPage-Bubble" >
            <div className="ChPage-Bubble-Title">{this.renderUserName(key)}</div>
            <div className="ChPage-Bubble-Text">{this.props.channelmeta.Messages[key][2]}</div>
            <div className="ChPage-Bubble-Date">{this.props.channelmeta.Messages[key][3]}</div>
          </div>
        </div>
      );
    }
    return elems;
  }

  renderTooltips() {
    if(this.props.channelmeta.Description) {
      return (<span className="tooltiptext tooltip-bottom">{this.props.channelmeta.Description}</span>)
    }
    else {
      return (<span className="tooltiptext tooltip-bottom">{"this channel has no description"}</span>)
    }
  }

  resetInput() {
    this.TextInput.value = '';
  }

  render() {
    if(this.props.show) {
      return(
        <div className="ChPage">
          <div className="ChPage-Header">
            <div className="ChPage-Header-left-Button"
            onClick={()=>{this.props.history.push(this.props.rootpath)}}>
              <i className="material-icons">arrow_back</i>
            </div>
            <div className="tooltip ChPage-Header-right-Button" onClick={()=>{this.props.onSettingsClick()}}>
              <i className="material-icons">settings</i>
              <span className="tooltiptext tooltip-left">Manage your channel settings</span>
            </div>
            <div className="tooltip">
              {(this.props.channelmeta.Displayname)}
              {this.renderTooltips()}
            </div>
          </div>
          <div className="ChPage-Messages">
            {this.renderMessages()}
          </div>
          <div className="ChPage-Sender">
            <input placeholder="input text...." className="ChPage-Sender-Input" ref={el => this.TextInput = el} onChange={evt=> {
              this.ToBeSent = evt.target.value;
            }}
            onKeyPress={
              (event)=> {
                if(event.key == 'Enter'){
                  this.sendNewMessage()
                }
              }
            }></input>
            <div className="ChPage-Sender-Buttons">
              <div className="ChPage-Sender-Button" onClick={this.sendNewMessage}><i className="material-icons">send</i></div>
            </div>
          </div>
        </div>
      );
    }
    else {
      return null;
    }
  }
}

export class NewChannelPage extends Component {
  constructor(props) {
    super(props);
    this.state= {
      searchusers:[],
      status: 'create a new Notalk channel.',
      levels: {
        0: "Admin can access, member can view",
        1: "Member can access and view",
        2: "Member can access, nooxy user can view",
        3: "Member can access, public can view",
        4: "Nooxy user can access and view",
        5: "Nooxy user can access, public can view",
        6: "public can access, public can view"
      },
      types: {
        0: "A normal talk",
        1: "A live talk",
      },
      userlist: [],
      channelmeta: {
        t:0,
        a:1
      }
    };
  }

  renderTypes() {
    let elems = [];
    let i=0;
    for(let key in this.state.types) {
      elems.push(
          <option key={key} value={i++}>{this.state.types[key]}</option>
      );
    }
    return (<select onChange={evt => {
      let value = evt.target.value;
      this.setState(prevState=> {
        prevState.channelmeta.t = parseInt(value);
        return prevState;
      })
    }}>{elems}</select>);
  }

  renderLevels() {
    let elems = [];
    let i=0;
    for(let key in this.state.levels) {
      elems.push(
        <option key={key} value={i++}>{this.state.levels[key]}</option>
      );
    }
    return (<select value={this.state.channelmeta.a} onChange={evt => {
      let value = evt.target.value;
      this.setState(prevState=> {
        prevState.channelmeta.a = parseInt(value);
        return prevState;
      })
    }}>{elems}</select>);
  }

  render() {
    if(this.props.show) {
      return(
        <div className="Page">
          <Route exact path="/channels/new:path(.*)" render={(props)=>{
            return(
              <div className="Page">
                <div className="Page-Block">
                  <div className="Page-Row">
                    <div className="Page-Row-Text">
                      <h1>{"Create a new channel"}</h1>
                      <p> {this.state.status}</p>
                    </div>
                  </div>
                </div>

                <div className="Page-Block">
                  <div className="Page-Row">
                    <div className="Page-Row-Text">
                      <h2>{"Channel's Name"}</h2>
                      <input placeholder="Enter your channel's name" className="ChPage-Sender-Input" onChange={evt => {
                        let value = evt.target.value;
                        if(value=='how2debug?') {
                          this.props.setDebug(true)
                        }
                        else {
                          this.setState(prevState=> {

                            prevState.channelmeta.n = value;
                            return prevState;
                          })
                        }
                      }}></input>
                    </div>
                  </div>
                  <div className="Page-Row">
                    <div className="Page-Row-Text">
                      <h2>{"Channel's photo"}</h2>
                      <input type="file" name="pic" accept="image/*"/>
                    </div>
                  </div>
                  <div className="Page-Row">
                    <div className="Page-Row-Text">
                      <h2>{"Description"}</h2>
                      <input placeholder="Enter your description" className="ChPage-Sender-Input" onChange={evt => {
                        let value = evt.target.value;
                        this.setState(prevState=> {
                          prevState.channelmeta.d = value;
                          return prevState;
                        })
                      }}></input>
                    </div>
                  </div>
                  <div className="Page-Row">
                    <div className="Page-Row-Text">
                      <h2 className="">{"Access Level"}</h2>
                      <p> {this.renderLevels()}</p>
                    </div>
                  </div>
                  <div className="Page-Row">
                    <div className="Page-Row-Text">
                      <h2>{"Type"}</h2>
                      <p> {this.renderTypes()}</p>
                    </div>
                  </div>
                  <div className="Page-Row"  onClick={()=>{this.props.history.push('/channels/new/users');}}>
                    <div className="Page-Row-Text">
                      <h2>{"Users"}</h2>
                      <p> {"click to edit."}</p>
                    </div>
                  </div>
                </div>

                <div className="Page-Block">
                  <div className="Page-Row"  onClick={()=>{
                    this.props.createChannel(this.state.channelmeta, (err, meta)=> {
                      if(meta.s=='OK') {
                        let list=[];
                        for(let i in this.state.userlist) {
                          list.push(this.props.returnUserNameToId(this.state.userlist[i]));
                        }
                        this.props.addUsersToChannel(meta.i, list, ()=>{
                          this.props.history.push('/channels/'+meta.i);
                          this.setState(prevState=> {
                            prevState.channelmeta = {t:0,a:1};
                            return prevState;
                          })
                        });
                      }
                      else {
                        this.setState({'status':meta.s});
                      }
                    })

                  }}>
                    <div className="Page-Row-Text">
                      <h2>{"Create"}</h2>
                      <p> {"create this channel"}</p>
                    </div>
                  </div>
                  <div className="Page-Row" onClick={()=>{this.props.history.push('/');}}>
                    <div className="Page-Row-Text">
                      <h2>{"Cancel"}</h2>
                      <p> {"Do not create this channel"}</p>
                    </div>
                  </div>
                </div>
              </div>
            )

          }}/>

          <Route exact path="/channels/new/users" render={(props)=>{
            return(
              <BoxComp history={props.history}>
                <BackPage history={props.history} title="add users">
                  <AddToListPageRestrictedItems title="Add users" onChange={(name, prev)=>{
                    let list = [];
                    if(name=="") {

                    }
                    else {
                      console.log(this.props.contacts);
                      for(let i in this.props.contacts) {
                        let meta = this.props.users[this.props.contacts[i].ToUserId];
                        if(meta) {
                          if(meta.username.startsWith(name)) {
                            list.push(meta.username);
                            this.setState({searchusers: list});
                          }
                        }
                        else {
                          this.props.loadUserMeta(this.props.contacts[i].ToUserId);
                        }
                        // console.log(this.props.users[this.props.contacts[i].ToUserId].username);
                      }
                    }


                  }}
                  onFinish={(list)=> {
                    this.setState({userlist: list});
                    this.props.history.push("/channels/new");
                  }} description="Add users for your channels." restricteditems={this.state.searchusers} list={this.state.userlist}/>
                </BackPage>
              </BoxComp>
            );
          }}/>
        </div>
      );
    }
    else {
      return null;
    }
  }
}

export class ChannelSettingsPage extends Component {
  constructor(props) {
    super(props);
    this.state= {
      searchusers:[],
      status: 'Below are you settings.',
      levels: {
        0: "Admin can access, member can view",
        1: "Member can access and view",
        2: "Member can access, nooxy user can view",
        3: "Member can access, public can view",
        4: "Nooxy user can access and view",
        5: "Nooxy user can access, public can view",
        6: "public can access, public can view"
      },
      types: {
        0: "A normal talk",
        1: "A live talk",
      },
      channelmeta: {
        a: props.channelmeta.AccessLevel,
        t: props.channelmeta.Type,
      }
      ,
      userlist: []
    };
    console.log(props.channelmeta);
  }

  renderTypes() {
    let elems = [];
    let i=0;
    for(let key in this.state.types) {
      elems.push(
          <option key={key} value={key}>{this.state.types[key]}</option>
      );
    }
    return (<select value={this.state.channelmeta.t} onChange={evt => {
      let value = evt.target.value;
      this.setState(prevState=> {
        prevState.channelmeta.t = parseInt(value);
        return prevState
      })
    }}>{elems}</select>);
  }

  renderLevels() {
    let elems = [];
    let i=0;
    for(let key in this.state.levels) {
      elems.push(
        <option key={key} value={key}>{this.state.levels[key]}</option>
      );
    }
    return (<select value={this.state.channelmeta.a} onChange={evt => {
      let value = evt.target.value;
      this.setState(prevState=> {
        prevState.channelmeta.a = parseInt(value);
        return prevState;
      });

    }}>{elems}</select>);
  }

  render() {
    return(
      [<div className="Page">
            <div className="Page">
              <div className="Page-Block">
                <div className="Page-Row">
                  <div className="Page-Row-Text">
                    <h1>{"Manage your channel's settings"}</h1>
                    <p> {this.state.status}</p>
                  </div>
                </div>
              </div>

              <div className="Page-Block">
                <div className="Page-Row">
                  <div className="Page-Row-Text">
                    <h2>{"Channel's Name"}</h2>
                    <input placeholder={this.props.channelmeta.Displayname} className="ChPage-Sender-Input" onChange={evt => {
                      let value = evt.target.value;
                      this.setState(prevState=> {
                        prevState.channelmeta.n = value;
                        return prevState;
                      });
                    }}></input>
                  </div>
                </div>
                <div className="Page-Row">
                  <div className="Page-Row-Text">
                    <h2>{"Channel's photo"}</h2>
                    <input type="file" name="pic" accept="image/*"/>
                  </div>
                </div>
                <div className="Page-Row">
                  <div className="Page-Row-Text">
                    <h2>{"Description"}</h2>
                    <input placeholder={this.props.channelmeta.Description?this.props.channelmeta.Description:"enter your channel's description"} className="ChPage-Sender-Input" onChange={evt => {
                      let value = evt.target.value;
                      this.setState(prevState=> {
                        prevState.channelmeta.d = value;
                        return prevState;
                      });
                    }}></input>
                  </div>
                </div>
                <div className="Page-Row">
                  <div className="Page-Row-Text">
                    <h2 className="">{"Access Level"}</h2>
                    <p> {this.renderLevels()}</p>
                  </div>
                </div>
                <div className="Page-Row">
                  <div className="Page-Row-Text">
                    <h2>{"Type"}</h2>
                    <p> {this.renderTypes()}</p>
                  </div>
                </div>
                <div className="Page-Row"  onClick={()=>{this.props.history.push('/channels/'+this.props.channelid+'/settings/addusers')}}>
                  <div className="Page-Row-Text">
                    <h2>{"Users"}</h2>
                    <p> {"click to edit."}</p>
                  </div>
                </div>
              </div>

              <div className="Page-Block">
                <div className="Page-Row"  onClick={()=>{
                  this.state.channelmeta.i = this.props.channelid;
                  this.props.updateChannel(this.state.channelmeta, (err, meta)=> {
                    if(meta.s=='OK') {
                      let list=[];
                      for(let i in this.state.userlist) {
                        list.push(this.props.returnUserNameToId(this.state.userlist[i]));
                      }
                      this.props.addUsersToChannel(this.props.channelid, list, ()=>{
                        this.props.history.push('/channels/'+this.props.channelid);
                        this.setState(prevState=> {
                          prevState.channelmeta = {a:1, t:0};
                          return prevState;
                        });

                      });
                    }
                    else {
                      this.setState({'status':meta.s});
                    }
                  })

                }}>
                  <div className="Page-Row-Text">
                    <h2>{"Update"}</h2>
                    <p> {"update this channel"}</p>
                  </div>
                </div>
                <div className="Page-Row" onClick={()=>{this.props.history.push('/channels/'+this.props.channelid);}}>
                  <div className="Page-Row-Text">
                    <h2>{"Cancel"}</h2>
                    <p> {"giveup editing the channel"}</p>
                  </div>
                </div>
              </div>
            </div>
      </div>
        ,
        <Route exact path={'/channels/'+this.props.channelid+'/settings/addusers'} render={(props)=>{
          return(
            <BoxComp history={props.history}>
                <AddToListPageRestrictedItems title="Add users" onChange={(name, prev)=>{
                  let list = [];
                  if(name=="") {

                  }
                  else {
                    for(let i in this.props.contacts) {
                      let meta = this.props.users[this.props.contacts[i].ToUserId];
                      if(meta) {
                        if(meta.username.startsWith(name)) {
                          list.push(meta.username);
                          this.setState({searchusers: list});
                        }
                      }
                      else {
                        this.props.loadUserMeta(this.props.contacts[i].ToUserId);
                      }
                      // console.log(this.props.users[this.props.contacts[i].ToUserId].username);
                    }
                  }

                }}
                onFinish={(list)=> {
                  this.setState({userlist: list});
                  this.props.history.push('/channels/'+this.props.channelid+'/settings');
                }} description="Add users for your channels." restricteditems={this.state.searchusers} list={this.state.userlist}/>
            </BoxComp>
          );
        }}/>
      ]


    );
  }
}

export class ChannelList extends Component {
  constructor (props) {
    super(props);
    this.rootpath = props.rootpath;
  };

  renderUnreadCount(count) {
    if(count) {
      return(
        <div className="ChList-Row-ChUnread">
          {count}
        </div>
      )
    }
    else {
      return null;
    }
  }

  renderLastMessages(chmeta) {
    if(chmeta.Messages&&Object.keys(chmeta.Messages).length>0) {
      let lastmsg = chmeta.Messages[Object.keys(chmeta.Messages)[Object.keys(chmeta.Messages).length-1]];
      if(this.props.users[lastmsg[0]]) {
        return(this.props.users[lastmsg[0]].username+': '+lastmsg[2])
      }
      else {
        this.props.loadUserMeta(lastmsg[0]);
        return(lastmsg[2])
      }
    }
    else if (chmeta.Description){
      return(chmeta.Description)
    }
    else {
      return(null)
    }
  }

  renderRows() {
    let elems = [];
    for(let key in this.props.channels) {
      elems.push(
          <div key={key} className={this.props.selected===key?"ChList-Row-selected":"ChList-Row"} onClick={()=>{this.props.onSelect(key, this.props.history)}}>
            <figure className="Page-Row-ThumbnailText-Head">
            </figure>
            <div className="Page-Row-ThumbnailText-Text">
              <h2>{this.props.channels[key].Displayname}</h2>
              <p>{this.renderLastMessages(this.props.channels[key])}</p>
            </div>
            {this.renderUnreadCount(this.props.channels[key][2])}
          </div>
      );
    }
    if(!this.props.channels||Object.keys(this.props.channels).length == 0) {
      return(
        [
        <div className="Page-Row">
          <div className="Page-Row-Text">
            <h1>{"You have no channels"}</h1>
            <p>{"Click create channel to create new channel."}</p>
          </div>
        </div>
        ,
        <div className="Page-Row">
          <div className="Page-Row-Text">
            <h2>{"Create"}</h2>
            <p>{"Click create channel to create new channel."}</p>
          </div>
        </div>
        ,
        <div className="Page-Row">
          <div className="Page-Row-Text">
            <h2>{"Explore"}</h2>
            <p>{"Click TrendingPage to explore what people are talking about."}</p>
          </div>
        </div>
        ]
      )
    }
    else {
      return elems;
    }
  };

  render() {
    return(
      <div className="ChList-Rows" >
        <div className="Page-Block">
          <div className="Page-Row">
            <div className="Page-Row-Text">
              <h1>{"Your channels"}</h1>
              <p> {"Here are all of your channels. (Talksy is still under development, will be avalible about this summer.)"}</p>
            </div>
          </div>
          <div className="Page-Row" onClick={()=>{this.props.onSelect('new', this.props.history)}}>
            <div className="Page-Row-Button">
              <span>new channel </span><i className="material-icons">add_circle</i>
            </div>
          </div>
        </div>
        <div className="Page-Block">
          {this.renderRows()}
        </div>
      </div>
    );
  }
}
