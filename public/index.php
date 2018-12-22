<?php
require_once "../php/AltoRouter.php";
require_once "../php/globals.php";

$router = new AltoRouter();
$router->setBasePath(BASE_PATH);

$router->map('GET', '/', function($router) {
    require_once __DIR__ . "/header_home.tpl";
    require_once __DIR__ . "/home.tpl";
    require_once __DIR__ . "/footer.tpl";
}, 'home');
$router->map('GET', '/test', function($router) {
    require_once __DIR__ . "/header_bahnhof.tpl";
    require_once __DIR__ . "/test.tpl";
    require_once __DIR__ . "/footer.tpl";
}, 'test');
$router->map('GET', '/bahnhof/[i:id]', function($router, $id) {
    require_once __DIR__ . "/header_bahnhof.tpl";
    require_once __DIR__ . "/bahnhof_" . intval($id) . ".tpl";
    require_once __DIR__ . "/footer.tpl";
}, 'bahnhof');

// match current request url
$match = $router->match();

// call closure or throw 404 status
if($match && is_callable($match['target'])) {
    call_user_func_array($match['target'], array_merge(array($router), $match['params']));
} else {
    // no route was matched
    header($_SERVER["SERVER_PROTOCOL"] . ' 404 Not Found');
}
?>
