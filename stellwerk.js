const net = require('net');
const io = require('socket.io')();
const config = require('./config');
const ecos = require('./ecos');
const ECOS_HOST = config.host;
const ECOS_PORT = config.port;

const ecos_client = net.createConnection({port: ECOS_PORT, host: ECOS_HOST}, () => {
    console.log('connected to server');
});

var open_requests = [];
var message_id = 0;

io.on('connection', function(socket) {
    socket.on('ecos_cmd', function(data, cb) {
        var msg = ecos.create_cmd(data);
        var room = encodeURIComponent(msg);
        if(room in open_requests)
            id = open_requests[room];
        else
        {
            id = message_id;
            open_requests[room] = message_id;
            message_id++;
        }
        cb(id);
        console.log(msg);
        socket.join(room);
        if(ecos.is_view_request(data))
            socket.join(data.id);
        if(ecos.is_view_release(data))
            socket.leave(data.id);
        ecos_client.write(msg);
    });
});

ecos_client.on('data', (data) => {
    var res = ecos.parse_msg(data.toString());
    var room = encodeURIComponent(res.header.cmd);
    console.log(data.toString());
    if(res.header.type === "REPLY")
    {
        res.message_id = open_requests[room];
        delete open_requests[room];
        io.to(room).emit('ecos_reply', res);
        io.in(room).clients((error, clients) => {
            clients.forEach(function (socket_id) {
                io.sockets.sockets[socket_id].leave(room);
            });
        });
    }
    else if(res.header.type === "EVENT")
    {
        io.to(room).emit('ecos_event', res);
    }
});

io.listen(3000);

ecos_client.on('end', () => {
  console.log('disconnected from server');
});

process.on('SIGTERM', () => {
  console.log('SIGTERM signal received.');
});
