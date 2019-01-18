
import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { BoxComp, SplitComp, BackPage, EditTextPage, EditListPage, AddToListPage, SplitLeft, SplitRight} from "./BaseComponent";
import './tooltip.css';

export class ChPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: 'NOOXY'
    };
  }

  renderMesseges() {
    let elems = [];
    for(let key in this.props.channelmeta.Messeges) {
      let align = 'left';
      if(this.props.channelmeta.Messeges[key][0]==this.props.mymeta.i) {
        align = 'right';
      }
      elems.push(
        <div key={key} className="ChPage-Messege" style={{'textAlign': align}}>
          <div className="ChPage-Bubble" >
            <div className="ChPage-Bubble-Title">{this.props.channelmeta.Messeges[key][0]}</div>
            <div className="ChPage-Bubble-Text">{this.props.channelmeta.Messeges[key][2]}</div>
            <div className="ChPage-Bubble-Date">{this.props.channelmeta.Messeges[key][3]}</div>
          </div>
        </div>
      );
    }
    return elems;
  }

  renderTooltips() {
    if(this.props.channelmeta.Description) {
      return (<span className="tooltiptext tooltip-bottom">{this.props.channelmeta.Description}</span>)
    }
    else {
      return null
    }
  }

  render() {
    if(this.props.show) {
      return(
        <div className="ChPage">
          <div className="ChPage-Header">
            <div className="ChPage-Header-left-Button"
            onClick={()=>{this.props.history.push(this.props.rootpath)}}>
              <i className="material-icons">arrow_back</i>
            </div>
            <div className="tooltip ChPage-Header-right-Button">
              <i className="material-icons">settings</i>
              <span className="tooltiptext tooltip-left">Manage your channel settings</span>
            </div>
            <div className="tooltip">
              {(this.props.channelmeta.Displayname)}
              {this.renderTooltips()}
            </div>
          </div>
          <div className="ChPage-Messeges">
            {this.renderMesseges()}
          </div>
          <div className="ChPage-Sender">
            <input placeholder="input text...." className="ChPage-Sender-Input"></input>
            <div className="ChPage-Sender-Buttons">
              <div className="ChPage-Sender-Button"><i className="material-icons">send</i></div>
            </div>
          </div>
        </div>
      );
    }
    else {
      return null;
    }
  }
}

export class NewChannelPage extends Component {
  constructor(props) {
    super(props);
    this.state= {
      status: 'create a new Notalk channel.',
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
    };
    this.channelmeta = {
      t:0,
      v:1
    }
  }

  renderTypes() {
    let elems = [];
    let i=0;
    for(let key in this.state.types) {
      elems.push(
          <option key={key} value={i++}>{this.state.types[key]}</option>
      );
    }
    return (<select onChange={evt => {
      this.channelmeta.t = parseInt(evt.target.value);
    }}>{elems}</select>);
  }

  renderLevels() {
    let elems = [];
    let i=0;
    for(let key in this.state.levels) {
      elems.push(
        <option key={key} value={i++}>{this.state.levels[key]}</option>
      );
    }
    return (<select value={1} onChange={evt => {
      this.channelmeta.a = parseInt(evt.target.value);
    }}>{elems}</select>);
  }

  render() {
    if(this.props.show) {
      return(
        <div className="Page">
          <Route exact path="/channels/new:path(.*)" render={(props)=>{
            return(
              <div className="Page">
                <div className="Page-Block">
                  <div className="Page-Row">
                    <div className="Page-Row-Text">
                      <h1>{"Create a new channel"}</h1>
                      <p> {this.state.status}</p>
                    </div>
                  </div>
                </div>

                <div className="Page-Block">
                  <div className="Page-Row">
                    <div className="Page-Row-Text">
                      <h2>{"Channel's Name"}</h2>
                      <input placeholder="Enter your channel's name" className="ChPage-Sender-Input" onChange={evt => {
                        if(evt.target.value=='how2debug?') {
                          this.props.setDebug(true)
                        }
                        else {
                          this.channelmeta.n = evt.target.value;
                        }
                      }}></input>
                    </div>
                  </div>
                  <div className="Page-Row">
                    <div className="Page-Row-Text">
                      <h2>{"Channel's photo"}</h2>
                      <input type="file" name="pic" accept="image/*"/>
                    </div>
                  </div>
                  <div className="Page-Row">
                    <div className="Page-Row-Text">
                      <h2>{"Description"}</h2>
                      <input placeholder="Enter your description" className="ChPage-Sender-Input" onChange={evt => {
                        this.channelmeta.d = evt.target.value;
                      }}></input>
                    </div>
                  </div>
                  <div className="Page-Row">
                    <div className="Page-Row-Text">
                      <h2 className="">{"Access Level"}</h2>
                      <p> {this.renderLevels()}</p>
                    </div>
                  </div>
                  <div className="Page-Row">
                    <div className="Page-Row-Text">
                      <h2>{"Type"}</h2>
                      <p> {this.renderTypes()}</p>
                    </div>
                  </div>
                  <div className="Page-Row"  onClick={()=>{this.props.history.push('/channels/new/users');}}>
                    <div className="Page-Row-Text">
                      <h2>{"Users"}</h2>
                      <p> {"click to edit."}</p>
                    </div>
                  </div>
                </div>

                <div className="Page-Block">
                  <div className="Page-Row"  onClick={()=>{

                    this.props.emitChCreate(this.channelmeta, (err, meta)=> {
                      if(meta.s=='OK') {
                        this.props.history.push('/');
                        this.channelmeta = null;
                      }
                      else {
                        this.setState({'status':meta.s});
                      }
                    })

                  }}>
                    <div className="Page-Row-Text">
                      <h2>{"Create"}</h2>
                      <p> {"create this channel"}</p>
                    </div>
                  </div>
                  <div className="Page-Row" onClick={()=>{this.props.history.push('/');}}>
                    <div className="Page-Row-Text">
                      <h2>{"Cancel"}</h2>
                      <p> {"Do not create this channel"}</p>
                    </div>
                  </div>
                </div>
              </div>
            )

          }}/>

          <Route exact path="/channels/new/users" render={(props)=>{
            return(
              <BoxComp history={props.history}>
                <BackPage history={props.history} title="add users">
                  <AddToListPage title="Add users" description="Add users for your channels." list={this.state.userlist}/>
                </BackPage>
              </BoxComp>
            );
          }}/>
        </div>
      );
    }
    else {
      return null;
    }
  }
}

export class ChList extends Component {
  constructor (props) {
    super(props);
    this.rootpath = props.rootpath;
  };

  renderUnreadCount(count) {
    if(count) {
      return(
        <div className="ChList-Row-ChUnread">
          {count}
        </div>
      )
    }
    else {
      return null;
    }
  }
  renderRows() {
    let elems = [];
    for(let key in this.props.channels) {
      elems.push(
          <div key={key} className={this.props.selected===key?"ChList-Row-selected":"ChList-Row"} onClick={()=>{this.props.onSelect(key, this.props.history)}}>
            <figure className="Page-Row-ThumbnailText-Head">
            </figure>
            <div className="Page-Row-ThumbnailText-Text">
              <h2>{this.props.channels[key].Displayname.length>23?this.props.channels[key].Displayname.substring(0, 23)+"...":this.props.channels[key].Displayname}</h2>
              <p>{this.props.channels[key].LastMessage?this.props.channels[key].LastMessage:this.props.channels[key].Description}</p>
            </div>
            {this.renderUnreadCount(this.props.channels[key][2])}
          </div>
      );
    }
    return elems;
  };

  render() {
    return(
      <div className="ChList-Rows" >
        <div className="Page-Block">
          <div className="Page-Row">
            <div className="Page-Row-Text">
              <h1>{"Your channels"}</h1>
              <p> {"Here are all of your channels."}</p>
            </div>
          </div>
          <div className="Page-Row" onClick={()=>{this.props.onSelect('new', this.props.history)}}>
            <div className="Page-Row-Button">
              <span>new channel </span><i className="material-icons">add_circle</i>
            </div>
          </div>
        </div>
        <div className="Page-Block">
          {this.renderRows()}
        </div>
      </div>
    );
  }
}
