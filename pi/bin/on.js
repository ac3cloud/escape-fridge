#!/usr/bin/env node

const gpio = require('rpi-gpio');
const os = require('os');

console.error('Hello world');

console.error(os.arch());

gpio.setup(7, gpio.DIR_LOW, (err) => {
  if (err) throw err;
  console.error('going to write');
  gpio.write(7, true, (err2) => {
    if (err2) throw err2;
    console.error('written to pin');
    // gpio.destroy();
  });
});
gpio.setup(11, gpio.DIR_LOW, (err) => {
  if (err) throw err;
  console.error('going to write');
  gpio.write(11, true, (err2) => {
    if (err2) throw err2;
    console.error('written to pin');
    // gpio.destroy();
  });
});

console.error('out');

/*
gpio.setup(7, gpio.DIR_OUT, write);
function write() {
    gpio.write(7, true, function(err) {
        if (err) throw err;
        console.error('Written to pin');

    });
}
*/

