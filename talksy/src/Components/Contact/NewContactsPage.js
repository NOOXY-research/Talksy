
import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { BoxComp, SplitComp, AddToListPageRestrictedItems, BackPage, EditTextPage, EditListPage, AddToListPage, SplitLeft, SplitRight} from "../BaseComponent";
import Ink from 'react-ink';

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
          this.props.actions.searchUsers(name, (err, rows)=> {
            let list = [];
            for(let i in rows) {
              list.push(rows[i].username);
              this.props.actions.setUserNameToId(rows[i].username, rows[i].userid);
            }
            this.setState({searchusers: list});
          })
        }} description="Add friends for your contact." restricteditems={this.state.searchusers} list={this.state.userlist} onFinish={(list)=> {
          let user_ids = [];
          for(let i in list) {
            user_ids.push(this.props.actions.returnUserNameToId(list[i]))
          }
          this.props.actions.addContacts(user_ids, 0, (err)=> {
            this.props.history.push('/contacts/');
          });
        }}/>

    )
  }
}
