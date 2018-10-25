serial-to-websocket
===================
A simple node server that listens for incoming data on a serial port and sends it out over WebSocket.

## Configuration  
Use the `.env` file to change the following configuration variables:
- websocket port
- serial port name
- serial port baud rate
- serial data separator

Find the correct serial port name by running `ls /dev/tty.*` (on OSX or Linux) when the serial device is connected.  

The serial data separator is used to split incoming serial data into messages that are sent to the WebSocket.  

## Usage
Simply run `npm start` to start the node server.  

The serial data is sent over a WebSocket connection as a `data` event, with the contents included as a single string.  

### Example
```
import io from 'socket.io-client';
const socket = io('http://localhost:3001');
socket.on('data', (message) => {
  console.log('Message received:', message);
});
```

