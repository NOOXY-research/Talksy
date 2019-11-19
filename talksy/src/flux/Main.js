// /src/flux/main.js
// Description:
// "main.js"
// Copyright 2018-2019 NOOXY. All Rights Reserved.
import Constants from '../constants.json';
import Dispatcher from './dispatcher';
import Service from './Service';
import NSClient from './NSc.js';

const nshost = Constants.NOSERVICE_HOST;
const conn = Constants.NOSERVICE_CONNECT;

const debug = Constants.DEBUG;
const nsport = null;

const NoService = new NSClient(nshost, conn);
NoService.setDebug(debug);

function Flux(setState, getState) {
  let Services = {};

  this.NoService = NoService;

  this.dispatcher = Dispatcher.generateDispatcher(setState);

  this.service = new Service(NoService, this.dispatcher, getState);

  this.actions = this.service.actions;

  this.start = (next)=> {
    this.service.start(next);
  };
};

export default Flux;
