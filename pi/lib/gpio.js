const gpio = require('rpi-gpio');
const os = require('os');

class GPIO {
  constructor() {
    this.states = {
      fridge: 'locked',
    };

    this.data = {
      fridge: {
        pin: 7,
        direction: gpio.DIR_LOW,
      },
    };

    this.isPi = os.arch() === 'arm';

    if (!this.isPi) {
      this.mem = {};
    }

    this.setup = this.setup.bind(this);
    this.write = this.write.bind(this);
    this.gpioSetup = this.gpioSetup.bind(this);
    this.gpioWrite = this.gpioWrite.bind(this);
    this.memSetup = this.memSetup.bind(this);
    this.memWrite = this.memWrite.bind(this);
  }

  get fridge() {
    return this.states.fridge;
  }

  stateLookup(device, state) { // eslint-disable-line class-methods-use-this
    switch (device) {
      case 'fridge':
        return state === 'unlocked';
      default:
        throw new Error('Unknown device');
    }
  }

  setup(device) {
    return this.isPi ? this.gpioSetup(device) : this.memSetup(device);
  }

  write(device, state) {
    const w = this.isPi ? this.gpioWrite : this.memWrite;

    return w(device, state)
      .then(() => {
        this.states[device] = state;
      });
  }

  gpioSetup(device) {
    const { pin, direction } = this.data[device];
    return new Promise((resolve, reject) => {
      gpio.setup(pin, direction, (err) => { // This defaults the pin to low on setup.
        if (err) {
          reject(err);
        }

        console.error(`initialising pin ${pin}`);
        resolve();
      });
    });
  }

  gpioWrite(device, state) {
    const { pin } = this.data[device];
    const pinState = this.stateLookup(device, state);

    return new Promise((resolve, reject) => {
      gpio.write(pin, pinState, (err) => {
        if (err) {
          reject(err);
        }

        console.error(`set pin ${pin} to ${pinState}`);

        resolve();
      });
    });
  }

  memSetup(device) { // eslint-disable-line class-methods-use-this
    return new Promise((resolve /* , reject */) => {
      this.mem[device] = this.states[device];
      resolve();
    });
  }

  memWrite(device, state) {
    return new Promise((resolve /* , reject */) => {
      this.mem[device] = state;
      resolve();
    });
  }
}

exports.default = GPIO;
