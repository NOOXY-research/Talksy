import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { Box, SplitComp, AddToListPageRestrictedItems, BackPage, EditTextPage, EditListPage, AddToListPage, SplitLeft, SplitRight} from "../BaseComponent";

import Ink from 'react-ink';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';


import ImageCropperDiolog from '../commons/ImageCropperDialog';

import withMobileDialog from '@material-ui/core/withMobileDialog';


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
        a: props.channelmeta.AccessLevel?props.channelmeta.AccessLevel:0,
        t: props.channelmeta.Type,
      }
      ,
      userlist: [],
      show_users: false
    };
  }

  renderTypes() {
    let elems = [];
    let i=0;
    for(let key in this.state.types) {
      elems.push(
          <MenuItem key={key} value={key}>{this.state.types[key]}</MenuItem>
      );
    }
    return (
      <Select value={this.state.channelmeta.t} onChange={evt => {
        let value = evt.target.value;
        this.setState(prevState=> {
          prevState.channelmeta.t = parseInt(value);
          return prevState
        })
      }}>{elems}</Select>);
  }

  renderLevels() {
    let elems = [];
    let i=0;
    for(let key in this.state.levels) {
      elems.push(
        <MenuItem key={key} value={key}>{this.state.levels[key]}</MenuItem>
      );
    }
    return (<Select value={this.state.channelmeta.a} onChange={evt => {
      let value = evt.target.value;
      this.setState(prevState=> {
        prevState.channelmeta.a = parseInt(value);
        return prevState;
      });

    }}>{elems}</Select>);
  }

  render() {
    return(
        <div className="Page Page-Root">
          <div className="Page-Block">
            <div className="Page-Row">
            <Ink/>
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
                <input placeholder={this.props.channelmeta.Displayname?this.props.channelmeta.Displayname:"Enter your channel's name"} className="ChPage-Sender-Input" onChange={evt => {
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
                <ImageCropperDiolog open={this.state.adding_new_photo} onFinish={(canvas)=> {
                  this.setState(prevState=> {
                    prevState.adding_new_photo = false;
                    if(canvas)
                      prevState.channelmeta.p = canvas.toDataURL("image/jpeg");
                    console.log(prevState.channelmeta.p);
                    return prevState;
                  });
                }}></ImageCropperDiolog>
                <Button onClick={()=>{this.setState({adding_new_photo: true})}} size="small" variant="contained" color="primary">
                  {"add an photo"}
                </Button>
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
                <p>{this.renderLevels()}</p>
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
            <div className="Page-Row" onClick={()=>{this.props.actions.deleteChannel(this.props.channelid, (err, json)=> {
              if(json.e==null) {
                this.setState(prevState=> {
                  prevState.channelmeta = {a:1, t:0};
                  this.props.history.push("/");
                  return prevState;
                });
              }
              else {
                this.setState({'status':json.s});
              }
            });}}>
            <Ink/>
              <div className="Page-Row-Text">
                <h2>{"Delete"}</h2>
                <p> {"Delete the channel"}</p>
              </div>
            </div>
          </div>

          <div className="Page-Block">
            <div className="Page-Row"  onClick={()=>{
              this.state.channelmeta.i = this.props.channelid;
              this.props.actions.updateChannel(this.state.channelmeta, (err, meta)=> {
                if(meta.s=='OK') {
                  let list=[];
                  for(let i in this.state.userlist) {
                    list.push(this.props.actions.returnUserNameToId(this.state.userlist[i]));
                  }
                  this.props.actions.addUsersToChannel(this.props.channelid, list, ()=>{
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
            <Ink/>
              <div className="Page-Row-Text">
                <h2>{"Update"}</h2>
                <p> {"update this channel"}</p>
              </div>
            </div>
            <div className="Page-Row" onClick={()=>{this.props.history.push('/channels/'+this.props.channelid);}}>
            <Ink/>
              <div className="Page-Row-Text">
                <h2>{"Cancel"}</h2>
                <p> {"giveup editing the channel"}</p>
              </div>
            </div>
          </div>
            <Dialog fullScreen={this.props.fullScreen} open={this.state.show_users} onClose={()=>{this.setState({show_users: false})}}>
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
          </Dialog>
      </div>
    );
  }
}
