$(document).ready(function() {
    const col_count = 10;
    const row_count = 5;
    var station = new Station(row_count, col_count);
    station.build_station($('.canvas'));
});
