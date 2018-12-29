$(document).ready(function() {
    const col_count = 10;
    const row_count = 5;
    var socket = io('http://' + IP + ':3000');
    var station = new ConfigStation(row_count, col_count);
    var ecos = new EcosCom(socket);
    var $ecos = $('#ecos-items');

    // build station
    station.build_station($('.canvas'));
    station.build_library($('#library'));
    station.build_inventory($('#ecos-items'));
});
