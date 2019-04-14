// /src/flux/dispatcher.js
// Description:
// "dispatcher.js"
// Copyright 2018-2019 NOOXY. All Rights Reserved.
import Dispatcher from './lib/dispatcher';

function generateDispatcher(setState) {
  let _dispatcher = new Dispatcher();
  let id1 = _dispatcher.register((payload)=> {

  });

  return _dispatcher;
}

export default {generateDispatcher: generateDispatcher};
