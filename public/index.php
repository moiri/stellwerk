<?php
require_once "../php/AltoRouter.php";
require_once "../php/globals.php";
require_once "../php/BaseDb.php";

$router = new AltoRouter();
$router->setBasePath(BASE_PATH);

$db = new BaseDb(DBSERVER, DBNAME, DBUSER, DBPW);

function print_tpl($tpl)
{
    global $db, $router;
    if($tpl !== null)
        foreach($tpl as $path)
            require $path;
}

$router->map('GET', '/', function($router, $db) {
    require_once __DIR__ . "/tpl/header.tpl";
    require_once __DIR__ . "/tpl/home.tpl";
    require_once __DIR__ . "/tpl/footer.tpl";
}, 'home');
$router->map('GET', '/test', function($router, $db) {
    $custom_js = array(
        'const BASE_PATH = "' . BASE_PATH .'";',
        'const IP = "' . $_SERVER['SERVER_ADDR'] . '";',
    );
    $js_includes = array(
        __DIR__ . "/tpl/js_includes/socket.io.js.tpl",
        __DIR__ . "/tpl/js_includes/test.js.tpl",
    );
    require_once __DIR__ . "/tpl/header.tpl";
    require_once __DIR__ . "/tpl/test.tpl";
    require_once __DIR__ . "/tpl/footer.tpl";
}, 'test');
$router->map('GET', '/bahnhof/[i:id]/config', function($router, $db, $id_station) {
    require_once __DIR__ . "/tpl/header_bahnhof_preset.tpl";
    $js_includes[] = __DIR__ . "/tpl/js_includes/bahnhof_config.js.tpl";
    require_once __DIR__ . "/tpl/header.tpl";
    require_once __DIR__ . "/tpl/bahnhof_config.tpl";
    require_once __DIR__ . "/tpl/footer.tpl";
}, 'bahnhof_config');
$router->map('GET', '/bahnhof/[i:id]', function($router, $db, $id_station) {
    require_once __DIR__ . "/tpl/header_bahnhof_preset.tpl";
    $js_includes[] = __DIR__ . "/tpl/js_includes/bahnhof.js.tpl";
    require_once __DIR__ . "/tpl/header.tpl";
    require_once __DIR__ . "/tpl/bahnhof.tpl";
    require_once __DIR__ . "/tpl/footer.tpl";
}, 'bahnhof');
$router->map('POST', '/update_instance', function($router, $db) {
    require_once "../php/update_instance.php";
});
$router->map('POST', '/update_instance_ecos', function($router, $db) {
    require_once "../php/update_instance_ecos.php";
});
$router->map('POST', '/get_station', function($router, $db) {
    require_once "../php/get_station.php";
});
$router->map('GET', '/get_library', function($router, $db) {
    require_once "../php/get_library.php";
});

// match current request url
$match = $router->match();

// call closure or throw 404 status
if($match && is_callable($match['target'])) {
    call_user_func_array($match['target'], array_merge(array($router, $db), $match['params']));
} else {
    // no route was matched
    header($_SERVER["SERVER_PROTOCOL"] . ' 404 Not Found');
}
?>
