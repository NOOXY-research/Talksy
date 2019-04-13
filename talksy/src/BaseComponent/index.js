import React, { Component } from 'react';
import Ink from 'react-ink';
import './basecomp.css';

export class BoxComp extends Component {
  render() {
      return(
        <div className="BoxComp">
          <div className="BoxComp-Back" onClick={()=>{
            this.props.history.goBack()
          }}>
          <Ink/>
          </div>
          <div className="BoxComp-Box">
            {this.props.children}
          </div>
        </div>
      );
  }
};

export class PageRow extends Component {
  render() {
      return(
        <div className="Page-Row">
        <Ink/>
        {this.props.children}
        </div>
      );
  }
}

export class SplitComp extends Component {
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

export class BackPage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
      return(
        <div className="BackPage">
          <div className="BackPage-Header">
          <Ink/>
            <div className="BackPage-Back-Button"
            onClick={()=>{
              this.props.history.goBack()
            }}>
            <Ink/>
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

export class EditTextPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: props.text
    }
  }

  render() {
    return(
      <div className="Page">
        <div className="Page-Block">
          <div className="Page-Row">
          <Ink/>
            <div className="Page-Row-Text">
              <h1>{this.props.title}</h1>
              <p> {this.props.description}</p>
            </div>
          </div>
          <div className="Page-Row">
            <div className="Page-Row-Text">
              <h2>{"Enter here"}</h2>
              <input placeholder={this.props.text} className="ChPage-Sender-Input" onChange={(e) => {this.setState({text: e.target.value})}}></input>
            </div>
          </div>
          <div className="Page-Row" onClick={()=>{this.props.onFinish(this.state.text)}}>
          <Ink/>
            <div className="Page-Row-Button">
              <span>OK </span><i className="material-icons">check_circle</i>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export class AddToListPage extends Component {
  constructor(props) {
    super(props);
    // this.state = {
    //   channels: props.channels
    // };
    this.state = {
      list: this.props.list?this.props.list:[]
    };

    this.ToBeAdded = '';
    this.addItem =()=> {
      if(this.ToBeAdded&&this.ToBeAdded.length>0){
          this.resetInput();
          this.setState(prevState=> {
            return prevState.list.push(this.ToBeAdded);
          })
      }
    }
  };

  resetInput() {
    this.TextInput.value = '';
  };

  renderList() {
    let index = 0;
    return this.state.list.map(value=> {
      return(
      <div key={index++} className="Page-Row">
      <Ink/>
        <div className="Page-Row-Text">
          <h2>{value}</h2>
          <p onClick={
            ()=> {
              this.setState(prevState=> {
                let index = prevState.list.indexOf(value);
                if (index> -1) {
                  prevState.list.splice(index, 1);
                }
                return prevState
              })
            }
          }>remove</p>
        </div>
      </div>
    )
    })
  }

  render() {
    return(
      <div className="Page">
        <div className="Page-Block">
          <div className="Page-Row">
          <Ink/>
            <div className="Page-Row-Text">
              <h1>{this.props.title}</h1>
              <p> {this.props.description}</p>
            </div>
          </div>
          <div className="Page-Row">
          <Ink/>
            <div className="Page-Row-Text">
              <h2>{"Add item"}</h2>
              <input placeholder="input here" className="ChPage-Sender-Input" ref={el => this.TextInput = el}
                onKeyPress= {
                  (event)=> {
                    if(event.key == 'Enter'){
                      this.addItem()
                    }
                  }
                }
                onChange={evt=> {
                this.ToBeAdded = evt.target.value;
              }}></input>
            </div>
          </div>
          <div className="Page-Row" onClick= {this.addItem}>
            <div className="Page-Row-Button">
              <span>Add </span><i className="material-icons">add_circle</i>
            </div>
          </div>

        </div>

        <div className="Page-Block">
          {this.renderList()}
          <div className="Page-Row" onClick= {()=> {this.props.onFinish(this.state.list)}}>
            <Ink/>
            <div className="Page-Row-Button">
              <span>Finish </span><i className="material-icons">check_circle</i>
            </div>
          </div>
        </div>

      </div>
    );
  }
};

export class AddToListPageRestrictedItems extends Component {
  constructor(props) {
    super(props);
    // this.state = {
    //   channels: props.channels
    // };
    this.state = {
      list: this.props.list?this.props.list:[]
    };

    this.SearchText = '';
    this.addItem = (item)=> {
      if(item&&!this.state.list.includes(item)){
          this.resetInput();
          this.setState(prevState=> {
            return prevState.list.push(item);
          })
      }
    }
  };

  resetInput() {
    this.TextInput.value = '';
  };

  renderList() {
    let index = 0;
    return this.state.list.map(value=> {
      return(
      <div key={index++} className="Page-Row">
      <Ink/>
        <div className="Page-Row-Text">
          <h2>{value}</h2>
          <p onClick={
            ()=> {
              this.setState(prevState=> {
                let index = prevState.list.indexOf(value);
                if (index> -1) {
                  prevState.list.splice(index, 1);
                }
                return prevState
              })
            }
          }>remove</p>
        </div>
      </div>
    )
    })
  }

  renderRestrictedItems() {
    let index = 0;
    return this.props.restricteditems.map(value=> {
      return(
      <div key={index++} className="Page-Row" onClick={
        ()=> {
          this.addItem(value);
        }
      }>
        <Ink/>
        <div className="Page-Row-Text">
          <h2>{value}</h2>
          <p >{!this.state.list.includes(value)?"click to add":"the item have been added"}</p>
        </div>
      </div>
    )
    })
  }

  render() {
    return(
      <div className="Page">
        <div className="Page-Block">
          <div className="Page-Row">
          <Ink/>
            <div className="Page-Row-Text">
              <h1>{this.props.title}</h1>
              <p> {this.props.description}</p>
            </div>
          </div>
          <div className="Page-Row">
            <div className="Page-Row-Text">
              <h2>{"Search"}</h2>
              <input placeholder="search your item" className="ChPage-Sender-Input" ref={el => this.TextInput = el}
                onKeyPress= {
                  (event)=> {
                    if(event.key == 'Enter'){
                      this.addItem()
                    }
                  }
                }
                onChange={evt=> {
                  this.props.onChange(evt.target.value, this.props.restricteditems)
              }}></input>
            </div>
          </div>
          {this.renderRestrictedItems()}

        </div>

        <div className="Page-Block">
          <div className="Page-Row">
          <Ink/>
            <div className="Page-Row-Text">
              <h1>{"Your items"}</h1>
              <p> {"below are your selected items"}</p>
            </div>
          </div>
          {this.renderList()}
          <div className="Page-Row" onClick= {()=> {this.props.onFinish(this.state.list)}}>
            <Ink/>
            <div className="Page-Row-Button">
              <span>Finish </span><i className="material-icons">check_circle</i>
            </div>
          </div>
        </div>

      </div>
    );
  }
};

export class SplitRight extends Component {
  render() {
    return(
      <div className="SplitRight">
        {this.props.children}
      </div>
    );
  }
}

export class SplitLeft extends Component {
  render() {
    return(
      <div className="SplitLeft">
        {this.props.children}
      </div>
    );
  }
}
