$(document).ready(function() {
    var socket = io('http://' + IP + ':3000');
    socket.on('connect', function(){
        console.log("connected");
    });
    socket.on('ecos_event', function(data) {
        console.log(data);
        $('#event-log').append(
            $('<div/>', {'class':'alert alert-dark mb-0 m-1 py-1'}).append(
                $('<code/>').text(data.msg)
            )
        );
    });
    socket.on('disconnect', function(){
        console.log("disconnected");
    });
    $('#ecos-cmd').click(function() {
        socket.emit('ecos_cmd', {
            msg: $('#ecos-cmd-msg').val()
        });
    });
});
