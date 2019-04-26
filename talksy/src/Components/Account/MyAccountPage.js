import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { Box, SplitComp, BackPage, EditTextPage, EditListPage, AddToListPage, SplitLeft, SplitRight} from "../BaseComponent";
import Ink from 'react-ink';

import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

const CONSTANTS = require('../../constants.json');

const NOSERVICE_NOUSER_URL = CONSTANTS.NOSERVICE_NOUSER_URL;

export class MyAccountPage extends Component {
  constructor(props) {
    super(props);
  };

  updateBio = (newbio)=> {
    this.props.actions.updateMyMeta({b:newbio})
    this.props.history.push('/account/');
  };

  updateActivity = (level)=> {
    this.props.actions.updateMyMeta({a:level})
    this.props.history.push('/account/');
  };

  render() {
    return(
      <div className="Page Page-Root">
        <div className="Page-Block">
          <div className="Page-Row">
          <Ink/>
            <div className="Page-Row-Text">
              <h1>{this.props.localize.account}</h1>
              <p> {this.props.localize.account_description}</p>
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
              <h2>{this.props.my_user_meta.username?this.props.my_user_meta.username:(this.props.my_user_meta.n?this.props.my_user_meta.n:this.props.localize.guest)}</h2>
              <p> {this.props.my_user_meta.b?this.props.my_user_meta.b:'You have no bio.'}</p>
            </div>
          </div>
          <div className="Page-Row" onClick={()=>{
            this.props.history.push('/account/editbio');
          }}>
          <Ink/>
            <div className="Page-Row-Text">
              <h2>{this.props.localize.bio}</h2>
              <p> {this.props.my_user_meta.b}</p>
            </div>
          </div>
          <div className="Page-Row">
            <div className="Page-Row-Text">
              <h2>{this.props.localize.active_status}</h2>
              <Select value={this.props.my_user_meta.a} onChange={evt => {
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
              <h2>{this.props.localize.blocked_user}</h2>
              <p> {"click to edit."}</p>
            </div>
          </div>

        </div>
        <div className="Page-Block" onClick={()=> {this.props.actions.logout()}}>
          <div className="Page-Row">
          <Ink/>
            <div className="Page-Row-Text">
              <h2>{this.props.localize.logout}</h2>
              <p> {"logout your account"}</p>
            </div>
          </div>
          <div className="Page-Row" onClick={()=> {this.props.history.push('/noservice/signin')}}>
          <Ink/>
            <div className="Page-Row-Text">
              <h2>{this.props.localize.switch_account}</h2>
              <p> {"switch your account"}</p>
            </div>
          </div>
        </div>
        <div className="Page-Block">
          <a href={CONSTANTS.NOSERVICE_NOUSER_URL} target="_blank">
            <div className="Page-Row">
            <Ink/>
              <div className="Page-Row-Text">
                <h2>{this.props.localize.account_info}</h2>
                <p> {this.props.localize.account_info_description}</p>
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
                <EditTextPage title={this.props.localize.bio} description="Enter your bio to let people know what you are thinking." text={this.props.my_user_meta.b} onFinish={this.updateBio}/>
            </BackPage>
            </Box>
          );
        }}/>

        <Route exact path="/account/more" render={(props)=>{
          console.log(this.props.my_user_meta);
          return(
            <Box history={props.history}>
              <BackPage title={this.props.localize.about_you} history={props.history}>
                <div className="Page">
                  <div className="Page-Block">
                    <div className="Page-Row">
                    <Ink/>
                      <div className="Page-Row-Text">
                        <h1>{this.props.localize.about_you}</h1>
                        <p> {'Here are the detail information of your accout.'}</p>
                      </div>
                    </div>
                    <div className="Page-Row">
                    <Ink/>
                      <div className="Page-Row-Text">
                        <h2>{this.props.localize.displayname}</h2>
                        <p> {this.props.my_user_meta.displayname}</p>
                      </div>
                    </div>
                    <div className="Page-Row">
                    <Ink/>
                      <div className="Page-Row-Text">
                        <h2>{this.props.localize.about_you}</h2>
                        <p> {this.props.my_user_meta.aboutme}</p>
                      </div>
                    </div>
                    <div className="Page-Row">
                    <Ink/>
                      <div className="Page-Row-Text">
                        <h2>{this.props.localize.country}</h2>
                        <p> {this.props.my_user_meta.country}</p>
                      </div>
                    </div>
                    <div className="Page-Row">
                    <Ink/>
                      <div className="Page-Row-Text">
                        <h2>{this.props.localize.phone}</h2>
                        <p> {this.props.my_user_meta.phonenumber}</p>
                      </div>
                    </div>
                    <div className="Page-Row">
                    <Ink/>
                      <div className="Page-Row-Text">
                        <h2>{this.props.localize.email}</h2>
                        <p> {this.props.my_user_meta.email}</p>
                      </div>
                    </div>
                    <div className="Page-Row">
                    <Ink/>
                      <div className="Page-Row-Text">
                        <h2>{'UserId'}</h2>
                        <p> {this.props.my_user_meta.i}</p>
                      </div>
                    </div>
                    <div className="Page-Row">
                    <Ink/>
                      <div className="Page-Row-Text">
                        <h2>{'JoinDate'}</h2>
                        <p> {this.props.my_user_meta.j}</p>
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
