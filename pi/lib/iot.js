const path = require('path');
const awsIot = require('aws-iot-device-sdk');

const certPath = path.join(__dirname, '..', 'certs');

class IoT {
  constructor() {
    const deviceOptions = {
      keyPath: path.join(certPath, 'private.pem'),
      certPath: path.join(certPath, 'cert.pem'),
      caPath: path.join(certPath, 'symantec.pem'),
      clientId: process.env.THING_NAME,
      host: process.env.IOT_HOST,
      debug: true,
    };

    const thingShadow = awsIot.thingShadow(deviceOptions);

    thingShadow.on('connect', this.handleConnect.bind(this));
    thingShadow.on('status', this.handleStatus.bind(this));
    thingShadow.on('message', this.handleMessage.bind(this));
    thingShadow.on('delta', this.handleDelta.bind(this));
    thingShadow.on('error', this.handleError.bind(this));
    thingShadow.on('timeout', this.handleTimeout.bind(this));

    // TODO: Should we leave these here as debugging tools?
    // thingShadow.on('packetsend', this.handlePacketSend);
    // thingShadow.on('packetreceive', this.handlePacketReceive);

    this.thingShadow = thingShadow;
  }

  // TODO: Load this from PI IO pins?
  get fridgeState() { // eslint-disable-line class-methods-use-this
    const state = {
      state: 'unlocked',
    };

    return state;
  }

  get state() { // eslint-disable-line class-methods-use-this
    const state = {
      fridge: this.fridgeState,
    };

    return state;
  }

  handleConnect() {
    this.thingShadow.register(process.env.THING_NAME, {}, () => {
      const fridgeState = {
        state: {
          reported: this.state,
        },
      };

      this.thingShadow.update(process.env.THING_NAME, fridgeState);
    });

    this.thingShadow.subscribe('pi');
  }

  handleMessage(topic, payload) { // eslint-disable-line class-methods-use-this
    console.error('message', topic, payload.toString());
  }

  handleStatus(thingName, stat, clientToken, stateObject) { // eslint-disable-line class-methods-use-this
    console.error(`received ${stat} on ${thingName}: ${JSON.stringify(stateObject)}`);
  }

  // TODO: Should we leave this here as a debugging tool?
  // handlePacketSend(packet) { // eslint-disable-line class-methods-use-this
  //   console.error('SEND');
  //   console.error(packet);
  // }

  // TODO: Should we leave this here as a debugging tool?
  // handlePacketReceive(packet) { // eslint-disable-line class-methods-use-this
  //   console.error('RECEIVE');
  //   console.error(packet);
  // }

  handleError(error) { // eslint-disable-line class-methods-use-this
    console.error('ERROR');
    console.error(error);
  }

  handleTimeout(thingName, clientToken) { // eslint-disable-line class-methods-use-this
    console.error(`received timeout on ${thingName} with token: ${clientToken}`);
  }
}

exports.default = IoT;