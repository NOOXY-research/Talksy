import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { Box, SplitComp, BackPage, EditTextPage, EditListPage, AddToListPage, SplitLeft, SplitRight} from "../BaseComponent";
import Ink from 'react-ink';

export class UserAccountPage extends Component {
  constructor(props) {
    super(props);

    this.timeSince = (date)=> {
      let seconds = Math.floor((new Date() - date) / 1000);
      let interval = Math.floor(seconds / 31536000);

      if (interval >= 1) {
        return interval + " years";
      }
      interval = Math.floor(seconds / 2592000);
      if (interval >= 1) {
        return interval + " months";
      }
      interval = Math.floor(seconds / 86400);
      if (interval >= 1) {
        return interval + " days";
      }
      interval = Math.floor(seconds / 3600);
      if (interval >= 1) {
        return interval + " hours";
      }
      interval = Math.floor(seconds / 60);
      if (interval >= 1) {
        return interval + " minutes";
      }
      if(seconds>0)
        return Math.floor(seconds) + " seconds";
      else
        return "0 s"
    }
  };

  renderProfile() {
    if(this.props.usermeta) {
      return(
        <div className="Page-Block">
          <div className="Page-Row">
          <Ink/>
            <figure className="Page-Row-ThumbnailText-Head">
            </figure>
            <div className="Page-Row-ThumbnailText-Text">
              <h2>{this.props.usermeta.username?this.props.usermeta.username:(this.props.usermeta.n?this.props.usermeta.n:this.props.localize.guest)}</h2>
              <p> {this.props.usermeta.b?this.props.usermeta.b:'Have no bio.'}</p>
            </div>
          </div>
          <div className="Page-Row">
          <Ink/>
            <div className="Page-Row-Text">
              <h2>{this.props.localize.bio}</h2>
              <p> {this.props.usermeta.b}</p>
            </div>
          </div>
          <div className="Page-Row">
          <Ink/>
            <div className="Page-Row-Text">
              <h2>{"Latest Online"}</h2>
              <p> {this.props.usermeta.active==null?"no record":this.props.usermeta.active==true?"now":this.timeSince(new Date(this.props.usermeta.active.replace(/ /g,"T")+"Z"))+" ago"}</p>
            </div>
          </div>
        </div>
      )
    }
    else {
      return(
        <div className="Page-Block">
          <div className="Page-Row">
          <Ink/>
            <figure className="Page-Row-ThumbnailText-Head">
            </figure>
            <div className="Page-Row-ThumbnailText-Text">
              <h2>{"User not exist"}</h2>
              <p> {'Have no bio.'}</p>
            </div>
          </div>
        </div>
      )
    }
  }

  renderRelation(r) {
    if(r===0) {
      return("This account is in your contact.")
    }
    else if (r===2) {
      return("Blocked.")
    }
    else {
      return("None")
    }
  }

  renderOptions() {
    let rows = [];
    let has_relation = false;
    for(let i in this.props.contacts) {
      if(this.props.usermeta&&this.props.contacts&&this.props.contacts[i].ToUserId===this.props.usermeta.userid) {
        if(this.props.contacts[i].Type===0) {
          has_relation = true;
        }
        rows.push(
          <div className="Page-Row">
          <Ink/>
            <div className="Page-Row-Text">
              <h2>{"Relation"}</h2>
              <p> {this.renderRelation(this.props.contacts[i].Type)}</p>
            </div>
          </div>
        )
      }
    }

    if(!has_relation) {
      rows.push(
        <div className="Page-Row" onClick={()=> {this.props.actions.addContacts([this.props.usermeta.userid], 0)}}>
        <Ink/>
          <div className="Page-Row-Text">
            <h2>{"Add to contact"}</h2>
            <p> {"Add this account to your contact."}</p>
          </div>
        </div>
      )
    }
    else {
      rows.push(
        <div className="Page-Row" onClick={()=> {this.props.actions.addContacts([this.props.usermeta.userid], 1)}}>
        <Ink/>
          <div className="Page-Row-Text">
            <h2>{"Remove from contact"}</h2>
            <p> {"Remove this account from your contact."}</p>
          </div>
        </div>
      )
      rows.push(
        <div className="Page-Row">
        <Ink/>
          <div className="Page-Row-Text">
            <h2>{"Add to channel"}</h2>
            <p> {"Add this account to your existed channel."}</p>
          </div>
        </div>
      )
    }

    return (<div className="Page-Block">{rows}</div>);
  }

  render() {
    return(
      [
        this.renderProfile()
        ,
        this.renderOptions()
      ]
    )
  }
}
