$(document).ready(function() {
    const col_count = NB_COLS;
    const row_count = NB_ROWS;
    var station = new ConfigStation(row_count, col_count);
    var ecos = new EcosCom();
    var $ecos = $('#ecos-items');

    // build station
    station.build_station($('.canvas'));
    station.build_library($('#library'));
    station.build_inventory($('#ecos-items'));
});
