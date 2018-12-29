function EcosCom(socket)
{
    var me = this;
    me._socket = socket;
    me._reply_queue = [];
    me._event_queue = [];

    me._socket.on('ecos_reply', function(data) {
        console.log(data);
        if(data.message_id in me._reply_queue)
            me._reply_queue[data.message_id](data.body, data.err);
    });

    me._socket.on('ecos_event', function(data) {
        console.log(data);
        if(data.header.cmd in me._event_queue)
            me._event_queue[data.header.cmd](data.body, data.err);
    });

    this.send_cmd = function(cmd, id, args, cb)
    {
        me._socket.emit('ecos_cmd', {
            cmd: cmd,
            id: id,
            args: args
        }, function(id) {
            me._reply_queue[id] = cb;
        });
    }
}
