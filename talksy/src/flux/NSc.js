// NoService/clients/javascript/NSc.js
// Description:
// "NSc.js" is a NoNoService framework client.
// Copyright 2018-2019 NOOXY. All Rights Reserved.
'use strict';

// const WebSocket = require('ws');
// const crypto = require('crypto');

// initialization
String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};
// initialization end

let Buf = {
  alloc : (...args)=> {
    // return Buffer.alloc.apply(null, args);
  },

  encode : (...args)=> {
    // console.log( new TextEncoder('utf-8').encode(args[0]));
    return new Uint8Array(new TextEncoder('utf-8').encode(args[0]));
  },

  decode : (...args)=> {
    return new TextDecoder('utf-8').decode(args[0]);
  },

  concat : (...args)=> {
    let len = 0;
    for(let i in args[0]) {
      len += args[0][i].length;
    }
    let result = new Uint8Array(len);
    len = 0;
    for(let i in args[0]) {
      result.set(args[0][i], len);
      len += args[0][i].length;
    }
    return result;
  },

  isBuffer : (...args)=> {
    return args[0] instanceof Uint8Array;
  }
}

function NSc(targetip, method, targetport) {
  const setCookie = (cname, cvalue, exdays)=> {
    console.log(cname, cvalue, exdays);
    let d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  };
  const getCookie = (cname)=> {
      let name = cname + "=";
      let ca = document.cookie.split(';');
      for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') {
          c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
          return c.substring(name.length, c.length);
        }
      }
      return "";
  };
  const eraseCookie = (name)=> {
    setCookie(name,"",-1);
  };

  const settings = {
    verbose: true,
    debug: false,
    user: null,
    secure: true,
    NSc_files_root: '/',
    connmethod: 'WebSocketSecure',
    targetip: '0.0.0.0',
    targetport: 43581
  };

  const Constants = {
    'version': '0.5.0',
    'NSP_version': '0.5.0',
    'copyright': 'copyright(c)2018-2019 NOOXY inc.',
    "CONNECTION_METHOD_NAME_MAP": {
      "TCP": "TCP",
      "WebSocket": "WebSocket",
      "WebSocketSecure": "WebSocketSecure",
      "Local": "Local",
      "TCP/IP": "TCP",
      "ws": "WebSocket",
      "wss": "WebSocketSecure",
      "local": "Local"
    }
  }

  let Utils = {
    getQueryVariable: (variable)=>{
           var query = window.location.search.substring(1);
           var vars = query.split("&");
           for (var i=0;i<vars.length;i++) {
                   var pair = vars[i].split("=");
                   if(pair[0] == variable){return pair[1];}
           }
           return(false);
    },
    Base64toArrayBuffer: (b64str) => {
      var raw = window.atob(b64str);
      var rawLength = raw.length;
      var array = new Uint8Array(new ArrayBuffer(rawLength));
      for(let i = 0; i < rawLength; i++) {
        array[i] = raw.charCodeAt(i);
      }
      return array;
    },
    convertPemToBinary: (pem)=> {
      var lines = pem.split('\n');
      var encoded = '';
      for (var i = 0; i < lines.length; i++) {
        if (lines[i].trim().length > 0 &&
          lines[i].indexOf('-----BEGIN RSA PRIVATE KEY-----') < 0 &&
          lines[i].indexOf('-----BEGIN RSA PUBLIC KEY-----') < 0 &&
          lines[i].indexOf('-----BEGIN PUBLIC KEY-----') < 0 &&
          lines[i].indexOf('-----END PUBLIC KEY-----') < 0 &&
          lines[i].indexOf('-----BEGIN PRIVATE KEY-----') < 0 &&
          lines[i].indexOf('-----END PRIVATE KEY-----') < 0 &&
          lines[i].indexOf('-----END RSA PRIVATE KEY-----') < 0 &&
          lines[i].indexOf('-----END RSA PUBLIC KEY-----') < 0) {
          encoded += lines[i].trim();
        }
      }
      return Utils.Base64toArrayBuffer(encoded)
    },
    ArrayBuffertoBase64: (buffer)=> {
      var binary = '';
      var bytes = new Uint8Array(buffer);
      var len = bytes.byteLength;
      for (var i = 0; i < len; i++) {
        binary += String.fromCharCode( bytes[ i ] );
      }
      return window.btoa( binary );
    },
    printLOGO: (version, copyright) => {
      console.log('88b 88  dP\'Yb   dP\'Yb  Yb  dP Yb  dP  TM')
      console.log('88Yb88 dP   Yb dP   Yb  YbdP   YbdP  ')
      console.log('88 Y88 Yb   dP Yb   dP  dPYb    88   ')
      console.log('88  Y8  YbodP   YbodP  dP  Yb   88   NoService framework. ')
      console.log('')
      console.log('')
      console.log('ver. '+version+'. '+copyright)
      console.log('For more information or update -> www.nooxy.org')
      console.log('')
    },
    TagLog: (tag, logstring) => {
      if(typeof(logstring)!='string') {
        logstring = JSON.stringify(logstring, null, 2);
      }
      let _space = 10;
      tag = tag.substring(0, _space);
      for(var i=0; i < _space-tag.length; i++) {
        if(i%2 != 1) {
          tag = tag + ' ';
        }
        else {
          tag = ' ' + tag;
        }
      }
      console.log('['+tag+'] '+logstring.replaceAll('\n', '\n['+tag+'] '));
    },
    generateUniqueId: () => {
      return '_' + Math.random().toString(36).substr(2, 9);
    },
    generateGUID: () => {
      let s4 = () => {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
      }
      return s4() + s4() + '-' + s4() + '-' + s4() + '-' +s4() + '-' + s4() + s4() +
       s4();
    },
    searchObject: (object, value)=> {
      for (let prop in object) {
        if (object.hasOwnProperty(prop)) {
          if (object[prop] === value) {
            return prop;
          }
        }
      }
    },
  }

  // NoService Modules

  let Connections = {
    WebSocket: {
      Client: function (ConnectionProfile) {
        let _ws = null;
        let _debug;

        this.setDebug = (d)=> {
          _debug = d;
        };

        this.closeConnetion = () => {
          _ws.close();
        };

        this.onData = (connprofile, data) => {Utils.TagLog('*ERR*', 'onData not implemented');};

        this.onClose = () => {Utils.TagLog('*ERR*', 'onClose not implemented');};

        this.send = (connprofile, data)=> {
          _ws.send(data);
        };

        this.connect = (ip, port, callback) => {
          let connprofile;
          _ws = new WebSocket('ws://'+ip+':'+port);
          _ws.binaryType = "arraybuffer";
          connprofile = new ConnectionProfile(null, 'Server', 'WebSocket', ip, port, 'localhost', this);
          _ws.onopen = ()=> {
            callback(false, connprofile);
            // ws.send('something');
          };
          _ws.onmessage = (event) => {
            this.onData(connprofile, new Uint8Array(event.data));
          };

          _ws.onerror = (error) => {
            if(_debug) {
              Utils.TagLog('*WARN*', 'An error occured on connection module.');
              Utils.TagLog('*WARN*', error);
            }
            _ws.close();
            this.onClose(connprofile);
          };

          _ws.onclose = (error) => {
              this.onClose(connprofile);
          };

        }
      }
    },
    WebSocketSecure: {
      Client: function (ConnectionProfile) {
        let _ws = null;
        let _debug;

        this.setDebug = (d)=> {
          _debug = d;
        };

        this.closeConnetion = () => {
          _ws.close();
        };

        this.onData = (connprofile, data) => {Utils.TagLog('*ERR*', 'onData not implemented');};

        this.onClose = () => {Utils.TagLog('*ERR*', 'onClose not implemented');};

        this.send = (connprofile, data)=> {
          _ws.send(data);
        };

        this.connect = (ip, port, callback) => {
          let connprofile;
          _ws = new WebSocket('wss://'+ip+':'+port);
          _ws.binaryType = "arraybuffer";
          connprofile = new ConnectionProfile(null, 'Server', 'WebSocketSecure', ip, port, 'localhost', this);
          _ws.onopen = ()=> {
            callback(false, connprofile);
            // ws.send('something');
          };
          _ws.onmessage = (event) => {
            this.onData(connprofile, new Uint8Array(event.data));
          };

          _ws.onerror = (error) => {
            if(_debug) {
              Utils.TagLog('*WARN*', 'An error occured on connection module.');
              Utils.TagLog('*WARN*', error);
            }
            _ws.close();
            this.onClose(connprofile);
          };

          _ws.onclose = (error) => {
              this.onClose(connprofile);
          };
        }
      }
    }
  }

  function Connection(options) {
    if(options.allow_ssl_self_signed)
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

    let _default_local_ip_and_port = '';
    let _servers = {};
    let _clients = {};
    let _have_local_server = false;
    let _blocked_ip = [];
    let ssl_priv_key;
    let ssl_cert;
    let uint16_heartbeat_phrase = Buf.encode('HB');
    let heartbeat_cycle = 60000;
    let _debug = false;
    let _conn_meth_name_map;

    // define an profile of an connection
    function ConnectionProfile(serverId, Rpos, connMethod, hostip, hostport, clientip, conn) {
      let _serverId = serverId;
      let _pos = Rpos;
      let _connMethod = connMethod;
      let _bundle = {};
      let _GUID = Utils.generateGUID();
      let _hostip = hostip;
      let _hostport = hostport;
      let _clientip = clientip;
      let _conn = conn; // conn is wrapped!

      if(Rpos === 'Server') {
        _clients[connMethod+hostip+hostport] = this;
      }

      this.closeConnetion = () => {
        if(Rpos === 'Server') {
          delete _clients[connMethod+hostip+hostport];
        }
        // Utils.TagLog('*ERR*', 'closeConnetion not implemented. Of '+this.type);
        _conn.closeConnetion(_GUID);
      };

      this.getServerId = (callback) => {callback(false, _serverId);}
      this.getHostIP = (callback) => {callback(false, _hostip);}
      this.getHostPort = (callback) => {callback(false, _hostport);}
      this.getClientIP = (callback) => {callback(false, _clientip);}
      this.getConnMethod = (callback) => {callback(false, _connMethod);}
      this.getRemotePosition = (callback) => {callback(false, _pos);}
      this.setBundle = (key, value) => {_bundle[key] = value;}
      this.getBundle = (key, callback) => {callback(false, _bundle[key]);}
      this.getConn = (callback) => {callback(false, _conn)};
      this.getGUID = (callback) => {callback(false, _GUID)};

      this.returnServerId = () => {return _serverId;}
      this.returnHostIP = () => {return _hostip;}
      this.returnHostPort = () => {return _hostport;}
      this.returnClientIP = () => {return _clientip;}
      this.returnConnMethod = () => {return _connMethod;}
      this.returnRemotePosition = () => {return _pos;}
      this.returnBundle = (key) => {return _bundle[key];}
      this.returnConn = () => {return _conn;};
      this.returnGUID = () => {return _GUID};

      this.destroy= () => {
        // for worker deletetion
        this.worker_cancel_refer = true;
        delete _clients[_GUID];
      };
      // this.onConnectionDropout = () => {
      //   Utils.TagLog('*ERR*', 'onConnectionDropout not implemented');
      // }

    }

    this.addServer = (conn_method, ip, port) => {

      if(conn_method === 'local'||conn_method =='Local') {
        if(_have_local_server === false) {
          let _serverId = "LOCAL";
          let server = new Connections.Local.Server(_serverId, ConnectionProfile);
          _servers[_serverId] = server;
          server.start('LOCALIP', 'LOCALPORT');
          server.onData = this.onData;
          server.onClose = this.onClose;
          _have_local_server = true;
        }
        else {
          Utils.TagLog('*ERR*', 'Can only exist one local server.');
        }
      }
      else if(_conn_meth_name_map[conn_method]) {
        let _serverId = Utils.generateUniqueId();
        let server = new Connections[_conn_meth_name_map[conn_method]].Server(_serverId, ConnectionProfile, ssl_priv_key, ssl_cert);
        _servers[_serverId] = server;
        server.start(ip, port);
        server.onData = this.onData;
        server.onClose = this.onClose;
      }
      else {
        Utils.TagLog('*ERR*', 'ConnMethod '+conn_method+' not implemented. Skipped.');
      }

      // Heartbeat
      if(Object.keys(_servers).length==1) {
        setInterval(()=>{
          for(let i in _servers) {
            try{
              _servers[i].broadcast(uint16_heartbeat_phrase);
            }
            catch(e) {
              if(_debug) {
                Utils.TagLog('*WARN*', 'Server '+i+' occured error on heartbeat. Skipped.');
              }
            }
          };
        }, heartbeat_cycle);
      };
    }

    this.createClient = (conn_method, remoteip, port, callback) => {
      // Heartbeat
      let onData_wrapped = (connprofile, data)=> {
        if(data.length!=uint16_heartbeat_phrase.length||data[0]!=uint16_heartbeat_phrase[0]||data[1]!=uint16_heartbeat_phrase[1]) {
          this.onData(connprofile, data);
        }
        else {
        }
      };

      let _prev_client = _clients[conn_method+remoteip+port];

      if(_prev_client) {
        callback(false, _prev_client);
      }
      else if(conn_method === 'local'||conn_method =='Local') {
        if(_have_local_server === false) {
          Utils.TagLog('*ERR*', 'Local server not started.');
        }
        else {
          let locc = new Connections.Local.Client(ConnectionProfile);
          locc.setDebug(_debug);
          locc.onData = onData_wrapped;
          locc.onClose = this.onClose;
          locc.connect('LOCALIP', 'LOCALPORT', callback);
        }
      }

      else if(_conn_meth_name_map[conn_method]) {
        let netc = new Connections[_conn_meth_name_map[conn_method]].Client(ConnectionProfile);
        netc.setDebug(_debug);
        netc.onData = onData_wrapped;
        netc.onClose = this.onClose;
        netc.connect(remoteip, port, callback);
      }

      else {
        Utils.TagLog('*ERR*', 'ConnMethod '+conn_method+' not implemented. Skipped.');
      }
    };

    this.addConnetionModule = (constructor)=> {
      Connections[constructor.ConnectMethod] = constructor;
    };

    this.send = (connprofile, data) => {
      try {
        connprofile.getConn((err, conn) => {
          conn.send(connprofile, data);
        });
      }
      catch (e) {
        if(_debug) {
          Utils.TagLog('*WARN*', 'Error occured while sending Data.');
          console.log(e);
        }
      }
    };

    this.broadcast = (data) => {
      try {
        _servers.forEach((key, server) => {
          server.broadcast(data);
        });
      }
      catch (e) {
        if(_debug) {
          Utils.TagLog('*WARN*', 'Error occured while broadcasting Data.');
          console.log(e);
        }
      }
    };

    this.onData = (conn_profile, data) => {
      Utils.TagLog('*ERR*', 'Connection module onData not implement');
    };

    this.onClose = (connprofile) => {
      Utils.TagLog('*ERR*', 'Connection module onClose not implement');
    }

    this.getServers = (callback) => {
      callback(false, _servers);
    };

    this.getClients = (callback) => {
      callback(false, _clients);
    };

    this.killClient = (conn_profile) => {

    };

    this.setDebug = (bool) => {
      _debug = bool;
    };

    this.importSSLCert = (ssl_cert_in) => {
      ssl_cert = ssl_cert_in;
    };

    this.importSSLPrivateKey = (ssl_priv_key_in) => {
      ssl_priv_key = ssl_priv_key_in;
    }

    this.importHeartBeatCycle = (cycle) => {
      heartbeat_cycle = cycle;
    };

    this.importConnectionMethodNameMap = (dict)=> {
      _conn_meth_name_map = dict;
    };

    this.close = () =>{
      this.onClose = (connprofile) => {
        Utils.TagLog('*ERR*', 'Connection module onClose not implement');
      };
      this.onData = (conn_profile, data) => {
        Utils.TagLog('*ERR*', 'Connection module onData not implement');
      };
      for(let i in _clients) {
        _clients[i].closeConnetion();
      }
      for(let i in _servers) {
        _servers[i].close();
      }
    }
  }

  let Protocols = [
    function Protocol(coregateway, emitRequest) {

      this.Protocol = "AU";

      this.Positions = {
        rq: "Server",
        rs: "Client"
      };

      let Implementation = coregateway.Implementation;
      let Entity = coregateway.Entity;
      let Utils = coregateway.Utilities;
      let AuthorizationHandler = coregateway.AuthorizationHandler;


      let _queue_operation = {};
      let _auth_timeout = 180;

      // ClientSide

      let _handler = {
        // Authby password
        'PW': (connprofile, data, emitResponse) => {
          AuthorizationHandler.AuthbyPassword(connprofile, data, emitResponse);
        },

        // Authby password failed
        'PF': (connprofile, data, emitResponse) => {
          AuthorizationHandler.AuthbyPasswordFailed(connprofile, data, emitResponse);
        },

        // Authby token
        'TK': (connprofile, data, emitResponse) => {
          AuthorizationHandler.AuthbyToken(connprofile, data, emitResponse);
        },

        // Authby token failed
        'TF': (connprofile, data, emitResponse) => {
          AuthorizationHandler.AuthbyTokenFailed(connprofile, data, emitResponse);
        },

        // Sign in
        'SI': (connprofile, data, emitResponse) => {
          AuthorizationHandler.Signin(connprofile, data, emitResponse);
        },

        'AF': ()=>{

        }
      };


      this.RequestHandler = (connprofile, blob, emitResponse) => {
        let data = JSON.parse(Buf.decode(blob));
        let _emitResponse = (connprofile, data)=> {
          emitResponse(connprofile, Buf.encode(JSON.stringify(data)));
        };
        _handler[data.m](connprofile, data, _emitResponse);
      };
    }
    ,
    function Protocol(coregateway, emitRequest) {
      this.Protocol = "CS";

      this.Positions = {
        rq: "Client",
        rs: "Server"
      };

      let Activity = coregateway.Activity;
      let Utils = coregateway.Utilities;

      let _ActivityRsCEcallbacks = {};

      let _to_blob = (data)=> {
        if(Buf.isBuffer(data.d.d)) {
          let blob_back = Buf.concat([data.d.d]);
          data.d.d = null;
          let blob_front = Buf.encode(JSON.stringify(data));
          return Buf.concat([Buf.encode(('0000000000000000'+blob_front.length).slice(-16)), blob_front, Buf.encode(('0000000000000000'+blob_back.length).slice(-16)), blob_back]);
        }
        else {
          let blob = Buf.encode(JSON.stringify(data));
          return Buf.concat([Buf.encode(('0000000000000000'+blob.length).slice(-16)), blob]);
        }
      };

      let _parse_blob = (blob)=> {
        let length = parseInt(Buf.decode(blob.slice(0, 16)));
        let json_data = JSON.parse(Buf.decode(blob.slice(16, 16+length)));
        blob = blob.slice(16+length);
        if(blob.length) {
          let blob_data;
          length = parseInt(Buf.decode(blob.slice(0, 16)));
          blob_data = blob.slice(16, 16+length);
          json_data.d.d = blob_data;
          return json_data;
        }
        else {
          return json_data;
        }
      };


      Activity.on('createActivitySocketRq', (method, targetport, owner, mode, service, targetip, daemon_authkey, callback)=> {
        let err = false;
        let _data = {
          "m": "CE",
          "d": {
            t: Utils.generateGUID(),
            o: owner,
            m: mode,
            s: service,
            od: targetip,
            k: daemon_authkey
          }
        };
        coregateway.Connection.createClient(method, targetip, targetport, (err, connprofile) => {
          _ActivityRsCEcallbacks[_data.d.t] = (connprofile, data) => {
            callback(false, connprofile, data.d.i);
          }
          emitRequest(connprofile, 'CS', _to_blob(_data));
        });

      });

      Activity.on('EmitSSBlobServiceFunctionRq', (conn_profile, entityId, name, data, meta, tempid) => {
          let _data = {
            "m": "BS",
            "d": {
              "i": entityId,
              "n": name,
              "t": tempid,
              "d": data,
              "m": meta
            }
          };
          emitRequest(conn_profile, 'CS', _to_blob(_data));

      });

      Activity.on('EmitSSDataRq', (conn_profile, entityId, d) => {
          let _data = {
            "m": "SS",
            "d": {
              "i": entityId,
              "d": d,
            }
          };
          emitRequest(conn_profile, 'CS', _to_blob(_data));

      });

      Activity.on('EmitSSServiceFunctionRq', (conn_profile, entityId, name, data, tempid) => {
          let _data = {
            "m": "SF",
            "d": {
              "i": entityId,
              "n": name,
              "t": tempid,
              "d": data
            }
          };
          emitRequest(conn_profile, 'CS', _to_blob(_data));

      });

      Activity.on('EmitASCloseRq', (conn_profile, entityId) => {
          let _data = {
            "m": "CS",
            "d": {
              "i": entityId
            }
          };
          emitRequest(conn_profile, 'CS', _to_blob(_data));
      });


      // client
      this.ResponseHandler = (connprofile, blob) => {
        let data = _parse_blob(blob);
        let methods = {
          // nooxy service protocol implementation of "Call Service: Vertify Connection"
          VE: (connprofile, data) => {
            if(data.d.s === 'OK') {
              Activity.launchActivitySocketByEntityId(data.d.i);

            }
            else {
              Activity.emitASClose(data.d.i);

            }
          },
          // nooxy service protocol implementation of "Call Service: ServiceSocket"
          SS: (connprofile, data) => {

          },
          // nooxy service protocol implementation of "Call Service: Blob ServiceFunction"
          BS: (connprofile, data) => {
            if(data.d.s === 'OK') {
              Activity.emitBSFReturn(data.d.i, false, data.d.t, data.d.d, data.d.m);
            }
            else {
              Activity.emitBSFReturn(data.d.i, true, data.d.t, data.d.d, data.d.m);
            }
          },
          // nooxy service protocol implementation of "Call Service: ServiceFunction"
          SF: (connprofile, data) => {
            if(data.d.s === 'OK') {
              Activity.emitSFReturn(data.d.i, false, data.d.t, data.d.d);
            }
            else {
              Activity.emitSFReturn(data.d.i, true, data.d.t, data.d.d);
            }
          },
          // nooxy service protocol implementation of "Call Service: createEntity"
          CE: (connprofile, data) => {
            // tell server finish create
            if(data.d.i != null) {
              // create a description of this service entity.
              _ActivityRsCEcallbacks[data.d.t](connprofile, data);
              let _data = {
                "m": "VE",
                "d": {
                  "i": data.d.i,
                }
              };

              emitRequest(connprofile, 'CS', _to_blob(_data));
            }
            else {
              _ActivityRsCEcallbacks[data.d.t](connprofile, data);
              delete  _ActivityRsCEcallbacks[data.d.t];
            }
          }
        }

        // call the callback.
        methods[data.m](connprofile, data);
      };
    }
    ,
    function Protocol(coregateway, emitRequest) {
      this.Protocol = "GT";

      this.Positions = {
        rq: "Client",
        rs: "Server"
      };

      this.ResponseHandler = (connprofile, blob) => {
        let data = JSON.parse(Buf.decode(blob));
        if(data.s === 'OK') {
          coregateway.Implementation.onToken(connprofile, false, data.u, data.t);
        }
        else {
          coregateway.Implementation.onToken(connprofile, true, data.u, data.t);
        }
      };
    }
    ,
    function Protocol(coregateway, emitRequest) {
      this.Protocol = "CA";
      this.Positions = {
        rq: "Server",
        rs: "Client"
      };

      let Activity = coregateway.Activity;

      let _to_blob = (data)=> {
        if(Buf.isBuffer(data.d.d)) {
          let blob_back = Buf.concat([data.d.d]);
          data.d.d = null;
          let blob_front = Buf.encode(JSON.stringify(data));
          return Buf.concat([Buf.encode(('0000000000000000'+blob_front.length).slice(-16)), blob_front, Buf.encode(('0000000000000000'+blob_back.length).slice(-16)), blob_back]);
        }
        else {
          let blob = Buf.encode(JSON.stringify(data));
          return Buf.concat([Buf.encode(('0000000000000000'+blob.length).slice(-16)), blob]);
        }
      };

      let _parse_blob = (blob)=> {
        let length = parseInt(Buf.decode(blob.slice(0, 16)));
        let json_data = JSON.parse(Buf.decode(blob.slice(16, 16+length)));
        blob = blob.slice(16+length);
        if(blob.length) {
          let blob_data;
          length = parseInt(Buf.decode(blob.slice(0, 16)));
          blob_data = blob.slice(16, 16+length);
          json_data.d.d = blob_data;
          return json_data;
        }
        else {
          return json_data;
        }
      };

      this.RequestHandler = (connprofile, blob, emitResponse) => {
        let data = _parse_blob(blob);

        let methods = {
          // nooxy service protocol implementation of "Call Activity: ActivitySocket"
          AS: () => {
            Activity.emitASData(data.d.i, data.d.d);
            let _data = {
              "m": "AS",
              "d": {
                // status
                "i": data.d.i,
                "s": "OK"
              }
            };
            emitResponse(connprofile, Buf.encode(JSON.stringify(_data)));
          },
          // nooxy service protocol implementation of "Call Activity: Blob Event(with metadata)"
          BE: () => {
            Activity.emitASBlobEvent(data.d.i, data.d.n, data.d.d, data.d.m);
            let _data = {
              "m": "BE",
              "d": {
                // status
                "i": data.d.i,
                "s": "OK"
              }
            };
            emitResponse(connprofile, Buf.encode(JSON.stringify(_data)));
          },
          // nooxy service protocol implementation of "Call Activity: Event"
          EV: () => {
            Activity.emitASEvent(data.d.i, data.d.n, data.d.d);
            let _data = {
              "m": "EV",
              "d": {
                // status
                "i": data.d.i,
                "s": "OK"
              }
            };
            emitResponse(connprofile, Buf.encode(JSON.stringify(_data)));
          },
          // nooxy service protocol implementation of "Call Activity: Close ActivitySocket"
          CS: () => {
            Activity.emitASClose(data.d.i);
          }
        }
        // call the callback.
        methods[data.m](connprofile, data.d, emitResponse);
      };
    }
  ];

  function Router() {
    let _coregateway;
    // nooxy service protocol secure
    let _json_sniffers = [];
    let _raw_sniffers = [];
    // for signup timeout
    let _locked_ip = [];
    let _debug = false;

    let _tellJSONSniffers = (Json) => {
      for(let i in _json_sniffers) {
        _json_sniffers[i](false, Json);
      }
    };

    let _tellRAWSniffers = (data) => {
      for(let i in _raw_sniffers) {
        _raw_sniffers[i](false, data);
      }
    };

    // in case of wrong session of the position
    let _sessionnotsupport = (protocol, session, data) => {
      if(_debug) {
        Utils.TagLog('*WARN*', 'session not support');
        Utils.TagLog('*WARN*', protocol);
        Utils.TagLog('*WARN*', session);
        Utils.TagLog('*WARN*', data);
      }
    }

    // a convinient function fo sending data
    let _senddata = (connprofile, method, session, blob) => {
      let blobfinal = Buf.concat([Buf.encode(method+session, 'utf8'), blob]);
      // finally sent the data through the connection.
      if(connprofile) {
        _coregateway.NSPS.isConnectionSecured(connprofile, (secured)=> {
          if(secured === true) {
            _coregateway.NSPS.encrypt(connprofile, blobfinal, (err, encrypted)=> {
              if(!err) {
                _coregateway.Connection.send(connprofile, encrypted);
              }
              else if(_debug) {
                console.log(err);
                Utils.TagLog('*WARN*', err.stack);
              }
            });
          }
          else {
            _coregateway.Connection.send(connprofile, blobfinal);
          }
        });
      }
    }

    // implementations of NOOXY Service Protocol methods
    let methods = {

    }

    this.addJSONSniffer = (callback) => {
      _json_sniffers.push(callback);
    };

    this.addRAWSniffer = (callback) => {
      _raw_sniffers.push(callback);
    };

    // emit specified method.
    this.emitRequest = (connprofile, method, blob) => {
      methods[method].emitRequest(connprofile, blob);
    };

    // import the accessbility of core resource
    this.importCore = (coregateway) => {
      _coregateway = coregateway;
      _debug = _coregateway.Settings.debug;

      // while recieve a data from connection
      _coregateway.Connection.onData = (connprofile, data) => {
        _tellRAWSniffers(data);
        try {
          if(_coregateway.Settings.secure === true && connprofile.returnConnMethod() != 'Local' && connprofile.returnConnMethod() != 'local') {
            // upgrade protocol
            _coregateway.NSPS.decrypt(connprofile, data, (err, decrypted)=> {
              if(err&&_coregateway.Settings.debug) {
                console.log(err);
              }
              let method = Buf.decode(decrypted.slice(0, 2));
              let session = Buf.decode(decrypted.slice(2, 4));
              let blob = decrypted.slice(4);
              _tellJSONSniffers({method: method, session: session, data: Buf.decode(blob)});
              methods[method].RequestHandler(connprofile, session, blob);
            });
          }
          else {
            let method = Buf.decode(data.slice(0, 2));
            let session = Buf.decode(data.slice(2, 4));
            let blob = data.slice(4);

            _tellJSONSniffers({method: method, session: session, data: Buf.decode(blob)});
            methods[method].RequestHandler(connprofile, session, blob);
          }
        }
        catch (er) {
          if(_debug) {
            Utils.TagLog('*ERR*', 'An error occured in router module.');
            console.log(er);
          }
        }
      };

      _coregateway.Connection.onClose = (connprofile) => {
        try {
          if(connprofile.returnRemotePosition() === 'Client') {
            _coregateway.Service.emitConnectionClose(connprofile, (err)=>{
              connprofile.destroy();
            });
          }
          else {
            _coregateway.Activity.emitConnectionClose(connprofile, (err)=>{
              connprofile.destroy();
            });
          }

        }
        catch (er) {
          if(_debug) {
            Utils.TagLog('*WARN*', 'An error occured in router module.');
            console.log(er);
          }
        }
      };

      // load protocols
      Protocols.forEach((pt)=> {
        let p = new pt(_coregateway, this.emitRequest, _debug);
        methods[p.Protocol] = {
          emitRequest : (connprofile, data) => {
            _senddata(connprofile, p.Protocol, 'rq', data);
          },

          RequestHandler : (connprofile, session, data) => {
            connprofile.getRemotePosition((err, pos)=> {
              if(p.Positions[session] === pos || p.Positions[session] === 'Both') {
                let _emitResponse = (connprofile, data)=> {
                  _senddata(connprofile,  p.Protocol, 'rs', data);
                };
                if(session === 'rq') {
                  p.RequestHandler(connprofile, data, _emitResponse);
                }
                else {
                  p.ResponseHandler(connprofile, data);
                }
              }
              else {
                _sessionnotsupport(p, session, data);
              }
            });
          }
        };
      });

      _coregateway.Implementation.getClientConnProfile = _coregateway.Connection.createClient;
      _coregateway.Implementation.emitRequest = (connprofile, method, json)=> {this.emitRequest(connprofile, method, Buf.encode(JSON.stringify(json)))};
      _coregateway.Implementation.sendRouterData = _senddata;
      _coregateway.NSPS.sendRouterData = _senddata;
    };

    // for plugins
    this.addProtocol = (pt)=> {
      if(_debug) {
        Utils.TagLog('Router', 'Added a additional protocol.');
      }
      Protocols.push(pt);
    };

    this.close = () => {
      _coregateway = null;
      _json_sniffers = [];
      _raw_sniffers = [];
      _locked_ip = [];
    };

  }

  let SocketPair = {
    ActivitySocket: function ActivitySocket(service_name, conn_profile, emitter, unbindActivitySocketList, debug) {
      // Service Socket callback
      let _emitdata = emitter.Data;

      let _emit_sfunc = emitter.ServiceFunction;

      let _emit_blob_sfunc = emitter.BlobServiceFunction;

      let _emitclose = emitter.Close;

      let _entity_id;
      let _launched = false;

      let wait_ops = [];
      let wait_launch_ops = [];

      let _sfqueue = {};
      let _bsfqueue = {};

      let _on_dict = {
        data: ()=> {
          if(debug) Utils.TagLog('*WARN*', 'ActivitySocket of service "'+service_name+'" on "data" not implemented')
        },
        close: ()=> {
          if(debug) Utils.TagLog('*WARN*', 'ActivitySocket of service "'+service_name+'" on "close" not implemented')
        }
      };

      let _on_event = {

      };

      let _on_blob_event = {

      };

      // For waiting connection is absolutly established. We need to wrap operations and make it queued.
      let exec = (callback) => {
        if(_launched != false) {
          callback();
        }
        else {
          wait_ops.push(callback);
        }
      };

      this.launch = () => {
        _launched = true;
        for(let i in wait_ops) {
          wait_ops[i]();
        }
      };

      this.setEntityId = (id) => {
        _entity_id = id;
        let entities_prev = conn_profile.returnBundle('bundle_entities');
        if(entities_prev != null) {
          conn_profile.setBundle('bundle_entities', [_entity_id].concat(entities_prev));
        }
        else {
          conn_profile.setBundle('bundle_entities', [_entity_id]);
        }
      };

      // ServiceFunction call
      this.call = (name, data, callback) => {
        let op = ()=> {
          let tempid = Utils.generateUniqueId();
          _sfqueue[tempid] = (err, returnvalue) => {
            callback(err, returnvalue);
          };
          _emit_sfunc(conn_profile, _entity_id, name, data, tempid);
        };
        exec(op);
      }

      // BlobServiceFunction call
      this.callBlob = (name, blob, meta, callback) => {
        let op = ()=> {
          let tempid = Utils.generateUniqueId();
          _bsfqueue[tempid] = (err, returnblob, meta) => {
            callback(err, returnblob, meta);
          };
          _emit_blob_sfunc(conn_profile, _entity_id, name, blob, meta, tempid);
        };
        exec(op);
      }

      this.getEntityId = (callback) => {
        callback(false, _entity_id);
      };

      this.sendData = (data) => {
        let op = ()=> {
          _emitdata(conn_profile, _entity_id, data);
        };
        exec(op);
      };

      this.on = (type, callback)=> {
        _on_dict[type] = callback;
      };

      this.onEvent = (event, callback)=> {
        _on_event[event] = callback;
      };

      this.onBlobEvent = (event, callback)=> {
        _on_blob_event[event] = callback;
      };

      this._emitData = (data) => {
        _on_dict['data'](false, data);
      };

      this._emitBlobEvent = (event, blob, meta)=> {
        if(_on_blob_event[event])
          _on_blob_event[event](false, blob, meta);
      };

      this._emitSFReturn = (err, tempid, returnvalue) => {
        if(err) {
          _sfqueue[tempid](err);
        }
        else {
          _sfqueue[tempid](err, returnvalue);
        }
        delete _sfqueue[tempid];
      };

      this._emitBSFReturn = (err, tempid, returnblob, meta) => {
        if(err) {
          _bsfqueue[tempid](err);
        }
        else {
          _bsfqueue[tempid](err, returnblob, meta);
        }
        delete _bsfqueue[tempid];
      };

      this._emitEvent = (event, data)=> {
        if(_on_event[event])
          _on_event[event](false, data);
      };

      this._emitClose = () => {
        _on_dict['close'](false);
      };

      this.remoteClosed = false;

      this.unbindActivitySocketList = ()=> {
        Utils.TagLog('*ERR*', '_aftercloseLaunched not implemented');
      };

      this.close = () => {
        let op = ()=> {
          if(!this.remoteClosed)
            _emitclose(conn_profile, _entity_id);
          this._emitClose();
          let bundle = conn_profile.returnBundle('bundle_entities');
          for (let i=bundle.length-1; i>=0; i--) {
            if (bundle[i] === _entity_id) {
              unbindActivitySocketList(_entity_id);
              bundle.splice(i, 1);
            }
          }
          conn_profile.setBundle('bundle_entities', bundle);
          if(bundle.length === 0) {
            conn_profile.closeConnetion();
          }
        }
        exec(op);
      };
    }
  }


  function Activity() {
    let ActivitySocketDestroyTimeout = 1000;
    let _ASockets = {};
    let _admin_name = 'admin';
    let _daemon_auth_key;
    let _debug = false;
    let _on_handler = {};

    let _emmiter;



    let _unbindActivitySocketList = (_entity_id)=> {
      setTimeout(()=>{
        // tell worker abort referance
        if(_ASockets[_entity_id])
          _ASockets[_entity_id].worker_cancel_refer = true;
        delete _ASockets[_entity_id];
      }, ActivitySocketDestroyTimeout);
    };

    // Service module create activity socket
    this.createActivitySocket = (method, targetip, targetport, service, owner, callback) => {
      _emmiter = {
        Data: _on_handler['EmitSSDataRq'],
        ServiceFunction: _on_handler['EmitSSServiceFunctionRq'],
        Close: _on_handler['EmitASCloseRq'],
      }
      _on_handler['createActivitySocketRq'](method, targetport, owner, 'normal', service, targetip, false, (err, connprofile, entityId)=> {
        if(entityId) {
          let _as = new SocketPair.ActivitySocket(service, connprofile, _emmiter, _unbindActivitySocketList, _debug);
          _as.setEntityId(entityId);
          let prev = connprofile.returnBundle();
          if(!prev) {
            prev = [];
          }
          connprofile.setBundle('bundle_entities', prev.concat(entityId));
          _ASockets[entityId] = _as;
          callback(false, _ASockets[entityId]);
        }
        else{
          callback(new Error('Could not create this entity for some reason.'));
        }
      });
    };

    this.createAdminDaemonActivitySocket = (method, targetip, targetport, service, callback) => {
      this.createDaemonActivitySocket(method, targetip, targetport, service, _admin_name, callback);
    };

    this.createDaemonActivitySocket = (method, targetip, targetport, service, owner, callback) => {
      _emmiter = {
        Data: _on_handler['EmitSSDataRq'],
        ServiceFunction: _on_handler['EmitSSServiceFunctionRq'],
        BlobServiceFunction: _on_handler['EmitSSBlobServiceFunctionRq'],
        Close: _on_handler['EmitASCloseRq'],
      }
      _on_handler['createActivitySocketRq'](method, targetport, owner, 'daemon', service, targetip, _daemon_auth_key, (err, connprofile, entityId)=> {
        if(entityId) {
          let _as = new SocketPair.ActivitySocket(service, connprofile, _emmiter, _unbindActivitySocketList, _debug);
          _as.setEntityId(entityId);
          let prev = connprofile.returnBundle();
          if(!prev) {
            prev = [];
          }
          connprofile.setBundle('bundle_entities', prev.concat(entityId));
          _ASockets[entityId] = _as;
          callback(false, _ASockets[entityId]);
        }
        else{
          callback(new Error('Could not create this entity for some reason.'));
        }
      });
    };

    this.emitASClose = (entityId)=> {
      _ASockets[entityId].remoteClosed = true;
      _ASockets[entityId]._emitClose();
    };

    this.emitASData = (entityId, data)=> {
      _ASockets[entityId]._emitData(data);
    };

    this.emitBSFReturn = (entityId, err, tempid, returnvalue, meta)=> {
      _ASockets[entityId]._emitBSFReturn(err, tempid, returnvalue, meta);
    };

    this.emitSFReturn = (entityId, err, tempid, returnvalue)=> {
      _ASockets[entityId]._emitSFReturn(err, tempid, returnvalue);
    };

    this.emitASData = (entityId, data)=> {
      _ASockets[entityId]._emitData(data);
    };

    this.emitASEvent = (entityId, event, data)=> {
      _ASockets[entityId]._emitEvent(event, data);
    };

    this.emitASBlobEvent = (entityId, event, blob, meta)=> {
      _ASockets[entityId]._emitBlobEvent(event, blob, meta);
    };

    this.launchActivitySocketByEntityId = (entityId)=> {
      _ASockets[entityId].launch();
    };

    this.emitConnectionClose = (connprofile, callback) => {
      let _entitiesId = connprofile.returnBundle('bundle_entities');
      for(let i in _entitiesId) {
        _ASockets[_entitiesId[i]]._emitClose();
        setTimeout(()=>{
          // for worker abort referance
          if(_ASockets[_entitiesId[i]]) {
            _ASockets[_entitiesId[i]].worker_cancel_refer = true;
            delete _ASockets[_entitiesId[i]];
          }
        }, ActivitySocketDestroyTimeout);
      }
      callback(false);
    };

    this.setDefaultUsername = (username)=> {
      _admin_name = username;
    };

    this.setDebug = (debug)=> {
      _debug = debug;
    };

    this.importDaemonAuthKey = (key) => {
      _daemon_auth_key = key;
    };

    this.on = (event, callback)=> {
      _on_handler[event] = callback;
    };

    this.close = ()=> {
      ActivitySocketDestroyTimeout = 1000;
      for(let i in _ASockets) {
        _ASockets[i].worker_cancel_refer = true;
        delete _ASockets[i];
      }
      _ASockets = {};
      _emmiter = null;
      _admin_name = 'admin';
      _daemon_auth_key = null;
      _debug = false;
       _on_handler = {};
    };
  };

  // Handling responses to authorization requests.
  function AuthorizationHandler() {

    this.importImplementation = (Implementation)=> {
      this.AuthbyPassword = (...args)=> {Implementation.returnImplement('AuthbyPassword').apply(null, args)};
      this.AuthbyToken = (...args)=> {Implementation.returnImplement('AuthbyToken').apply(null, args)};
      this.AuthbyTokenFailed = (...args)=> {Implementation.returnImplement('AuthbyTokenFailed').apply(null, args)};
      this.Signin = (...args)=> {Implementation.returnImplement('signin').apply(null, args)};

    };

    this.close = () =>{

    }
  };

  function Implementation() {

    let _implts = {
      // NOOXY service protocol sercure end
      // return for Server
      AuthbyToken: () => {
        Utils.TagLog('*ERR*', 'AuthbyToken not implemented');
      },

      AuthbyTokenFailed: () => {
        Utils.TagLog('*ERR*', 'AuthbyTokenFailed not implemented');
      },

      // return for Server
      AuthbyPassword: () => {
        Utils.TagLog('*ERR*', 'AuthbyPassword not implemented');
      },

      AuthbyPasswordFailed: () => {
        Utils.TagLog('*ERR*', 'AuthbyPasswordFailed not implemented');
      },

      // return for Client
      signin: () => {
        Utils.TagLog('*ERR*', 'signin not implemented');
      },

      // return for Client
      signup: () => {
        Utils.TagLog('*ERR*', 'signup not implemented');
      },

      onToken: () => {
        Utils.TagLog('*ERR*', 'onToken not implemented');
      }
    };


    this.onToken = (connprofile, status, username, token)=> {
      _implts['onToken'](status, token, username);
    };

    this.setImplement = (name, callback) => {
      _implts[name] = callback;
    };

    this.returnImplement = (name) => {
      return _implts[name];
    };

    this.getImplement = (name, callback) => {
      callback(false, _implts[name]);
    };

    this.returnImplementBundle = () => {
      return _implts;
    };

    this.getClientConnProfile = ()=> {

    };

    this.close = () => {};
  }

  // NOOXY service protocol secure
  function NSPS() {
    let _rsa_pub;
    let _rsa_priv;
    let _resumes = {};
    let _crypto_module;
    let _operation_timeout = 60; // seconds

    this.emitRequest = () => {console.log('[*ERR*] emitRequest not implemented');};

    // Nooxy service protocol secure request ClientSide
    // in client need to be in implementation module
    this.RequestHandler = (connprofile, blob) => {
      let data = JSON.parse(Buf.decode(blob));
      let host_rsa_pub = data.p;
      let client_random_num = _crypto_module.returnRandomInt(99999);
      connprofile.setBundle('host_rsa_pub_key', host_rsa_pub);
      _crypto_module.generateAESCBC256KeyByHash(host_rsa_pub, client_random_num, (err, aes_key) => {
        connprofile.setBundle('aes_256_cbc_key', aes_key);
        let _data = {
          r: client_random_num,
          a: aes_key// aes key to vertify
        };
        _crypto_module.encryptString('RSA2048', host_rsa_pub, JSON.stringify(_data), (err, encrypted)=> {
          if(err) {
            console.log(err);
          }
          else {
            this.sendRouterData(connprofile, 'SP', 'rs', Buf.encode(JSON.stringify(encrypted)));
            connprofile.setBundle('NSPS', true);
          }

        });
      });
    };

    this.encrypt = (connprofile, blob, callback)=> {
      connprofile.getBundle('aes_256_cbc_key', (err, key)=>{
        _crypto_module.encrypt('AESCBC256', key, blob, (err, encrypted)=> {
          callback(err, encrypted);
        });
      });
    };

    this.decrypt = (connprofile, blob, callback)=> {
      if(connprofile.returnBundle('NSPS') === 'pending') {
        let method = Buf.decode(blob.slice(0, 2));
        if(method === 'SP') {
          let session = Buf.decode(blob.slice(2, 4));
          if(session === 'rs') {
            let data = blob.slice(4);
            this.ResponseHandler(connprofile, data);
          }
        }
        else {
          _resumes[connprofile.returnGUID()].push(()=> {callback(false, blob)});
        }
      }
      else if(connprofile.returnBundle('NSPS') != true && connprofile.returnRemotePosition() === 'Client') {
        this.upgradeConnection(connprofile, (err, succeess)=>{
          if(succeess) {
            callback(false, blob);
          }
          else {
            connprofile.closeConnetion();
          }
          if(err) {
            console.log(err);
          }
        });
      }
      else if(connprofile.returnBundle('NSPS') != true  && connprofile.returnRemotePosition() === 'Server') {
        let method = Buf.decode(blob.slice(0, 2));
        if(method === 'SP') {
          let session = Buf.decode(blob.slice(2, 4));
          if(session === 'rq') {
            let data = blob.slice(4);
            this.RequestHandler(connprofile, data);
          }
        }
        else {
          callback(false, blob);
        }

      }
      else if(connprofile.returnBundle('NSPS') === true) {
        _crypto_module.decrypt('AESCBC256', connprofile.returnBundle('aes_256_cbc_key'), blob, (err, decrypted)=> {
          callback(err, decrypted);
        });
      }
    };

    this.isConnectionSecured = (connprofile, callback)=> {
      connprofile.getBundle('NSPS', (err, NSPS)=>{
        // if(NSPS === 'finalize') {
        //   connprofile.setBundle('NSPS', true);
        //   callback(false);
        // }
        // else {
          callback(NSPS);
        // }
      });
    };

    this.upgradeConnection = (connprofile, callback) => {
      _resumes[connprofile.returnGUID()] = [callback];
      // operation timeout
      setTimeout(()=>{
        delete _resumes[connprofile.returnGUID()];
      }, _operation_timeout*1000);

      let _data = {
        p: _rsa_pub// RSA publicKey
      };
      connprofile.setBundle('NSPS', 'pending');
      this.sendRouterData(connprofile, 'SP', 'rq', Buf.encode(JSON.stringify(_data)));
    }

    this.importOperationTimeout = (timeout) => {
      _operation_timeout = timeout;
    };

    this.importCryptoModule = (crypto_module) => {
      _crypto_module = crypto_module;
    }

    this.importRSA2048KeyPair = (rsa_priv, rsa_pub) => {
      _rsa_priv = rsa_priv;
      _rsa_pub = rsa_pub;
    };

    this.close = () => {
      _rsa_pub = null;
      _rsa_priv = null;
      _resumes = {};
      _crypto_module = null;
    };
  };

  // NOOXY crypto Client version
  function NoCrypto() {
    // to base64
    let _algo = {
      // key is in length 32 char
      AESCBC256: {
        encryptString: (keystr, toEncrypt, callback) => {
          window.crypto.subtle.importKey(
              "raw", //can be "jwk" or "raw"
              new TextEncoder('utf-8').encode(keystr),
              {   //this is the algorithm options
                  name: "AES-CBC",
              },
              false, //whether the key is extractable (i.e. can be used in exportKey)
              ["encrypt", "decrypt"] //can be "encrypt", "decrypt", "wrapKey", or "unwrapKey"
          )
          .then((key)=>{
            let iv = new Uint8Array(16);
            window.crypto.getRandomValues(iv);
            toEncrypt = new TextEncoder('utf-8').encode(toEncrypt);
            window.crypto.subtle.encrypt(
              {
                  name: "AES-CBC",
                  iv: iv, //The initialization vector you used to encrypt
              },
              key, //from generateKey or importKey above
              toEncrypt //ArrayBuffer of the data
            )
            .then((encrypted)=>{
              callback(false, Utils.ArrayBuffertoBase64(iv)+Utils.ArrayBuffertoBase64(encrypted));
            })
            .catch((err2)=>{
              console.error(err2);
            });
          })
          .catch((err)=>{
              console.error(err);
          });
        },
        decryptString: (keystr, toDecrypt, callback) => {
          window.crypto.subtle.importKey(
              "raw", //can be "jwk" or "raw"
              new TextEncoder('utf-8').encode(keystr),
              {   //this is the algorithm options
                  name: "AES-CBC",
              },
              false, //whether the key is extractable (i.e. can be used in exportKey)
              ["encrypt", "decrypt"] //can be "encrypt", "decrypt", "wrapKey", or "unwrapKey"
          )
          .then((key)=>{
            let iv = Utils.Base64toArrayBuffer(toDecrypt.substring(0, 24));
            toDecrypt = Utils.Base64toArrayBuffer(toDecrypt.substring(24));
            window.crypto.subtle.decrypt(
              {
                  name: "AES-CBC",
                  iv: iv, //The initialization vector you used to encrypt
              },
              key, //from generateKey or importKey above
              toDecrypt //ArrayBuffer of the data
            )
            .then((decrypted)=>{;
              callback(false, new TextDecoder('utf-8').decode(decrypted));
            })
            .catch((err2)=>{
              console.error(err2);
            });
          })
          .catch((err)=>{
              console.error(err);
          });
        },
        encrypt: (keystr, toEncrypt, callback) => {
          window.crypto.subtle.importKey(
              "raw", //can be "jwk" or "raw"
              new TextEncoder('utf-8').encode(keystr),
              {   //this is the algorithm options
                  name: "AES-CBC",
              },
              false, //whether the key is extractable (i.e. can be used in exportKey)
              ["encrypt", "decrypt"] //can be "encrypt", "decrypt", "wrapKey", or "unwrapKey"
          )
          .then((key)=>{
            let iv = new Uint8Array(16);
            let salt = new Uint8Array(64);
            window.crypto.getRandomValues(iv);
            window.crypto.getRandomValues(salt);
            window.crypto.subtle.encrypt(
              {
                  name: "AES-CBC",
                  iv: iv, //The initialization vector you used to encrypt
              },
              key, //from generateKey or importKey above
              Buf.concat([salt, toEncrypt]) //ArrayBuffer of the data
            )
            .then((encrypted)=>{
              try {
                callback(false, Buf.concat([iv, new Uint8Array(encrypted)]));
              }
              catch (e) {
                console.log(e);
              }
            })
            .catch((err2)=>{
              console.error(err2);
            });
          })
          .catch((err)=>{
              console.error(err);
          });
        },
        decrypt: (keystr, toDecrypt, callback) => {
          window.crypto.subtle.importKey(
              "raw", //can be "jwk" or "raw"
              new TextEncoder('utf-8').encode(keystr),
              {   //this is the algorithm options
                  name: "AES-CBC",
              },
              false, //whether the key is extractable (i.e. can be used in exportKey)
              ["encrypt", "decrypt"] //can be "encrypt", "decrypt", "wrapKey", or "unwrapKey"
          )
          .then((key)=>{
            let iv = toDecrypt.slice(0, 16);
            window.crypto.subtle.decrypt(
              {
                  name: "AES-CBC",
                  iv: iv, //The initialization vector you used to encrypt
              },
              key, //from generateKey or importKey above
              toDecrypt.slice(16) //ArrayBuffer of the data
            )
            .then((decrypted)=>{;
              try {
                callback(false, new Uint8Array(decrypted.slice(64)));
              }
              catch(e) {
                console.log(e);
              }
            })
            .catch((err2)=>{
              console.error(err2.message);
            });
          })
          .catch((err)=>{
              console.error(err.message);
          });
        }
      },

      // Keys is in pem format
      RSA2048: {
        encryptString: (publicKey, toEncrypt, callback) => {
          window.crypto.subtle.importKey(
            "spki", //can be "jwk" (public or private), "spki" (public only), or "pkcs8" (private only)
            Utils.convertPemToBinary(publicKey),
            {   //these are the algorithm options
                name: "RSA-OAEP",
                hash: {name: "SHA-1"}, //can be "SHA-1", "SHA-256", "SHA-384", or "SHA-512"
            },
            false, //whether the key is extractable (i.e. can be used in exportKey)
            ["encrypt"] //"encrypt" or "wrapKey" for public key import or
                        //"decrypt" or "unwrapKey" for private key imports
          )
          .then((key)=> {
              //returns a publicKey (or privateKey if you are importing a private key)
            window.crypto.subtle.encrypt({"name": "RSA-OAEP"}, key, new TextEncoder('utf-8').encode(toEncrypt)).then((encrypted)=>{
              callback(false, Utils.ArrayBuffertoBase64(encrypted));
            });

          })
          .catch((err)=>{
              console.log(err);
          });

        }
      },

    };

    this.returnRandomInt = (max) => {
      return Math.floor(Math.random() * Math.floor(max));
    }

    // hashing two string (host and client pub key)by SHA256 to get AES-CBC 256 key 32 char
    this.generateAESCBC256KeyByHash = (string1, string2, callback) => {
      window.crypto.subtle.digest("SHA-256", new TextEncoder('utf-8').encode(string1+string2)).then((hash)=> {
        callback(false, (Utils.ArrayBuffertoBase64(hash)).substring(0, 32));
      });
    };

    this.encryptString = (algo, key, toEncrypt, callback) => {
      try{
        _algo[algo].encryptString(key, toEncrypt, callback);
      }
      catch(e) {
        callback(e);
      }

    };

    this.decryptString = (algo, key, toDecrypt, callback) => {
      try {
        _algo[algo].decryptString(key, toDecrypt, callback);
      }
      catch(e) {
        callback(e);
      }

    };

    this.encrypt = (algo, key, toEncrypt, callback) => {
      try{
        _algo[algo].encrypt(key, toEncrypt, callback);
      }
      catch(e) {
        callback(e);
      }

    };

    this.decrypt = (algo, key, toDecrypt, callback) => {
      try {
        _algo[algo].decrypt(key, toDecrypt, callback);
      }
      catch(e) {
        callback(e);
      }
    };

    this.close = () => {};
  }

  function NoServiceClientCore() {
    let verbose = (tag, log) => {
      if(settings.verbose||settings.debug) {
        Utils.TagLog(tag, log);
      };
    };
    // setup variables
    verbose('Core', 'Setting up variables.')
    let _connection = new Connection({allow_ssl_self_signed: false});
    let _authorizationhandler = new AuthorizationHandler();
    let _router = new Router();
    let _activity = new Activity();
    let _implementation = new Implementation();
    let _nsps = new NSPS();
    let _nocrypto = new NoCrypto;

    this.setupDefaultImplementation = ()=> {
      verbose('Core', 'Setting up DefaultImplementation.');
      this.importOwner(getCookie('NSUser'));
      // setup NoService Auth implementation
      _implementation.setImplement('signin', (connprofile, data, emitResponse)=>{
        window.location.replace(settings.NSc_files_root+'login.html?conn_method='+settings.connmethod+'&remote_ip='+settings.targetip+'&port='+settings.targetport+'&redirect='+window.location.href);
        // window.open('.html.html?conn_method='+conn_method+'&remote_ip='+remote_ip+'&port='+port);
      });

      _implementation.setImplement('onToken', (err, token)=>{
        setCookie('NSToken', token, 7);
        if(Utils.getQueryVariable('redirect')) {
          window.location.replace(Utils.getQueryVariable('redirect'));
        }
      });

      _implementation.setImplement('setUser', (err, username)=>{
        setCookie('NSUser', username, 365);
        if(!username) {
          eraseCookie('NSUser');
        }
      });

      _implementation.setImplement('logout', (err, Username)=>{
        eraseCookie('NSUser');
        eraseCookie('NSToken');
        window.location.reload();
      });

      _implementation.setImplement('AuthbyTokenFailed', (connprofile, data, emitResponse)=>{
        _implementation.returnImplement('signin')(connprofile, data, emitResponse, 'token');
      });

      // setup NoService Auth implementation
      _implementation.setImplement('AuthbyToken', (connprofile, data, emitResponse) => {
        let callback = (err, token)=>{
          let _data = {
            m:'TK',
            d:{
              t: data.d.t,
              v: token
            }
          }
          emitResponse(connprofile, _data);
        };

        let pass = true;
        if(!getCookie('NSToken')) {
          _implementation.returnImplement('signin')(connprofile, data, emitResponse, 'token');
        }
        else {
          callback(false, getCookie('NSToken'));
        }

      });
      // setup NoService Auth implementation

      _implementation.setImplement('AuthbyPassword', (connprofile, data, emitResponse) => {
        window.open(settings.NSc_files_root+'password.html?conn_method='+settings.connmethod+'&remote_ip='+settings.targetip+'&port='+settings.targetport+'&username='+settings.user+'&authtoken='+data.d.t+'&redirect='+window.location.href);
      });

      _implementation.getDefaultClientConnProfile = (callback) => {
        _connection.createClient(settings.connmethod, settings.targetip, settings.targetport, callback);
      }

      verbose('Core', 'Setting up DefaultImplementation done.');

    };

    this.launch = () => {
      // create gateway
      verbose('Core', 'Creating coregateway...')
      let coregateway = {
          Settings: settings,
          AuthorizationHandler: _authorizationhandler,
          Activity : _activity,
          Connection: _connection,
          Router: _router,
          Utilities: Utils,
          Implementation: _implementation,
          NoCrypto: _nocrypto,
          NSPS: _nsps
        };
      verbose('Core', 'Creating coregateway done.');

      _connection.setDebug(settings.debug);
      _connection.importConnectionMethodNameMap(Constants.CONNECTION_METHOD_NAME_MAP);

      // setup NOOXY Service protocol secure
      _nsps.importCryptoModule(_nocrypto);

      // setup router
      if(settings.debug) {
        _router.addJSONSniffer((err, json)=> {
          Utils.TagLog('DEBUG', json);
        });
      }
      _router.importCore(coregateway);

      // setup AuthorizationHandler
      _authorizationhandler.importImplementation(_implementation);

      // setup service
      _activity.setDebug(settings.debug);

      verbose('Core', 'Setting up variables done.');
      //
      verbose('Core', 'NoService client started.');
    }

    this.logout = ()=> {
      _implementation.returnImplement('logout')();
    };

    this.getImplementationModule = (callback) => {
      callback(false, _implementation);
    };

    this.createActivitySocket = (method, targetip, targetport, service, callback) => {
      _activity.createActivitySocket(method, targetip, targetport, service, settings.user, callback);
    };

    this.importOwner = (uname)=> {
      settings.user = uname;
    };

    this.returnOwner = ()=> {
      return settings.user;
    }
  }

  // NoService Modules end

  let _core = new NoServiceClientCore();

  this.connect = ()=> {};
  // NSc methods
  this.setDebug = (boo)=>{
    settings.debug = boo;
  }
  this.createActivitySocket = (service, callback) => {
    _core.createActivitySocket(settings.connmethod, settings.targetip, settings.targetport, service, callback);
  };
  this.setUsername = (uname)=>{
    _core.importOwner(uname);
  }
  this.returnUsername = ()=>{
    return _core.returnOwner();
  };
  this.logout = ()=> {
    _core.logout();
  };
  this.getImplementationModule = (callback)=> {
    _core.getImplementationModule(callback);
  };
  this.init = (targetip, method, targetport) => {
    if(targetip) {
      settings.targetip = targetip;
    }

    // if(settings.debug) {
    //   settings.connmethod = 'WebSocket';
    //   settings.targetport = 43582;
    // }

    if(method) {
      settings.connmethod = method;
    }

    if(method === 'WebSocketSecure') {
      settings.targetport = 43581;
    }
    else if (method ==='WebSocket') {
      settings.targetport = 43582;
    }

    if(targetport) {
      settings.targetport = targetport;
    }

    Utils.printLOGO(Constants.version, Constants.copyright);

    Utils.TagLog('Init', 'host: nsp('+settings.connmethod+')://'+targetip+':'+settings.targetport);
    _core.setupDefaultImplementation();

    try {
      _core.launch();
    }
    catch(e) {
      settings.connmethod = 'WebSocket';
      _core.launch();
    }

  };
  this.init(targetip, method, targetport);
};

// module.exports = NSc;
export default NSc;
