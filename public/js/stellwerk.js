$(document).ready(function() {
    var socket = io('http://localhost:3000');
    socket.on('connect', function(){
        console.log("connected");
    });
    socket.on('ecos_event', function(data) {
        console.log(data);
        $('#event-log').append(
            $('<div/>', {'class':'card'}).append(
                $('<div/>', {'class':'card-header', 'id':'msg-code-' + data.id, 'data-toggle': 'collapse', 'data-target':'#msg-' + data.id, 'aria-controls':'msg-' + data.id}).append(
                    $('<code/>').text(data.msg)
                )
            ).append(
                $('<div/>', {'id':'msg-' + data.id, 'class':'collapse', 'arial-labelled':'msg-code-' + data.id, 'data-parent':'#event-log'}).append(
                    $('<div/>', {'class':'card-body'}).append(
                        "Hanuele"
                    )
                )
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
