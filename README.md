This node server listens for incoming data on a serial port and sends it out over websocket.

Set the serial port name in `.env`. You can find the correct name on OSX by running `ls /dev/tty.*` on the command line.  
Use `npm start` to run.

The serial data is sent over a WebSocket connection as a `data` event, with the contents included as a string.  
Here is an example of how to connect to the socket and listen for incoming data:  

```
import io from 'socket.io-client';
const socket = io('http://localhost:3001');
socket.on('data', (message) => {
  console.log('Message received:', message);
});
```