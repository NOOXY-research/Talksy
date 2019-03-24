
import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { BoxComp, SplitComp, AddToListPageRestrictedItems, BackPage, EditTextPage, EditListPage, AddToListPage, SplitLeft, SplitRight} from "./BaseComponent";
import Ink from 'react-ink';


export class ContactsPage extends Component {
  constructor(props) {
    super(props);
    // this.state = {
    //   channels: props.channels
    // };
    this.state = {
      searchusers: []
    };

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
        return interval + " h";
      }
      interval = Math.floor(seconds / 60);
      if (interval >= 1) {
        return interval + " m";
      }
      if(seconds>0)
        return Math.floor(seconds) + " s";
      else
        return "0 s"
    }
  }

  renderActiveIcon(usermeta) {
    if(usermeta&&usermeta.active) {
      if(usermeta.active==true) {
        return <mark className="Page-Row-ThumbnailText-Head-Active-Circle"/>
      }
      else if((new Date()-new Date(usermeta.active.replace(/ /g,"T")+"Z"))<3600*1000) {
        return <mark className="Page-Row-ThumbnailText-Head-Active">{this.timeSince(new Date(usermeta.active.replace(/ /g,"T")+"Z"))}</mark>
      }
      else {
        return null
      }
    }
    else {
      return null
    }
  }

  renderContacts() {
    let elems = [];
    for(let key in this.props.contacts) {
      if(this.props.contacts[key].Type == 0) {
        let usermeta = this.props.users[this.props.contacts[key].ToUserId];
        if(!Object.keys(this.props.users).includes(this.props.contacts[key].ToUserId)) {
          this.props.loadUserMeta(this.props.contacts[key].ToUserId);
        }
        elems.push(
          <div key={key} className="Page-Row" onClick={()=>{
            this.props.history.push('/users/'+usermeta.userid);
          }}>
          <Ink/>
            <figure className="Page-Row-ThumbnailText-Head">
            {this.renderActiveIcon(usermeta)}
            </figure>
            <div className="Page-Row-ThumbnailText-Text">
              <h2>{usermeta?usermeta.username:this.props.langs.loading+"..."}</h2>
              <p>{usermeta?usermeta.b:this.props.langs.loading+"l..."}</p>
            </div>
          </div>
        );
      }

    }
    if(elems.length ==0) {
      elems.push(
        <div className="Page-Row">
        <Ink/>
          <div className="Page-Row-Text">
            <h2>{"You have no contacts"}</h2>
            <p> {"Please add contacts to access more functions."}</p>
          </div>
        </div>
      );
    }
    return elems;
  }

  render() {
      return([
          <div className="Page-Block">
            <div className="Page-Row">
            <Ink/>
              <div className="Page-Row-Text">
                <h1>{this.props.langs.contacts}</h1>
                <p> {"Start a new Talksy channel with your contacts or see who are online."}</p>
              </div>
            </div>
            <div className="Page-Row" onClick={()=>{
              this.props.history.push('/contacts/new');
            }}>
            <Ink />
              <div className="Page-Row-Button">
                <span>{this.props.langs.new_contacts}</span><i className="material-icons">add_circle</i>
              </div>
            </div>
          </div>
          ,
          <div className="Page-Block">
            {this.renderContacts()}
          </div>
      ])
  }
};

export class NewContactsPage extends Component {
  constructor(props) {
    super(props);
    // this.state = {
    //   channels: props.channels
    // };
    this.state = {
      searchusers: []
    };
  }
  render() {
    return(
        <AddToListPageRestrictedItems title="Add contacts" onChange={(name, prev)=>{
          this.props.searchUsers(name, (err, rows)=> {
            let list = [];
            for(let i in rows) {
              list.push(rows[i].username);
              this.props.setUserNameToId(rows[i].username, rows[i].userid);
            }
            this.setState({searchusers: list});
          })
        }} description="Add friends for your contact." restricteditems={this.state.searchusers} list={this.state.userlist} onFinish={(list)=> {
          let userids = [];
          for(let i in list) {
            userids.push(this.props.returnUserNameToId(list[i]))
          }
          this.props.addContacts(userids, 0, (err)=> {
            this.props.history.push('/contacts/');
          });
        }}/>

    )
  }
}
