const gpio = require('rpi-gpio');
const os = require('os');
console.log('Hello world');

console.log(os.arch());

gpio.setup(7, gpio.DIR_LOW, (err) => {
  if (err) throw err;
  console.log('going to write');
  gpio.write(7, true, (err) => {
    if (err) throw err;
    console.log('written to pin');
    // gpio.destroy();
  });
});
gpio.setup(11, gpio.DIR_LOW, (err) => {
  if (err) throw err;
  console.log('going to write');
  gpio.write(11, true, (err) => {
    if (err) throw err;
    console.log('written to pin');
    // gpio.destroy();
  });
});
console.log('out');
/*
gpio.setup(7, gpio.DIR_OUT, write);
 
function write() {
    gpio.write(7, true, function(err) {
        if (err) throw err;
        console.log('Written to pin');

    });
}
*/

