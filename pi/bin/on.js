#!/usr/bin/env node

const gpio = require('rpi-gpio');

gpio.setup(7, gpio.DIR_LOW, (err) => {
  if (err) throw err;

  console.error('going to write');
  gpio.write(7, true, (err2) => {
    if (err2) throw err2;

    console.error('written to pin');
    gpio.setup(11, gpio.DIR_LOW, (err3) => {
      if (err3) throw err;

      console.error('going to write');
      gpio.write(11, true, (err4) => {
        if (err4) throw err4;

        console.error('written to pin');

        process.exit(0);
      });
    });
  });
});
