const WebSocket = require('ws');

class WSS {
  constructor() {
    const wss = new WebSocket.Server({ port: 8080 });

    wss.on('connection', this.handleConnection.bind(this));
    wss.on('message', this.handleMessage.bind(this));

    this.wss = wss;

    this.sendMessage = this.sendMessage.bind(this);
  }

  handleConnection(/* ws */) { // eslint-disable-line class-methods-use-this
    console.error('WS: BROWSER CONNECTED');
  }

  handleMessage(message) { // eslint-disable-line class-methods-use-this
    console.error('WS: RECV - %s', message);
  }

  // This is a bit of a hack, we just send data to all clients since our app is more of a push and only ever has one client
  sendMessage(payload) {
    const data = JSON.stringify(payload);

    console.error('BROADCAST');
    this.wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
  }
}

exports.default = WSS;
