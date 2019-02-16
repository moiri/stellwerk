<?php
$res = $db->select_by_uid('station', $id_station);
$custom_js = array(
    'const BASE_PATH = "' . BASE_PATH .'";',
    'const IP = "' . $_SERVER['SERVER_ADDR'] . '";',
    'const ID_STATION = "' . $id_station . '";',
    'const NB_COLS = "' . $res['cols'] . '";',
    'const NB_ROWS = "' . $res['rows'] . '";',
);
$custom_css = array(
    __DIR__ . "/css/library.css.tpl",
    __DIR__ . "/css/buttons.css.tpl",
);
$js_includes = array(
    __DIR__ . "/js_includes/socket.io.js.tpl",
    __DIR__ . "/js_includes/station.js.tpl",
);
?>
