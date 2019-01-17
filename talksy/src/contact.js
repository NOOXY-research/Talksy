
import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { BoxComp, SplitComp, BackPage, EditTextPage, EditListPage, AddToListPage, SplitLeft, SplitRight} from "./BaseComponent";

export class ContactsPage extends Component {
  constructor(props) {
    super(props);
    // this.state = {
    //   channels: props.channels
    // };
    this.state = {
      users: {
        'NOOXY': ['hello'],
        'User': ['simple clear elegent'],
        'Tomy': ['siasdfmple clear elegent'],
        'NOfseradf': ['simple clear elegent'],
        'NOOXY3': ['hello'],
        'NOOXY4': ['hello'],
        'User2': ['simple clear elegent'],
        'User4': ['simple clear elegent'],
        'dfseradf': ['simple clear elegent'],
      }
    };
  }

  renderUsers() {
    let elems = [];
    for(let key in this.state.users) {
      elems.push(
        <div key={key} className="Page-Row">
          <figure className="Page-Row-ThumbnailText-Head">
          </figure>
          <div className="Page-Row-ThumbnailText-Text">
            <h2>{key}</h2>
            <p>{this.state.users[key]}</p>
          </div>
        </div>
      );
    }
    return elems;
  }

  render() {
    return(
      <div className="Page">
        <Route exact path="/contacts/:path(.*)" render={(props)=>{
          return(
            <div className="Page">
              <div className="Page-Block">
                <div className="Page-Row">
                  <div className="Page-Row-Text">
                    <h1>{"Contacts"}</h1>
                    <p> {"Start a new Notalk channel by your contacts."}</p>
                  </div>
                </div>
                <div className="Page-Row" onClick={()=>{
                  props.history.push('/contacts/new');
                }}>
                  <div className="Page-Row-Button">
                    <span>add contact </span><i className="material-icons">add_circle</i>
                  </div>
                </div>
              </div>
              <div className="Page-Block">
                {this.renderUsers()}
              </div>
            </div>
          )
        }}/>

        <Route exact path="/contacts/new" render={(props)=>{
          return(
            <BoxComp history={props.history}>
            <BackPage title="New Contact" history={props.history}>
              <AddToListPage title="Add contacts" description="Add friends for your contact." list={this.state.userlist}/>
            </BackPage>
            </BoxComp>
          )
        }}/>
      </div>
    );
  }
};
