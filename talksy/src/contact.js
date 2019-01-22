
import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { BoxComp, SplitComp, AddToListPageRestrictedItems, BackPage, EditTextPage, EditListPage, AddToListPage, SplitLeft, SplitRight} from "./BaseComponent";

export class ContactsPage extends Component {
  constructor(props) {
    super(props);
    // this.state = {
    //   channels: props.channels
    // };
    this.state = {
      searchusers: []
    };
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
            <figure className="Page-Row-ThumbnailText-Head">
            </figure>
            <div className="Page-Row-ThumbnailText-Text">
              <h2>{usermeta?usermeta.username:"loading..."}</h2>
              <p>{usermeta?usermeta.b:"loading..."}</p>
            </div>
          </div>
        );
      }

    }
    return elems;
  }

  render() {
      return([
          <div className="Page-Block">
            <div className="Page-Row">
              <div className="Page-Row-Text">
                <h1>{"Contacts"}</h1>
                <p> {"Start a new Notalk channel with your contacts."}</p>
              </div>
            </div>
            <div className="Page-Row" onClick={()=>{
              this.props.history.push('/contacts/new');
            }}>
              <div className="Page-Row-Button">
                <span>add contact </span><i className="material-icons">add_circle</i>
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
