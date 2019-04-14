
import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { Box, SplitComp, BackPage, EditTextPage, EditListPage, AddToListPage, SplitLeft, SplitRight} from "../BaseComponent";
import Ink from 'react-ink';

import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

const CONSTANTS = require('../constants.json');

const NOSERVICE_NOUSER_URL = CONSTANTS.NOSERVICE_NOUSER_URL;


export class MyAccountPage extends Component {
  constructor(props) {
    super(props);
  };

  updateBio = (newbio)=> {
    this.props.updateMyMeta({b:newbio})
    this.props.history.push('/account/');
  };

  updateActivity = (level)=> {
    this.props.updateMyMeta({a:level})
    this.props.history.push('/account/');
  };

  render() {
    console.log(NOSERVICE_NOUSER_URL);
    return(
      <div className="Page">
        <div className="Page-Block">
          <div className="Page-Row">
          <Ink/>
            <div className="Page-Row-Text">
              <h1>{this.props.langs.account}</h1>
              <p> {this.props.langs.account_description}</p>
            </div>
          </div>
        </div>
        <div className="Page-Block">
          <div className="Page-Row" onClick={()=>{
            this.props.history.push('/account/more');
          }}>
          <Ink/>
            <figure className="Page-Row-ThumbnailText-Head">
            </figure>
            <div className="Page-Row-ThumbnailText-Text">
              <h2>{this.props.mymeta.username?this.props.mymeta.username:(this.props.mymeta.n?this.props.mymeta.n:this.props.langs.guest)}</h2>
              <p> {this.props.mymeta.b?this.props.mymeta.b:'You have no bio.'}</p>
            </div>
          </div>
          <div className="Page-Row" onClick={()=>{
            this.props.history.push('/account/editbio');
          }}>
          <Ink/>
            <div className="Page-Row-Text">
              <h2>{this.props.langs.bio}</h2>
              <p> {this.props.mymeta.b}</p>
            </div>
          </div>
          <div className="Page-Row">
            <div className="Page-Row-Text">
              <h2>{this.props.langs.active_status}</h2>
              <Select value={this.props.mymeta.a} onChange={evt => {
                this.updateActivity(evt.target.value);
              }}>
                <MenuItem key={0} value={0}>{"active"}</MenuItem>
                <MenuItem key={1} value={1}>{"deactive"}</MenuItem>
              </Select>
            </div>
          </div>
          <div className="Page-Row">
          <Ink/>
            <div className="Page-Row-Text">
              <h2>{this.props.langs.blocked_user}</h2>
              <p> {"click to edit."}</p>
            </div>
          </div>

        </div>
        <div className="Page-Block" onClick={()=> {this.props.logout()}}>
          <div className="Page-Row">
          <Ink/>
            <div className="Page-Row-Text">
              <h2>{this.props.langs.logout}</h2>
              <p> {"logout your account"}</p>
            </div>
          </div>
          <div className="Page-Row" onClick={()=> {this.props.history.push('/noservice/signin')}}>
          <Ink/>
            <div className="Page-Row-Text">
              <h2>{this.props.langs.switch_account}</h2>
              <p> {"switch your account"}</p>
            </div>
          </div>
        </div>
        <div className="Page-Block">
          <a href={CONSTANTS.NOSERVICE_NOUSER_URL} target="_blank">
            <div className="Page-Row">
            <Ink/>
              <div className="Page-Row-Text">
                <h2>{this.props.langs.account_info}</h2>
                <p> {this.props.langs.account_info_description}</p>
              </div>
            </div>
          </a>
        </div>
        <div className="Page-Block">
          <a href={CONSTANTS.OPENSOURCE_URL} target="_blank">
            <div className="Page-Row">
            <Ink/>
              <div className="Page-Row-Text">
                <h2>{"Open Source"}</h2>
                <p> {"view our shared opensource code "}</p>
              </div>
            </div>
          </a>
          <a href="https://nooxy.org" target="_blank">
            <div className="Page-Row">
            <Ink/>
              <div className="Page-Row-Text">
                <h2>{"NOOXY Talk Client"}</h2>
                <p> {"ver. "+this.props.version+" copyright(c)2017-2019 NOOXY inc."}</p>
              </div>
            </div>
          </a>
        </div>
        <Route exact path="/account/editbio" render={(props)=>{
          return(
            <Box history={props.history}>
            <BackPage title="New Bio" history={props.history}>
                <EditTextPage title={this.props.langs.bio} description="Enter your bio to let people know what you are thinking." text={this.props.mymeta.b} onFinish={this.updateBio}/>
            </BackPage>
            </Box>
          );
        }}/>

        <Route exact path="/account/more" render={(props)=>{
          console.log(this.props.mymeta);
          return(
            <Box history={props.history}>
              <BackPage title={this.props.langs.about_you} history={props.history}>
                <div className="Page">
                  <div className="Page-Block">
                    <div className="Page-Row">
                    <Ink/>
                      <div className="Page-Row-Text">
                        <h1>{this.props.langs.about_you}</h1>
                        <p> {'Here are the detail information of your accout.'}</p>
                      </div>
                    </div>
                    <div className="Page-Row">
                    <Ink/>
                      <div className="Page-Row-Text">
                        <h2>{this.props.langs.displayname}</h2>
                        <p> {this.props.mymeta.displayname}</p>
                      </div>
                    </div>
                    <div className="Page-Row">
                    <Ink/>
                      <div className="Page-Row-Text">
                        <h2>{this.props.langs.about_you}</h2>
                        <p> {this.props.mymeta.aboutme}</p>
                      </div>
                    </div>
                    <div className="Page-Row">
                    <Ink/>
                      <div className="Page-Row-Text">
                        <h2>{this.props.langs.country}</h2>
                        <p> {this.props.mymeta.country}</p>
                      </div>
                    </div>
                    <div className="Page-Row">
                    <Ink/>
                      <div className="Page-Row-Text">
                        <h2>{this.props.langs.phone}</h2>
                        <p> {this.props.mymeta.phonenumber}</p>
                      </div>
                    </div>
                    <div className="Page-Row">
                    <Ink/>
                      <div className="Page-Row-Text">
                        <h2>{this.props.langs.email}</h2>
                        <p> {this.props.mymeta.email}</p>
                      </div>
                    </div>
                    <div className="Page-Row">
                    <Ink/>
                      <div className="Page-Row-Text">
                        <h2>{'UserId'}</h2>
                        <p> {this.props.mymeta.i}</p>
                      </div>
                    </div>
                    <div className="Page-Row">
                    <Ink/>
                      <div className="Page-Row-Text">
                        <h2>{'JoinDate'}</h2>
                        <p> {this.props.mymeta.j}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </BackPage>
            </Box>
          );
        }}/>
      </div>

    );
  }
};

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
              <h2>{this.props.usermeta.username?this.props.usermeta.username:(this.props.usermeta.n?this.props.usermeta.n:this.props.langs.guest)}</h2>
              <p> {this.props.usermeta.b?this.props.usermeta.b:'Have no bio.'}</p>
            </div>
          </div>
          <div className="Page-Row">
          <Ink/>
            <div className="Page-Row-Text">
              <h2>{this.props.langs.bio}</h2>
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
    if(r==0) {
      return("This account is in your contact.")
    }
    else if (r==2) {
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
      if(this.props.usermeta&&this.props.contacts&&this.props.contacts[i].ToUserId==this.props.usermeta.userid) {
        if(this.props.contacts[i].Type==0) {
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
        <div className="Page-Row" onClick={()=> {this.props.addContacts([this.props.usermeta.userid], 0)}}>
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
        <div className="Page-Row" onClick={()=> {this.props.addContacts([this.props.usermeta.userid], 1)}}>
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
