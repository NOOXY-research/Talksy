import React, { Component } from 'react';

import Button from '@material-ui/core/Button';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import Typography from '@material-ui/core/Typography';

import AvatarEditor from 'react-avatar-editor';

import Slider from '@material-ui/lab/Slider';

export default class ImageCropperDiolog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scale: 1,
      RAWimage: null
    };
  }

  setEditorRef = (editor) => this.editor = editor;

  saveImage() {
    const canvas = this.editor.getImage();
    if(this.props.onFinish) {
      this.props.onFinish(canvas);
    }
  }

  render() {
    return(
      <Dialog open={this.props.open} onClose={()=>{this.setState({adding_new_photo: null})}} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">{'Upload you photo'}</DialogTitle>
        <DialogContent style={{'overflowX': 'hidden'}}>
        {this.state.RAWimage?<AvatarEditor
          ref={this.setEditorRef}
          image={this.state.RAWimage}
          width={250}
          height={250}
          borderRadius={250}
          border={25}
          color={[255, 255, 255, 0.6]} // RGBA
          scale={(this.state.scale+10)/10}
          rotate={0}
        />:
        <Typography className="description">{'upload your image'}</Typography>
      }
      {this.state.RAWimage?
        <Slider
          style={{'margin': '10px 0'}}
          aria-labelledby="label"
          value={this.state.scale}
          onChange={(e, value) => {this.setState({scale: value});}}
        />
        :null}

        </DialogContent>
        <DialogActions>
          <Button onClick={()=>{if(this.props.onFinish) {
            this.props.onFinish();
          }}} color="primary">
            {'cancel'}
          </Button>

          <input
            id="button-file"
            type="file"
            accept="image/*"
            style={{display: 'none'}}
            onChange={(e)=> {
              let filename = e.target.files[0];
              let reader = new FileReader();
              reader.onloadend = ()=> {
                this.setState({RAWimage: reader.result});
              };
              if(filename)
                reader.readAsDataURL(filename);
            }}
          />

          <label htmlFor="button-file">
            <Button onClick={()=>{}} component="span"  color="primary">
              {'upload'}
            </Button>
          </label>
          <Button onClick={()=>{if(this.props.onFinish) {
            this.saveImage();
          }}} color="primary">
            {'ok'}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}
