const path = require('path');
const awsIot = require('aws-iot-device-sdk');
const gpio = require('rpi-gpio');

const certPath = path.join(__dirname, '..', 'certs');

class IoT {
  constructor(wss) {
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
    this.wss = wss;

    gpio.setup(7, gpio.DIR_LOW, (err) => { // This defaults the pin to low on setup.
      if (err) throw err;
      this.temp_io = 'locked';
      console.error('initialising pin 7 low, locked');
    });
  }

  // TODO: Load this from PI IO pins?
  get fridgeState() { // eslint-disable-line class-methods-use-this
    const state = {
      state: this.temp_io,
    };

    return state;
  }

  get deviceState() { // eslint-disable-line class-methods-use-this
    const state = {
      fridge: this.fridgeState,
    };

    return state;
  }

  setFridgeState(state) {
    // TODO change IO PINS
    this.temp_io = state;

    if (this.temp_io === 'unlocked') {
      gpio.write(7, true, (err) => {
        if (err) throw err;
        console.error('set pin 7 to high, unlocked');
        this.updateShadow();
      });
    } else if (this.temp_io === 'locked') {
      gpio.write(7, false, (err) => {
        if (err) throw err;
        console.error('set pin 7 to low, locked');
        this.updateShadow();
      });
    } else {
      console.error('got unknown state: ', state);
    }
  }

  handleDelta(thingName, stateObject) {
    console.error(`received delta on ${thingName}: ${JSON.stringify(stateObject)}`);

    const desiredState = stateObject.state;
    const currentState = this.deviceState;

    if (currentState.fridge.state === desiredState.fridge.state) {
      console.error('state doesn\'t need to be changed');
      return;
    }

    console.error('Updating State');
    this.setFridgeState(desiredState.fridge.state);
  }

  updateShadow() {
    const state = {
      state: {
        reported: this.deviceState,
        desired: null,
      },
    };

    this.thingShadow.update(process.env.THING_NAME, state);
  }

  handleConnect() {
    this.thingShadow.register(process.env.THING_NAME, {}, () => {
      this.updateShadow();
    });

    this.thingShadow.subscribe('pi');
  }

  handleMessage(topic, data) {
    console.error('message', topic, data.toString());

    const payload = JSON.parse(data.toString());

    switch (payload.cmd) {
      case 'take-photo':
        this.wss.sendMessage({ cmd: 'take-photo' });
        break;
      case 'result':
        this.wss.sendMessage({ cmd: 'result', isSmiling: payload.isSmiling });
        break;
      case 'face-data':
        this.wss.sendMessage({ cmd: 'face-data', data: payload.data });
        break;
      default:
        console.error(`Unknown command ${payload.cmd}`);
    }
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
