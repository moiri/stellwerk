const net = require('net');
const io = require('socket.io')();

const ECOS_HOST = 'localhost';
const ECOS_PORT = 15471;

const ecos_client = net.createConnection({port: ECOS_PORT, host: ECOS_HOST}, () => {
    console.log('connected to server');
    ecos_client.write('I am a msg from the client');
});

io.on('connection', function(socket) {
    socket.on();
    ecos_client.on('data', (data) => {
        socket.broadcast.emit('ecos_event', data)
    });
});

ecos_client.on('error', (err) => {
    throw err;
});

ecos_client.on('end', () => {
  console.log('disconnected from server');
});
