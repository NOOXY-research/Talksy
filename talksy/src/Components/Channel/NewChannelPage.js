import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { Box, SplitComp, AddToListPageRestrictedItems, BackPage, EditTextPage, EditListPage, AddToListPage, SplitLeft, SplitRight} from "../BaseComponent";

import Ink from 'react-ink';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

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
      },
      show_users: false
    };
  }

  renderTypes() {
    let elems = [];
    let i=0;
    for(let key in this.state.types) {
      elems.push(
          <MenuItem key={key} value={i++}>{this.state.types[key]}</MenuItem>
      );
    }
    return (
      <Select value={this.state.channelmeta.t} onChange={evt => {
      let value = evt.target.value;
      this.setState(prevState=> {
        prevState.channelmeta.t = parseInt(value);
        return prevState;
      })
      }}>{elems}</Select>
    );
  }

  renderLevels() {
    let elems = [];
    let i=0;
    for(let key in this.state.levels) {
      elems.push(
        <MenuItem key={key} value={i++}>{this.state.levels[key]}</MenuItem>
      );
    }
    return (<Select value={this.state.channelmeta.a} onChange={evt => {
      let value = evt.target.value;
      this.setState(prevState=> {
        prevState.channelmeta.a = parseInt(value);
        return prevState;
      })
    }}>{elems}</Select>);
  }

  render() {
    return(
        <Route exact path="/channels/new:path(.*)" render={(props)=>{
          return(
            <div className="ChPage">
              <div className="Page">
                <div className="Page-Block">
                  <div className="Page-Row">
                  <Ink/>
                    <div className="Page-Row-Text">
                      <h1>{this.props.localize.new_channels}</h1>
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
                          this.props.actions.setDebug(true)
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
                  <div className="Page-Row"  onClick={()=>{this.setState({show_users: true});}}>
                    <div className="Page-Row-Text">
                      <h2>{"Users"}</h2>
                      <p> {"click to edit."}</p>
                    </div>
                  </div>
                </div>

                <div className="Page-Block">
                  <div className="Page-Row"  onClick={()=>{
                    this.props.actions.createChannel(this.state.channelmeta, (err, meta)=> {
                      if(meta.s=='OK') {
                        let list=[];
                        for(let i in this.state.userlist) {
                          list.push(this.props.returnUserNameToId(this.state.userlist[i]));
                        }
                        this.props.actions.addUsersToChannel(meta.i, list, ()=>{
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
                  <Ink/>
                    <div className="Page-Row-Text">
                      <h2>{"Create"}</h2>
                      <p> {"create this channel"}</p>
                    </div>
                  </div>
                  <div className="Page-Row" onClick={()=>{this.props.history.push('/');}}>
                  <Ink/>
                    <div className="Page-Row-Text">
                      <h2>{"Cancel"}</h2>
                      <p> {"Do not create this channel"}</p>
                    </div>
                  </div>
                </div>
              </div>
              {this.state.show_users?<Box history={props.history}>
                <BackPage onBack={()=>{this.setState({show_users: false});}} title="add users">
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
                          this.props.actions.getUserMeta(this.props.contacts[i].ToUserId);
                        }
                        // console.log(this.props.users[this.props.contacts[i].ToUserId].username);
                      }
                    }
                  }}
                  onFinish={(list)=> {
                    this.setState({userlist: list, show_users: false});
                  }} description="Add users for your channels." restricteditems={this.state.searchusers} list={this.state.userlist}/>
                </BackPage>
              </Box>:null}
            </div>
          )

        }}/>
    );
  }
}
