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
      this.state.messeges = props.data.messeges;
      this.state.id = props.data.id;
    }
  }

  renderMesseges() {
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
            <i className="material-icons">expand_more</i>
          </div>
            {"Channel_ID: " + (this.state.id)}
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

class FriendPage extends Component {
  constructor(props) {
    super(props);
    // this.state = {
    //   messeges: props.messeges
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
          <figure className="User-Head">
          </figure>
          <div className="User-Text">
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
            <figure className="User-Head">

            </figure>
            <div className="User-Text">
              {"NOOXY User"}
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
          <div className="Page-Row">
            <div className="Page-Row-Text">
              <h2>{"Open Source"}</h2>
              <p> {"https://github.com/NOOXY-Research/"}</p>
            </div>
          </div>
          <div className="Page-Row">
            <div className="Page-Row-Text">
              <h2>{"NOOXY Talk Client"}</h2>
              <p> {"ver. alpha. copyright(c)2017-2018 NOOXY inc."}</p>
            </div>
          </div>
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

  renderRows() {
    let elems = [];
    for(let key in this.state.channels) {
      elems.push(
          <div key={key} className={this.props.selected===key?"ChList-Row-selected":"ChList-Row"} onClick={()=>{this.props.onSelect(key, this.props.history)}}>
            <div className="ChList-Row-ChName">
              {this.state.channels[key][0]}
            </div>
            <div className="ChList-Row-ChMore">
              {this.state.channels[key][1]}
            </div>
            <div className="ChList-Row-ChUnread">
              {this.state.channels[key][2]}
            </div>
          </div>
      );
    }
    return elems;
  };

  render() {
    return(
      <div className="ChList-Rows">
        <div className="ChList-Header">
          <span>new messeges </span><i className="material-icons">add_circle</i>
        </div>
        {this.renderRows()}
      </div>
    );
  }
}

class HeaderPage extends Component {
  constructor (props) {
    super(props);
    this.state = {
      headertitle: "NoTalk",
      headerbuttons: [
        ['messeges', '/messeges/', 'chat'],
        ['friends', '/friends/', 'people'],
        ['account', '/account/', 'account_circle']
      ],
      selectedheaderbuttons: window.location.href.split('/')[0]
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
    let msglistroot = "/messeges/";
    super(props);
    this.state = {
      msglistroot: msglistroot,
      messeges: {
        channelnow: window.location.href.split(msglistroot)[1],
        chlist: {
          'ch1': ['Channel1', 'lastmsg', 23, {1: ['NOOXY', 'text', 'hello', 0]}],
          'ch2': ['Channel2', 'lastmsg', 23],
          'ch3': ['Channel3', 'lastmsg', 23],
          'ch4': ['Channel4', 'lastmsg', 23],
          'ch5': ['Channel5', 'lastmsg', 23],
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
            id: 'ch1'
          }
        }
      }
    }

    this.onSelectCh = (chid, history)=> {
      this.setState((prevState) => {
        let messeges_state = prevState.messeges;
        messeges_state.channelnow = chid;
        history.push(msglistroot+chid);
        return { messeges: messeges_state}
      })
    }
  }

  renderChannels(props) {
    let elems = [];
    for(let key in this.state.messeges.chlist) {
      elems.push(
        <ChPage key={key}
          data={this.state.messeges.chsdata[key]}
          show={this.state.messeges.channelnow==key}
          match={props.match} history={props.history}
          rootpath={this.state.msglistroot}
        />
      );
    }
    return elems;
  }



  render() {
    // let HeaderPageReg = '/:page([^/]*)';
    // let ChPageReg = '/messeges/:id([0-9]+)';
    let HeaderPageReg = '/:page(.*)';
    return (
      <Router>
        <div>
          <Route exact path={HeaderPageReg} render={(props)=>{

            return(
              <HeaderPage history={props.history}>
                <Route exact path=":path(/|/messeges/)" render={(props)=>{
                  return (
                    <ChList
                    onSelect={this.onSelectCh}
                    chlist={this.state.messeges.chlist}
                    history={props.history}
                    selected={props.match.params.id}
                    rootpath={this.state.msglistroot}/>
                  )
                }}/>
                <Route exact path={this.state.msglistroot+':id(.+)'} render={(props)=>{
                  return(
                    <SplitComp show={true}>
                      <SplitLeft>
                        <ChList
                        onSelect={this.onSelectCh}
                        chlist={this.state.messeges.chlist}
                        history={props.history}
                        selected={props.match.params.id}
                        rootpath={this.state.msglistroot}/>
                      </SplitLeft>
                      <SplitRight>
                        {this.renderChannels(props)}
                      </SplitRight>
                    </SplitComp>
                  )
                }}/>
                <Route exact path='/friends' component={FriendPage}/>
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
