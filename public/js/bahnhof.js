$(document).ready(function() {
    const col_count = 20;
    const row_count = 6;
    var socket = io('http://' + IP + ':3000');
    var station = new Station(row_count, col_count, false);
    station.build_canvas($('.canvas'));

    socket.on('connect', function(){
        socket.emit('ecos_cmd', {
            msg: "queryObjects(11, name1, name2, name3, addr)"
        });
    });
    socket.on('ecos_event', function(data) {
    });
    socket.on('disconnect', function(){
    });
});
