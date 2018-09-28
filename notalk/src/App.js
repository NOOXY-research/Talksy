import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import NSClient from './NSc.js';
import logo from './logo.png';
import './App.css';
const NSc = new NSClient();
// EditListPage

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

class BackPage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
      return(
        <div className="BackPage">
          <div className="BackPage-Header">
            <div className="BackPage-Back-Button"
            onClick={()=>{
              console.log(this.props.history);
              this.props.history.goBack()
            }}>
              <i className="material-icons">arrow_back</i>
            </div>
            {(this.props.title)}
          </div>

          <div className="BackPage-Contain">
            {this.props.children}
          </div>
        </div>
      );
    }
}

class AddToListPage extends Component {
  constructor(props) {
    super(props);
    // this.state = {
    //   channels: props.channels
    // };
    this.state = {
      list: []
    };
  }

  render() {
    return(
      <div className="Page">
        <div className="Page-Block">
          <div className="Page-Row">
            <div className="Page-Row-Text">
              <h1>{this.props.title}</h1>
              <p> {this.props.description}</p>
            </div>
          </div>
          <div className="Page-Row">
            <div className="Page-Row-Text">
              <h2>{"Add item"}</h2>
              <input placeholder="input here" className="ChPage-Sender-Input"></input>
            </div>
          </div>
          <div className="Page-Row">
            <div className="Page-Row-Button">
              <span>Add </span><i className="material-icons">add_circle</i>
            </div>
          </div>
        </div>

        <div className="Page-Block">
        <div className="Page-Row">
          <div className="Page-Row-Text">
            <h1>{"Items"}</h1>
            <p> {"All your items are below."}</p>
          </div>
        </div>
        </div>

      </div>
    );
  }
};

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
      this.state.messeges = props.data.messeges;
      this.state.id = props.data.id;
      this.state.displayname = props.data.displayname;
    }
  }

  renderchannels() {
    let elems = [];
    for(let key in this.state.messeges) {
      let align = 'left';
      if(this.state.messeges[key][0]==this.state.user) {
        align = 'right';
      }
      elems.push(
        <div key={key} className="ChPage-Messege" style={{'textAlign': align}}>
          <div className="ChPage-Bubble" >
            <div className="ChPage-Bubble-Title">{this.state.messeges[key][0]}</div>
            <div className="ChPage-Bubble-Text">{this.state.messeges[key][2]}</div>
            <div className="ChPage-Bubble-Date">{this.state.messeges[key][3]}</div>
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
            <i className="material-icons">settings</i>
          </div>
            {(this.state.displayname)}
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
      }
    };
  }

  renderTypes() {
    let elems = [];
    for(let key in this.state.types) {
      elems.push(
          <option value={key}>{this.state.types[key]}</option>
      );
    }
    return (<select>{elems}</select>);
  }

  renderLevels() {
    let elems = [];
    for(let key in this.state.levels) {
      elems.push(
          <option value={key}>{this.state.levels[key]}</option>
      );
    }
    return (<select>{elems}</select>);
  }

  render() {
    if(this.props.show) {
      return(
        <div className="Page">
          <Route exact path="/channels/new" render={(props)=>{
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
                      <input placeholder="Enter your channel's name" className="ChPage-Sender-Input"></input>
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
                      <input placeholder="Enter your description" className="ChPage-Sender-Input"></input>
                    </div>
                  </div>
                  <div className="Page-Row">
                    <div className="Page-Row-Text">
                      <h2>{"Level"}</h2>
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
                    let status = this.props.onChCreate()
                    if(status=='') {
                      this.props.history.push('/');
                    }
                    else {
                      this.setState({'status':status});
                    }

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
              <BackPage history={props.history} title="add users">
                <AddToListPage title="Add users" description="Add users for your channels." list={this.state.userlist}/>
              </BackPage>
            )
          }}/>
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
        <Route exact path="/contacts/" render={(props)=>{
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
            <BackPage title="New Contact" history={props.history}/>
          )
        }}/>
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

class TrendingPage extends Component {
  render() {
    return(
      <div className="Page">
        <div className="Page-Block">
          <div className="Page-Row">
            <div className="Page-Row-Text">
              <h1>{"Trending"}</h1>
              <p> {"Knowing what's people are taking about."}</p>
            </div>
          </div>
        </div>

        <div className="Page-Block">
          <div className="Page-Row">
            <div className="Page-Row-Text">
              <h1>{"Global"}</h1>
              <p> {"Knowing what's people are taking about."}</p>
            </div>
          </div>
          <div className="Page-Row">
            <div className="Page-Row-Text">
              <h2>{"#Whatever"}</h2>
              <p> {"some talk."}</p>
            </div>
          </div>
          <div className="Page-Row">
            <div className="Page-Row-Text">
              <h2>{"#Whatever"}</h2>
              <p> {"some talk."}</p>
            </div>
          </div>
        </div>

        <div className="Page-Block">
          <div className="Page-Row">
            <div className="Page-Row-Text">
              <h1>{"Your Contacts"}</h1>
              <p> {"Knowing what's people are taking about."}</p>
            </div>
          </div>
          <div className="Page-Row">
            <div className="Page-Row-Text">
              <h2>{"#Whatever"}</h2>
              <p> {"some talk."}</p>
            </div>
          </div>
          <div className="Page-Row">
            <div className="Page-Row-Text">
              <h2>{"#Whatever"}</h2>
              <p> {"some talk."}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

class DebugPage extends Component {
  constructor(props) {
    super(props);
  }

  renderLogs() {
    let elems = [];
    for(let key in this.props.logs) {
      console.log(this.props.logs);
      elems.push(
          <div key={key} className="Page-Row">
            <div className="Page-Row-Text">
              <h2>{'ln['+key+'] '+(this.props.logs[key])[0]}</h2>
              <p>{(this.props.logs[key])[1]}</p>
            </div>
          </div>
      );
    }
    return (elems);
  }

  render() {
    return(
      <div className="Page">
        <div className="Page-Block">
          <div className="Page-Row">
            <div className="Page-Row-Text">
              <h1>{"Debug"}</h1>
              <p> {"here are the debug logs."}</p>
            </div>
          </div>
        </div>

        <div className="Page-Block">
        {this.renderLogs()}
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

class HeaderPage extends Component {
  constructor (props) {
    super(props);
    let regex_result = /(http[s]?:\/\/)?([^\/\s]+)\/([^\/\s]+)[\/]?(.*)/g.exec(window.location.href);
    this.state = {
      headertitle: "NOTalk alpha",
      headerbuttons: [
        ['channels', '/channels/', 'chat'],
        ['contacts', '/contacts/', 'people'],
        ['trending', '/trending/', 'trending_up'],
        ['account', '/account/', 'account_circle'],
        ['debug', '/debug/', 'bug_report']
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
      debuglogs: [['debug', 'debug']],
      channelroot: channelroot,
      channels: {
        channelnow: window.location.href.split(channelroot)[1]?window.location.href.split(channelroot)[1].split('/')[0]: null,
        chlist: {
          'ch1': ['A Channel', 'hello?', 23, {1: ['NOOXY', 'text', 'hello', 0]}],
          'ch2': ['B Channel', 'ok', 2],
          'ch3': ['C Channel', 'hahaha', 23],
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
            messeges: {
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
            id: 'ch1',
            displayname: 'A Channel'
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

  log(title, contain) {
    this.setState((prevState) => {
      return prevState.debuglogs.push([title, contain]);
    });
  }

  componentDidMount() {
    NSc.connect('0.0.0.06', '1487');
    this.log('NSF', 'Connected to NSF.');
    NSc.createActivitySocket('NoTalk', (err, as)=>{
    this.log('NSF', 'Connected to the Service.');
    as.onData = (data) => {
      this.log('NSClient onData', data);
      // this.setState({debuglogs: this.state.debuglogs.push(['NSc', data])}) ;
    }
  });
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

  onChCreate(meta) {
    // return status
    return ""
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
                        <NewChannelPage show={this.state.channels.channelnow=='new'} onChCreate={this.onChCreate} history={props.history} />
                        {this.renderChannels(props)}
                      </SplitRight>
                    </SplitComp>
                  )
                }}/>
                <Route exact path='/contacts:path(/|/.*)' component={ContactsPage}/>
                <Route exact path='/settings' component={SettingsPage}/>
                <Route exact path='/trending' component={TrendingPage}/>
                <Route exact path='/account' component={AccountPage}/>
                <Route exact path='/debug' render={(props)=>{
                  return(
                    <DebugPage logs={this.state.debuglogs}/>
                  );
                }}/>

              </HeaderPage>
            );
          }}/>
        </div>
      </Router>
    );
  }
}

export default App;
