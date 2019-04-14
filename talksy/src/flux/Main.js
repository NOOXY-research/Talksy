// /src/flux/main.js
// Description:
// "main.js"
// Copyright 2018-2019 NOOXY. All Rights Reserved.
import Constants from '../constants.json';
import Dispatcher from './dispatcher';
import Service from './service';
import NSClient from '../NSc.js';

const nshost = Constants.NOSERVICE_HOST;
const debug = Constants.DEBUG;
const nsport = null;

const NoService = new NSClient(nshost);
NoService.setDebug(debug);

function Flux(setState) {
  let _noservice_client;
  let Services = {};

  this.NoService = NoService;

  this.Dispatcher = Dispatcher.generateDispatcher(setState);

  this.Service = new Service(_noservice_client, this.Dispatcher);

  this.Actions = this.Service.Actions;

  this.start = (next)=> {
    this.Service.start(next);
  };
};

export default Flux;
