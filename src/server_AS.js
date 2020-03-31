const net  = require('net');

// Initialization
const idC = 'CIS3319USERID';
const idV = 'CIS3319SERVERID';
const idTGS = 'CIS3319TGSID';
const lifetime2 = 60000;
const lifetime4 = 86400000;
const keyC = require('../key/c.json').key;
const keyV = require('../key/v.json').key;
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
    if (data.idC !== idC)
      return;
    if (data.idTGS !== idTGS)
      return;
    if (data.TS1 < new Date().getTime() - 60000)
      return;

    const message = {
      keyTGS: keyTGS,
      idTGS: idTGS,
      TS2: new Date().getTime(),
      lifetime2: lifetime2,
      ticketTGS: keyTGS,
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
