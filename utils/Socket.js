const EventEmitter = require('event-emitter-es6');
const http = require('http');
const io = require('socket.io');
const Logger = require('./Logger');

class Socket {

  static start(port) {
    this._port = port;
    this._clients = [];
    this._server = http.createServer();
    this._socket = io(this._server);
    this._server.listen(port);

    this._clients = [];
    this.registeredEvents = [];

    this._emitter = new EventEmitter();

    this._socket.on('connection', client => {
      Logger.log(`New client connected with id ${client.id}`);
      this._emitter.emit('connection', client);
      // client.emit('name', (name) => {
      //   this._registerClient(client, name);
      // });
      this._registerClient(client, client.id);
    });

    Logger.log(`Websocket server started on port ${port}`);
  }

  static get emitter() {
    return this._emitter;
  }

  static isRunning() {
    return !!this._port;
  }

  static _registerClient(client, name) {
    Logger.log(`Registering client with id ${client.id}`);
    this._clients[name] = client;

    this.registeredEvents.forEach(entry => {
      if (!entry.clientName || name === entry.clientName) {
        Logger.log(`Registering event "${entry.event}" on new client`);
        client.on(entry.event, entry.callback);
      }
    });

    client.on('disconnect', (...args) => {
      Logger.log('Client disconnected', args);
      for (let name in this._clients) {
        if (this._clients[name] === client) {
          delete this._clients[name];
        }
      }
      Logger.log(`${this.getNumClients()} clients connected`);
    });

    Logger.log(`${this.getNumClients()} clients connected`);
  }

  static getNumClients() {
    return Object.values(this._clients).filter(value => !!value).length;
  }

  static getClientByName(name) {
    return this._clients[name];
  }

  static emit(event, ...data) {
    this._socket.emit(event, ...data);
  }

  static emitToClient(clientName, event, ...data) {
    if (this._clients[clientName]) {
      this._clients[clientName].emit(event, ...data);
    }
  }

  static on(event, callback) {
    this.registeredEvents.push({event, callback});
    this._clients.forEach(client => client.on(event, callback));
  }

  static onClient(clientName, event, callback) {
    this.registeredEvents.push({clientName, event, callback});
    if (this._clients[clientName]) {
      this._clients[clientName].on(event, callback);
    }
  }
}

module.exports = Socket;