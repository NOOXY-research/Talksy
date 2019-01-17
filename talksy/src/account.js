
import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { BoxComp, SplitComp, BackPage, EditTextPage, EditListPage, AddToListPage, SplitLeft, SplitRight} from "./BaseComponent";


export class AccountPage extends Component {
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
    return(
      <div className="Page">
        <div className="Page-Block">
          <div className="Page-Row">
            <div className="Page-Row-Text">
              <h1>{"Account"}</h1>
              <p> {"Manage your Notalk account here."}</p>
            </div>
          </div>
        </div>
        <div className="Page-Block">
          <div className="Page-Row" onClick={()=>{
            this.props.history.push('/account/more');
          }}>
            <figure className="Page-Row-ThumbnailText-Head">

            </figure>
            <div className="Page-Row-ThumbnailText-Text">
              <h2>{this.props.mymeta.displayname?this.props.mymeta.displayname:(this.props.mymeta.n?this.props.mymeta.n:'Guest')}</h2>
              <p> {this.props.mymeta.b?this.props.mymeta.b:'You have no bio.'}</p>
            </div>
          </div>
          <div className="Page-Row" onClick={()=>{
            this.props.history.push('/account/editbio');
          }}>
            <div className="Page-Row-Text">
              <h2>{"Bio"}</h2>
              <p> {this.props.mymeta.b}</p>
            </div>
          </div>
          <div className="Page-Row">
            <div className="Page-Row-Text">
              <h2>{"Active status"}</h2>
              <select value={this.props.mymeta.a} onChange={evt => {
                this.updateActivity(evt.target.value);
              }}>
                <option key={0} value={0}>{"active"}</option>
                <option key={1} value={1}>{"deactive"}</option>
              </select>
            </div>
          </div>
          <div className="Page-Row">
            <div className="Page-Row-Text">
              <h2>{"Blocked Users"}</h2>
              <p> {"click to edit."}</p>
            </div>
          </div>

        </div>
        <div className="Page-Block" onClick={()=> {this.props.logout()}}>
          <div className="Page-Row">
            <div className="Page-Row-Text">
              <h2>{"Logout"}</h2>
              <p> {"logout your account"}</p>
            </div>
          </div>
          <div className="Page-Row" onClick={()=> {this.props.history.push('/noservice/signin')}}>
            <div className="Page-Row-Text">
              <h2>{"Switch Account"}</h2>
              <p> {"switch your account"}</p>
            </div>
          </div>
        </div>
        <div className="Page-Block">
          <a href="https://github.com/NOOXY-Research/" target="_blank">
            <div className="Page-Row">
              <div className="Page-Row-Text">
                <h2>{"Open Source"}</h2>
                <p> {"https://github.com/NOOXY-Research/"}</p>
              </div>
            </div>
          </a>
          <a href="https://nooxy.org" target="_blank">
            <div className="Page-Row">
              <div className="Page-Row-Text">
                <h2>{"NOOXY Talk Client"}</h2>
                <p> {"ver. alpha. copyright(c)2017-2018 NOOXY inc."}</p>
              </div>
            </div>
          </a>
        </div>
        <Route exact path="/account/editbio" render={(props)=>{
          return(
            <BoxComp history={props.history}>
            <BackPage title="New Bio" history={props.history}>
                <EditTextPage title="Bio" description="Enter your bio to let people know what you are thinking." text={this.props.mymeta.b} onFinish={this.updateBio}/>
            </BackPage>
            </BoxComp>
          );
        }}/>

        <Route exact path="/account/more" render={(props)=>{
          return(
            <BoxComp history={props.history}>
              <BackPage title="More about you" history={props.history}>
                <div className="Page">
                  <div className="Page-Block">
                    <div className="Page-Row">
                      <div className="Page-Row-Text">
                        <h1>{'More Info'}</h1>
                        <p> {'Here are the detail information of your accout.'}</p>
                      </div>
                    </div>
                    <div className="Page-Row">
                      <div className="Page-Row-Text">
                        <h2>{'UserId'}</h2>
                        <p> {this.props.mymeta.i}</p>
                      </div>
                    </div>
                    <div className="Page-Row">
                      <div className="Page-Row-Text">
                        <h2>{'JoinDate'}</h2>
                        <p> {this.props.mymeta.j}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </BackPage>
            </BoxComp>
          );
        }}/>
      </div>

    );
  }
};
