const net = require('net');
const readline = require('readline-sync');

// Initialization
const idC = 'CIS3319USERID';
const idV = 'CIS3319SERVERID';
const idTGS = 'CIS3319TGSID';
const lifetime2 = 60000;
const lifetime4 = 86400000;
const keyV = require('../key/v.json').key;
const keyTGS = require('../key/tgs.json').key;

const hostname = '127.0.0.1';
const portAS = 10000;
const portTGS = 10001;
const portV = 10002;

const getTicketGrantingTicket = new Promise((resolve, reject) => {
  const client = new net.Socket();

  client.connect(portAS, hostname, () => {
    console.log('Successful connection made to AS (authentication server).');

    const message = {
      idC: idC,
      idTGS: idTGS,
      TS1: new Date().getTime(),
    };
    client.write(`${JSON.stringify(message)}`);
  });

  client.on('data', (data) => {
    console.log(`Client received ${data}`);
    data = JSON.parse(data);
    if (data.exit === true) {
      client.destroy();
    }

    resolve(data);
  });

  client.on('close', () => {
    console.log('Client connection has been closed.');
  });

  client.on('error', (error) => {
    console.log('Error:', error);
  });
});

const getServiceGrantingTicket = new Promise((resolve, reject) => {
  const client = new net.Socket();

  client.connect(portTGS, hostname, () => {
    console.log('Successful connection made to TGS (ticket granting server).');

    const message = {
      idV: idV,
      ticketTGS: {
        keyTGS: keyTGS,
        idC: idC,
        idTGS: idTGS,
        TS2: new Date().getTime(),
        lifetime2: lifetime2,
      },
    };
    client.write(`${JSON.stringify(message)}`);
  });

  client.on('data', (data) => {
    console.log(`Client received ${data}`);
    data = JSON.parse(data);
    if (data.exit === true) {
      client.destroy();
    }

    resolve(data);
  });

  client.on('close', () => {
    console.log('Client connection has been closed.');
  });

  client.on('error', (error) => {
    console.log('Error:', error);
  });
});

const getTimestampFromV = new Promise((resolve, reject) => {
  const client = new net.Socket();

  client.connect(portV, hostname, () => {
    console.log('Successful connection made to V (destination server).');

    const message = {
      ticketV: {
        keyV: keyV,
        idC: idC,
        idV: idV,
        TS4: new Date().getTime(),
        lifetime4: lifetime4,
      },
    };
    client.write(`${JSON.stringify(message)}`);
  });

  client.on('data', (data) => {
    console.log(`Client received ${data}`);
    data = JSON.parse(data);
    if (data.exit === true) {
      client.destroy();
    }

    resolve(data);
  });

  client.on('close', () => {
    console.log('Client connection has been closed.');
  });

  client.on('error', (error) => {
    console.log('Error:', error);
  });
});

// Code that will run (essentially a 'main function')
readline.question('Press ENTER to get a ticket from the AS (authentication server). ');
getTicketGrantingTicket.then((data) => {
  console.log('Data - Ticket Granting Ticket:', data);
}).then(() => {
  readline.question('Press ENTER to get a ticket from the TGS (ticket granting server). ');
  return getServiceGrantingTicket;
}).then((data) => {
  console.log('Data - Service Granting Ticket:', data);
}).then(() => {
  readline.question('Press ENTER to get a timestamp returned from server V (destination server). ');
  return getTimestampFromV;
}).then((data) => {
  console.log('Data - V:', data);
}).catch((error) => {
  console.log('Unexpected error in Promise chain:', error);
});
