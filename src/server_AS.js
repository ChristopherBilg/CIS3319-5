const net = require('net');

// Initialization
const idC = 'CIS3319USERID';
const idTGS = 'CIS3319TGSID';
const lifetime2 = 60000;
const keyTGS = require('../key/tgs.json').key;

const hostname = '127.0.0.1';
const port = 10000;

// Sending the authentication server ticket to the client
console.log('Waiting for the client to connect and request a ticketTGS.');
const server = net.createServer((socket) => {
  const remoteAddress = `${socket.remoteAddress}:${socket.remotePort}`;
  console.log(`Client connected: ${remoteAddress}`);

  socket.on('data', (data) => {
    console.log(`${remoteAddress} sent the message: ${data}`);

    data = JSON.parse(data);

    const TS2 = new Date().getTime();
    if (data.TS1 < TS2 - 60000) {
      console.log('Error: invalid timestamp');
      return;
    }

    const message = {
      keyTGS: keyTGS,
      idTGS: idTGS,
      TS2: TS2,
      lifetime2: lifetime2,
      ticketTGS: {
        keyTGS: keyTGS,
        idC: idC,
        idTGS: idTGS,
        TS2: TS2,
        lifetime2: lifetime2,
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
  console.log(`The AS server is listening on ${hostname}:${port}`);
});
