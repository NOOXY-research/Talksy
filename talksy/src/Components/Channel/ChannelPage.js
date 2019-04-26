import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Ink from 'react-ink';

export class ChannelPage extends Component {
  constructor(props) {
    super(props);
    this.ToBeSent = null;
    this.sendNewMessage =()=> {
      if(this.ToBeSent&&this.ToBeSent.length>0)
        this.props.actions.sendNewMessage(this.props.channelid, [0, this.ToBeSent, null], (err, meta)=> {
          this.resetInput();
      });
    };
    this.requestedUsers = [];
    this.Scroll = false;
    this.Init = false;
    this.LatestReadline = 0;
  }

  componentDidMount() {
    this.scrollToBottom();
  }

  componentDidUpdate() {
    if(this.hasUnread()||this.Scroll==true) {
      this.scrollToBottom("smooth");
      this.Scroll = false;
    }
  }

  scrollToBottom (b) {
    if(this.props.show)
      this.MessagesEnd.scrollIntoView({ behavior: b });
  }

  scrollToTop (b) {
    if(this.props.show)
      this.MessagesTop.scrollIntoView({ behavior: b });
  }

  renderUserName(msgidx) {
      let username;
      if(this.props.channelmeta.Messages[msgidx][0]&&this.props.users[this.props.channelmeta.Messages[msgidx][0]]) {
        username = this.props.users[this.props.channelmeta.Messages[msgidx][0]].username;
      }
      else if(this.props.channelmeta.Messages[msgidx][0]) {
        if(!this.requestedUsers.includes(this.props.channelmeta.Messages[msgidx][0])) {
          this.props.actions.getUserMeta(this.props.channelmeta.Messages[msgidx][0]);
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
      let me  = false;
      if(this.props.channelmeta.Messages[key][0]==this.props.my_user_meta.i) {
        me = true;
      }
      elems.push(
        <li key={i} className={(me?"ChPage-Bubble-Me":"ChPage-Bubble-Other")+" tooltip"} >
        <Ink />
          <div className="ChPage-Bubble-Title">{me?null:this.renderUserName(key)}</div>
          <div className="ChPage-Bubble-Text">{this.props.channelmeta.Messages[key][2]}</div>
          <span className={"tooltiptext "+(me?"tooltip-left":"tooltip-right")}>{this.props.channelmeta.Messages[key][4]}</span>
        </li>
      );
    }
    return elems;
  }

  hasUnread() {
    if(this.props.show&&this.props.channelmeta['Messages']) {
      let _ll = Object.keys(this.props.channelmeta['Messages']).sort((a,b)=>{return b - a;})[0];
      if((this.props.channelmeta['LatestReadline'] == null || this.props.channelmeta['LatestReadline']<_ll)) {
        return _ll;
      }
      else {
        return false;
      }
    }
  }

  handleScroll(e) {
    const bottom = e.target.scrollTop === 0;
    if (bottom) {
      let first_index = Object.keys(this.props.channelmeta['Messages']).sort((a,b)=>{return a - b;})[0];
      this.props.actions.loadMoreMessages(this.props.channelid, first_index, ()=> {
        this.scrollToTop("smooth");
      });
    }
  }

  renderTooltips() {
    if(this.props.channelmeta.Description) {
      return (<span className="tooltiptext tooltip-right">{this.props.channelmeta.Description}</span>)
    }
    else {
      return (<span className="tooltiptext tooltip-right">{"this channel has no description"}</span>)
    }
  }

  resetInput() {
    this.ToBeSent = '';
    this.TextInput.value = '';
  }

  render() {
    let _ll = this.hasUnread();
    if(_ll) {
      this.props.actions.readChannelLine(this.props.channelid, _ll, ()=>{  });
    }
    if(this.Init==false&&this.props.channelmeta.Messages!=null) {
      this.Scroll=true;
      this.Init = true;
    }
    return(
      <div className="ChPage" style={this.props.show?null:{ display:"none"}}>
        <div className="ChPage-Header">
          <Link to={this.props.match.params.channel_root}>
            <div className="ChPage-Header-left-Button">
            <Ink />
              <i className="material-icons">arrow_back</i>
            </div>
          </Link >

          <Link to={this.props.match.params.channel_root+this.props.match.params.channel_id+'/settings'}>
            <div className="tooltip ChPage-Header-right-Button">
            <Ink/>
              <i className="material-icons">settings</i>
              <span className="tooltiptext tooltip-left">Manage your channel settings</span>
            </div>
          </Link>

          <div className="tooltip ChPage-Header-right-Button" onClick={()=>{this.props.onPeopleClick()}}>
          <Ink/>
            <i className="material-icons">people</i>
            <span className="tooltiptext tooltip-left">Manage your channel members</span>
          </div>
          <div className=" ChPage-Header-Title tooltip">
            {(this.props.channelmeta.Displayname)}
            {this.renderTooltips()}
          </div>
        </div>
        <ul className="ChPage-Messages" onScroll={this.handleScroll.bind(this)}>
          <div style={{ float:"left", clear: "both" }} ref={el => this.MessagesTop = el}></div>
          {this.renderMessages()}
          <div style={{ float:"left", clear: "both" }} ref={el => this.MessagesEnd = el}></div>
        </ul>
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
            <div className="ChPage-Sender-Button" onClick={this.sendNewMessage}><Ink/><i className="material-icons">send</i></div>
          </div>
        </div>
      </div>
    );
  }
}
