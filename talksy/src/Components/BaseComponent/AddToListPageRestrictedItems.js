import React, { Component } from 'react';
import Ink from 'react-ink';

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
                    if(event.key === 'Enter'){
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
