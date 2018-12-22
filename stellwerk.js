const net = require('net');
const io = require('socket.io')();
const ECOS_HOST = 'localhost';
const ECOS_PORT = 15471;

const ecos_client = net.createConnection({port: ECOS_PORT, host: ECOS_HOST}, () => {
    console.log('connected to server');
    ecos_client.write('I am a msg from the client');
});

var message_id = 0;

io.on('connection', function(socket) {

    socket.on("disconnect", function(data){
        console.log("browser disconnected");
    });
    socket.on('ecos_cmd', function(data) {
        ecos_client.write(data.msg);
    });
    ecos_client.on('data', (data) => {
        const regex_header_reply = /<(REPLY) (.*)\((.*)\)>/gm;
        const regex_header_event = /<(EVENT) (\d+)>/gm;
        const regex_footer = /<(END) (\d+) \((.*)?\)>/gm;
        var res = data.toString().split(/\r?\n/);
        var header = "";
        var body = "";
        var footer = "";
        var f, h;
        if(res.length === 3)
        {
            header = res[0];
            body = res[1];
            footer = res[2];
        }
        else if(res.length === 2)
        {
            header = res[0];
            footer = res[1];
        }
        else
            throw "bad response format: " + data.toString();

        f = regex_footer.exec(footer);
        if(f !== null && f.length === 4 && f[1] === 'END')
            footer = {
                error_code: f[2],
                error: f[3]
            };
        else
            throw "bad footer format: " + footer;
        if(h = regex_header_event.exec(header))
        {
            if(h.length === 3)
                header = {
                    type: h[1],
                    cmd: h[2],
                };
        }
        else if(h = regex_header_reply.exec(header))
        {
            if(h.length === 4)
                header = {
                    type: h[1],
                    cmd: h[2],
                    args: h[3].split(/[ ,]+/)
                };
        }
        else
            throw "bad header format: " + header;
        socket.emit('ecos_event', {
            msg: data.toString(),
            id: message_id,
            header: header,
            body: body,
            footer: footer
        });
        message_id++;
    });
});

io.listen(3000);

ecos_client.on('data', (data) => {
    console.log('server: ' + data);
});

ecos_client.on('error', (err) => {
    throw err;
});

ecos_client.on('end', () => {
  console.log('disconnected from server');
});

process.on('SIGTERM', () => {
  console.info('SIGTERM signal received.');
});
