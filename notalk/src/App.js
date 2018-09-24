import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import logo from './logo.png';
import './App.css';

class SplitComp extends Component {
  render() {
    if(this.props.show) {
      return(
        <div className="SplitComp">
          {this.props.children}
        </div>
      );
    }
    else {
      return null;
    }
  }
}

class SplitRight extends Component {
  render() {
    return(
      <div className="SplitRight">
        {this.props.children}
      </div>
    );
  }
}

class SplitLeft extends Component {
  render() {
    return(
      <div className="SplitLeft">
        {this.props.children}
      </div>
    );
  }
}

class ChPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: 'NOOXY'
    };
    if(props.data) {
      this.state.channels = props.data.channels;
      this.state.id = props.data.id;
    }
  }

  renderchannels() {
    let elems = [];
    for(let key in this.state.channels) {
      let align = 'left';
      if(this.state.channels[key][0]==this.state.user) {
        align = 'right';
      }
      elems.push(
        <div key={key} className="ChPage-Messege" style={{'textAlign': align}}>
          <div className="ChPage-Bubble" >
            <div className="ChPage-Bubble-Title">{this.state.channels[key][0]}</div>
            <div className="ChPage-Bubble-Text">{this.state.channels[key][2]}</div>
            <div className="ChPage-Bubble-Date">{this.state.channels[key][3]}</div>
          </div>
        </div>
      );
    }
    return elems;
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
          <div className="ChPage-Header-right-Button">
            <i className="material-icons">expand_more</i>
          </div>
            {"Channel_ID: " + (this.state.id)}
          </div>
          <div className="ChPage-Messeges">
            {this.renderchannels()}
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

class NewChannelPage extends Component {
  constructor(props) {
    super(props);
  }

  renderchannels() {

  }

  render() {
    if(this.props.show) {
      return(
        <div className="Page">

          <div className="Page-Block">
            <div className="Page-Row">
              <div className="Page-Row-Text">
                <h1>{"Create a new channel"}</h1>
                <p> {"create a new Notalk channel."}</p>
              </div>
            </div>
          </div>

          <div className="Page-Block">
            <div className="Page-Row">
              <div className="Page-Row-Text">
                <h2>{"Channel's Name"}</h2>
                <input placeholder="Enter your channel's name" className="ChPage-Sender-Input"></input>
              </div>
            </div>
            <div className="Page-Row">
              <div className="Page-Row-Text">
                <h2>{"Description"}</h2>
                <input placeholder="Enter your description" className="ChPage-Sender-Input"></input>
              </div>
            </div>
            <div className="Page-Row">
              <div className="Page-Row-Text">
                <h2>{"Visability"}</h2>
                <p> {"Public"}</p>
              </div>
            </div>
            <div className="Page-Row">
              <div className="Page-Row-Text">
                <h2>{"Type"}</h2>
                <p> {"Live Chat"}</p>
              </div>
            </div>
            <div className="Page-Row">
              <div className="Page-Row-Text">
                <h2>{"Users"}</h2>
                <p> {"click to edit."}</p>
              </div>
            </div>
          </div>

          <div className="Page-Block">
            <div className="Page-Row">
              <div className="Page-Row-Text">
                <h2>{"Create"}</h2>
                <p> {"create this channel"}</p>
              </div>
            </div>
            <div className="Page-Row">
              <div className="Page-Row-Text">
                <h2>{"Cancel"}</h2>
                <p> {"Do not create this channel"}</p>
              </div>
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

class ContactsPage extends Component {
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
        <div className="Page-Block">
          <div className="Page-Row">
            <div className="Page-Row-Text">
              <h1>{"Contacts"}</h1>
              <p> {"Start a new Notalk channel by your contacts."}</p>
            </div>
          </div>
          <div className="Page-Row">
            <div className="Page-Row-Button">
              <span>add contact </span><i className="material-icons">add_circle</i>
            </div>
          </div>
        </div>
        <div className="Page-Block">
          {this.renderUsers()}
        </div>
      </div>
    );
  }
};

class SettingsPage extends Component {
  render() {
    return(
      <div className="">
        {"settings"}
      </div>
    );
  }
};

class AccountPage extends Component {
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
          <div className="Page-Row">
            <figure className="Page-Row-ThumbnailText-Head">

            </figure>
            <div className="Page-Row-ThumbnailText-Text">
              <h2>{"NOOXY User"}</h2>
              <p> {"Simple Clear Elegent"}</p>
            </div>
          </div>
          <div className="Page-Row">
            <div className="Page-Row-Text">
              <h2>{"Bio"}</h2>
              <p> {"Simple Clear Elegent"}</p>
            </div>
          </div>
          <div className="Page-Row">
            <div className="Page-Row-Text">
              <h2>{"Active status"}</h2>
              <p> {"Show"}</p>
            </div>
          </div>
          <div className="Page-Row">
            <div className="Page-Row-Text">
              <h2>{"Blocked Users"}</h2>
              <p> {"click to edit."}</p>
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
      </div>
    );
  }
};

class ChList extends Component {
  constructor (props) {
    super(props);
    this.rootpath = props.rootpath;
    this.state = {
      channels: props.chlist
    }
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
    for(let key in this.state.channels) {
      elems.push(
          <div key={key} className={this.props.selected===key?"ChList-Row-selected":"ChList-Row"} onClick={()=>{this.props.onSelect(key, this.props.history)}}>
            <figure className="Page-Row-ThumbnailText-Head">
            </figure>
            <div className="Page-Row-ThumbnailText-Text">
              <h2>{this.state.channels[key][0]}</h2>
              <p>{this.state.channels[key][1]}</p>
            </div>
            {this.renderUnreadCount(this.state.channels[key][2])}
          </div>
      );
    }
    return elems;
  };

  render() {
    return(
      <div className="ChList-Rows" >
        <div className="ChList-Header" onClick={()=>{this.props.onSelect('new', this.props.history)}}>
          <span>new channel </span><i className="material-icons">add_circle</i>
        </div>
        {this.renderRows()}
      </div>
    );
  }
}

class HeaderPage extends Component {
  constructor (props) {
    super(props);
    let regex_result = /(http[s]?:\/\/)?([^\/\s]+)\/([^\/\s]+)[\/]?(.*)/g.exec(window.location.href);
    this.state = {
      headertitle: "NoTalk",
      headerbuttons: [
        ['channels', '/channels/', 'chat'],
        ['contacts', '/contacts/', 'people'],
        ['account', '/account/', 'account_circle']
      ],
      selectedheaderbuttons: regex_result?regex_result[3]:'channels'
    }
  };

  renderHeaderBar() {
    return(
      this.state.headerbuttons.map((button)=>{
        return(
            <div key={button[0]}
              className={button[0]===this.state.selectedheaderbuttons?"HeaderPage-header-bar-button-selected":"HeaderPage-header-bar-button"}
              onClick={()=>{
                this.setState({selectedheaderbuttons: button[0]});
                this.props.history.push(button[1]);
              }}
            >
              <i className="material-icons">{button[2]}</i>
            </div>
        );
      })
    );
  };

  render() {
    return (
      <div className="HeaderPage">
        <header className="HeaderPage-header">
          <h1 className="HeaderPage-title"><img height="32px" src={logo}/> {this.state.headertitle} </h1>
          <div className="HeaderPage-header-bar">
            {this.renderHeaderBar()}
          </div>
        </header>
        {this.props.children}
      </div>
    );
  }
}

class App extends Component {
  constructor (props) {
    let channelroot = "/channels/";
    super(props);
    this.state = {
      channelroot: channelroot,
      channels: {
        channelnow: window.location.href.split(channelroot)[1],
        chlist: {
          'ch1': ['Channel1', 'lastmsg', 23, {1: ['NOOXY', 'text', 'hello', 0]}],
          'ch2': ['Channel2', 'lastmsg', 23],
          'ch3': ['Channel3', 'lastmsg', 23],
          'ch4': ['Channel4', 'lastmsg', 23],
          'ch5': ['Channel5', 'lastmsg', null],
          'ch6': ['Channel6', 'lastmsg', 23],
          'ch7': ['Channel7', 'lastmsg', 23],
          'ch8': ['Channel8', 'lastmsg', 23],
          'ch9': ['Channel9', 'lastmsg', 23],
          'ch10': ['Chanel10', 'yves: lastmsg', 1]
        },
        chsdata: {
          'ch1': {
            channels: {
              1: ['NOOXY', 'text', 'hellohellohellohellohellohellohell ohellohellohellohellohello hellohellohellohellohello', '12:00'],
              2: ['NOOXY', 'text', 'hellohel', '12:00'],
              3: ['NOOXY', 'text', 'hellohel', '12:00'],
              4: ['NOOXY', 'text', 'helloasdfasdfhel', '12:00'],
              5: ['NOOXY', 'text', 'hellohel', '12:00'],
              6: ['NOOXY', 'text', 'helloasdfhel', '12:00'],
              7: ['Yves', 'text', 'hellohasdfadsel', '12:00'],
              8: ['NOOXY', 'text', 'hellohel', '12:00'],
              9: ['NOOXY', 'text', 'hellohel', '12:00'],
              10: ['NOOXY', 'text', 'hellohel', '12:00'],
              11: ['NOOXY', 'text', 'hellasdfsadfdohel', '12:00'],
            },
            id: 'ch1'
          }
        }
      }
    }

    this.onSelectCh = (chid, history)=> {
      this.setState((prevState) => {
        // if(chid!='new') {
          let channels_state = prevState.channels;
          channels_state.channelnow = chid;
          history.push(channelroot+chid);
          return { channels: channels_state}
        // }
        // else {
        //   let channels_state = prevState.channels;
        //   channels_state.channelnow = null;
        //   history.push('/newmessege');
        //   return { channels: channels_state}
        // }
      })
    }
  }

  renderChannels(props) {
    let elems = [];
    for(let key in this.state.channels.chlist) {
      elems.push(
        <ChPage key={key}
          data={this.state.channels.chsdata[key]}
          show={this.state.channels.channelnow==key}
          match={props.match} history={props.history}
          rootpath={this.state.channelroot}
        />
      );
    }
    return elems;
  }



  render() {
    // let HeaderPageReg = '/:page([^/]*)';
    // let ChPageReg = '/channels/:id([0-9]+)';
    let HeaderPageReg = ':page(.*)';
    return (
      <Router>
        <div>
          <Route exact path={HeaderPageReg} render={(props)=>{

            return(
              <HeaderPage history={props.history}>
                <Route exact path=":path(/|/channels/)" render={(props)=>{
                  return (
                    <ChList
                    onSelect={this.onSelectCh}
                    chlist={this.state.channels.chlist}
                    history={props.history}
                    selected={props.match.params.id}
                    rootpath={this.state.channelroot}/>
                  )
                }}/>
                <Route exact path={this.state.channelroot+':id(.+)'} render={(props)=>{
                  return(
                    <SplitComp show={true}>
                      <SplitLeft>
                        <ChList
                        onSelect={this.onSelectCh}
                        chlist={this.state.channels.chlist}
                        history={props.history}
                        selected={props.match.params.id}
                        rootpath={this.state.channelroot}/>
                      </SplitLeft>
                      <SplitRight>
                        <NewChannelPage show={this.state.channels.channelnow=='new'} />
                        {this.renderChannels(props)}
                      </SplitRight>
                    </SplitComp>
                  )
                }}/>
                <Route exact path='/contacts' component={ContactsPage}/>
                <Route exact path='/settings' component={SettingsPage}/>
                <Route exact path='/account' component={AccountPage}/>
              </HeaderPage>
            );
          }}/>
        </div>
      </Router>
    );
  }
}

export default App;
