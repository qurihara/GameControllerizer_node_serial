//
// Test code for gc-ops.ts
//
// % copy [pxt-gamecontrollerizer/main.js] ./pxt-gc.ts
// % [copy ts_diff to ./pxt-gc.ts]
// % tsc --lib es5 gc-ops.ts
// % node test_gc-ops.js
//
const GcOps = require('./node_modules/node-red-contrib-game_controllerizer/game_controllerizer/gc-ops.js').GcOps;
const SerialPort = require('serialport');
// const Readline = require('@serialport/parser-readline')
var portName = '/dev/tty.usbserial-DM00AZ9D'; // Mac環境
var serialPort = new SerialPort(portName, {
    baudRate: 115200,
    dataBits: 8,
    parity: 'none',
    stopBits: 1,
    flowControl: false,
//    parser: serialport.parsers.readline('\n')
});

// const parser = serialPort.pipe(new Readline({ delimiter: '\r\n' }));
// parser.on('data', function(input) {
//     console.log('data-pipe: '+input);
// });
serialPort.on('data', function(input) {
    // console.log('data: '+input);
    var tId = input.readUInt8(0);
    switch(tId){
        case 0x01:
          console.log("b0");
          break;
        case 0x02:
          console.log("b1");
          break;
        case 0x04:
          console.log("b2");
          break;
        case 0x08:
          console.log("b3");
          break;
    }
});

serialPort.on('close', function(err) {
    console.log('port closed');
});

serialPort.on('open', function(err) {
    console.log('port opened');
});

// Build gc_sentence (=DSL4GC)
let gc_word0 = {"dpad": 5, "dur":-1};
// let gc_word1 = {"stk0": [0,1], "stk1": {"x":1,"y":1}};
// let gc_word2 = {"btn": {"1":true, "2":false, "3":false}, "dur":0};
// let gc_word3 = {"cfg_input": {"stk1": 1, "stk0": 0}};
let gc_word4 = {"dpad": 6, "dur":120};

let gc_sentence = null;
gc_sentence = GcOps.concat(gc_sentence, gc_word0);
gc_sentence = GcOps.concat(gc_sentence, gc_word4);
console.log("gc_sentence  >\t" + JSON.stringify(gc_sentence));

// serialize gc_sentence
let binary_sentence = [];
let total_bytes = 0;
for (let gc_word of gc_sentence){
	var bytes = GcOps.toBytes(gc_word);
	binary_sentence.push(bytes);
	total_bytes += bytes.length;
}
final_bytes = Buffer.concat(binary_sentence, total_bytes);
console.log("final_length >\t" + final_bytes.length);
console.log("final_data   >\t" + final_bytes.toString('hex'));

// Then, you can send `final_bytes` to UART like below,
serialPort.write(final_bytes);
//parser.write(final_bytes);
