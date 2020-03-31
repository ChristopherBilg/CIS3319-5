const net = require('net');

// Initialization
const idC = 'CIS3319USERID';
const idV = 'CIS3319SERVERID';
const lifetime4 = 86400000;
const keyV = require('../key/v.json').key;

const hostname = '127.0.0.1';
const port = 10001;

// Sending the authentication server ticket to the client
console.log('Waiting for the client to connect and request a ticketSGS.');
const server = net.createServer((socket) => {
  const remoteAddress = `${socket.remoteAddress}:${socket.remotePort}`;
  console.log(`Client connected: ${remoteAddress}`);

  socket.on('data', (data) => {
    console.log(`${remoteAddress} sent the message: ${data}`);

    data = JSON.parse(data);

    const TS4 = new Date().getTime();
    if (data.ticketTGS.TS2 < TS4 - 60000) {
      console.log('Error: invalid timestamp');
      return;
    }

    const message = {
      keyV: keyV,
      idV: idV,
      TS4: TS4,
      ticketV: {
        keyV: keyV,
        idC: idC,
        idV: idV,
        TS4: TS4,
        lifetime4: lifetime4,
      },
      exit: true,
    };
    socket.write(JSON.stringify(message));
  });

  socket.on('close', () => {
    console.log(`Client disconnected: ${remoteAddress}`);
  });

  socket.on('error', (error) => {
    console.log(`Connection error from ${remoteAddress}: ${error.message}`);
  });
});

server.listen(port, hostname, () => {
  console.log(`The TGS server is listening on ${hostname}:${port}`);
});
