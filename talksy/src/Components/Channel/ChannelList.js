import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import Ink from 'react-ink';

import AddCircleIcon from '@material-ui/icons/AddCircle';

export class ChannelList extends Component {
  constructor (props) {
    super(props);
    this.rootpath = props.rootpath;
  };

  renderUnreadCount(count) {
    if(count>0) {
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

  renderLastMessages(chmeta) {
    if(chmeta.Messages&&Object.keys(chmeta.Messages).length>0) {
      let lastmsg = chmeta.Messages[Object.keys(chmeta.Messages)[Object.keys(chmeta.Messages).length-1]];
      if(this.props.users[lastmsg[0]]) {
        return(this.props.users[lastmsg[0]].username+': '+lastmsg[2])
      }
      else {
        this.props.actions.getUserMeta(lastmsg[0]);
        return(lastmsg[2])
      }
    }
    else if (chmeta.Description){
      return(chmeta.Description)
    }
    else {
      return(null)
    }
  }

  renderRows() {
    let elems = [];
    for(let key in this.props.channels) {
      let _ll = this.props.channels[key]['Messages']?Object.keys(this.props.channels[key]['Messages']).sort((a,b)=>{return b - a;})[0]:0;
      let _lrl = this.props.channels[key]['LatestReadline']?this.props.channels[key]['LatestReadline']:0;
      elems.push(
          <Link to={this.props.match.params.channel_root+key}>
            <div key={key} className={this.props.selected===key?"ChList-Row-selected":"ChList-Row"}>
              <Ink />
              <figure className="Page-Row-ThumbnailText-Head">
              </figure>
              <div className="Page-Row-ThumbnailText-Text">
                <h2>{this.props.channels[key].Displayname}</h2>
                <p>{this.renderLastMessages(this.props.channels[key])}</p>
              </div>
              {this.renderUnreadCount(_ll-_lrl)}
            </div>
          </Link>
      );
    }
    if(!this.props.channels||Object.keys(this.props.channels).length == 0) {
      return(
        [
        <div className="Page-Row">
        <Ink/>
          <div className="Page-Row-Text">
            <h2>{"You have no channels"}</h2>
            <p>{"Click create channel to create new channel."}</p>
          </div>
        </div>
        // ,
        // <div className="Page-Row">
        //   <div className="Page-Row-Text">
        //     <h2>{"Create"}</h2>
        //     <p>{"Click create channel to create new channel."}</p>
        //   </div>
        // </div>
        // ,
        // <div className="Page-Row">
        //   <div className="Page-Row-Text">
        //     <h2>{"Explore"}</h2>
        //     <p>{"Click TrendingPage to explore what people are talking about."}</p>
        //   </div>
        // </div>
        ]
      )
    }
    else {
      return elems;
    }
  };

  render() {
    return(
      <div className="ChList-Rows" >
        <div className="Page-Block">
          <div className="Page-Row">
          <Ink/>
            <div className="Page-Row-Text">
              <h1>{this.props.localize.channels}</h1>
              <p> {this.props.localize.channellist_description}</p>
            </div>
          </div>
          <Link to={this.props.match.params.channel_root+'new'}>
            <div className="Page-Row">
              <Ink />
              <div className="Page-Row-Button">
                <span>{this.props.localize.new_channels}</span><AddCircleIcon className="material-icons"/>
              </div>
            </div>
          </Link>
        </div>
        <div className="Page-Block">
          {this.renderRows(this.props)}
        </div>
      </div>
    );
  }
}
