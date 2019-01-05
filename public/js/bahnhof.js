$(document).ready(function() {
    const col_count = NB_COLS;
    const row_count = NB_ROWS;
    var station = new Station(row_count, col_count);
    station.build_station($('.canvas'));
});
