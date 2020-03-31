const net = require('net');
const readline = require('readline-sync');

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
const portTGS = 10000;

// Getting the ticket from the authentication server
readline.question('Press ENTER to get a ticket from the AS (authentication server). ');
let ticketAS = (() => {
  const client = new net.Socket();

  client.connect(portTGS, hostname, () => {
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
  });

  client.on('close', () => {
    console.log('Client connection has been closed.');
  });

  client.on('error', (error) => {
    console.log('Error:', error);
  });
})();
console.log('ticketAS:', ticketAS);
