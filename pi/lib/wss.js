const WebSocket = require('ws');

class WSS {
  constructor(gpio) {
    const wss = new WebSocket.Server({ port: 8080 });

    wss.on('connection', this.handleConnection.bind(this));

    this.wss = wss;
    this.gpio = gpio;

    this.sendMessage = this.sendMessage.bind(this);
  }

  handleConnection(ws) { // eslint-disable-line class-methods-use-this
    console.error('WS: BROWSER CONNECTED');
    ws.on('message', this.handleMessage.bind(this));
  }

  handleMessage(data) {
    console.error('WS: RECV');
    console.error(data);

    const payload = JSON.parse(data);

    switch (payload.cmd) {
      case 'timer':
        console.error('You are out of time!');
        this.gpio.write('outoftime', 'on');
        break;
      default:
        throw new Error('unknown command');
    }
  }

  // This is a bit of a hack, we just send data to all clients since our app is more of a push and only ever has one client
  sendMessage(payload) {
    const data = JSON.stringify(payload);

    this.wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
  }
}

exports.default = WSS;
