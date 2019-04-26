import React, { Component } from 'react';
import Ink from 'react-ink';

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
      <div className="Page Page-Root">
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
