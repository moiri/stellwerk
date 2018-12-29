<?php
if($_POST['remove'] === "true")
    $db->remove_by_fks('instances', array(
        'id_station' => $_POST['id_station'] ?? null,
        'position' => $_POST['position'] ?? null
    ));

$res = $db->insert('instances', array(
    'id' => $_POST['id'] ?? null,
    'id_track_item' => $_POST['id_track_item'] ?? null,
    'id_station' => $_POST['id_station'] ?? null,
    'angle' => $_POST['angle'] ?? null,
    'position' => $_POST['position'] ?? null,
), array(
    'id_track_item' => $_POST['id_track_item'] ?? null,
    'angle' => $_POST['angle'] ?? null,
    'position' => $_POST['position'] ?? null,
));

$answer = array(
    'res' => $res !== false,
    'err' => $res === false ? "unable to update the instance" : "",
);

echo json_encode($answer);
?>
