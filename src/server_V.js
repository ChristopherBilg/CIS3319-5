const net = require('net');

// Initialization
const hostname = '127.0.0.1';
const port = 10002;

// Sending the authentication server ticket to the client
console.log('Waiting for the client to connect and timestamp information.');
const server = net.createServer((socket) => {
  const remoteAddress = `${socket.remoteAddress}:${socket.remotePort}`;
  console.log(`Client connected: ${remoteAddress}`);

  socket.on('data', (data) => {
    console.log(`${remoteAddress} sent the message: ${data}`);

    data = JSON.parse(data);

    const TS6 = new Date().getTime();
    if (data.ticketV.TS4 < TS6 - 60000) {
      console.log('Error: invalid timestamp');
      return;
    }

    data.ticketV.TS4 += 1000;
    const message = {
      TS5: data.ticketV.TS4,
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
  console.log(`The V server is listening on ${hostname}:${port}`);
});
