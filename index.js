require('dotenv').config({path: '.env'});
const SerialPort = require('serialport');

const serialPort = new SerialPort(process.env.SERIAL_PORT, {
  baudRate: Number(process.env.BAUD_RATE)
}, err => {
  if (err) {
    console.error(
      `Could not open serial port ${process.env.SERIAL_PORT} with baud rate ${process.env.BAUD_RATE}`
    );
  }
});

// Switches the port into "flowing mode"
let msg = '';
let lastMsg = '';
const onData = (data) => {
  msg += data.toString();
  if (msg.includes(process.env.SEPARATOR)) {
    const parts = msg.split(process.env.SEPARATOR);
    if (parts[0] !== lastMsg) {
      lastMsg = parts[0];
      if (Socket.isRunning()) {
        Socket.emit('data', lastMsg);
      }
    }
    msg = parts.length > 1 ? parts[1] : '';
  }
};

serialPort.on('data', data => onData(data));

const Socket = require('./utils/Socket');
Socket.start(process.env.WEBSOCKET_PORT);
Socket.emitter.on('connection', () => {
  Socket.emit('data', lastMsg);
});