<?php
require_once "../php/AltoRouter.php";
require_once "../php/globals.php";
require_once "../php/BaseDb.php";

$router = new AltoRouter();
$router->setBasePath(BASE_PATH);

$db = new BaseDb(DBSERVER, DBNAME, DBUSER, DBPW);

$router->map('GET', '/', function($router, $db) {
    require_once __DIR__ . "/header_home.tpl";
    require_once __DIR__ . "/home.tpl";
    require_once __DIR__ . "/footer.tpl";
}, 'home');
$router->map('GET', '/test', function($router, $db) {
    require_once __DIR__ . "/header_test.tpl";
    require_once __DIR__ . "/test.tpl";
    require_once __DIR__ . "/footer.tpl";
}, 'test');
$router->map('GET', '/bahnhof/[i:id]/config', function($router, $db, $id_station) {
    require_once __DIR__ . "/header_bahnhof_config.tpl";
    require_once __DIR__ . "/bahnhof_config.tpl";
    require_once __DIR__ . "/footer.tpl";
}, 'bahnhof_config');
$router->map('GET', '/bahnhof/[i:id]', function($router, $db, $id_station) {
    require_once __DIR__ . "/header_bahnhof.tpl";
    require_once __DIR__ . "/bahnhof.tpl";
    require_once __DIR__ . "/footer.tpl";
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
