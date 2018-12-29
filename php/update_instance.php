<?php
if($_POST['remove'] === "true")
    $db->remove_by_fks('instances', array(
        'id_station' => $_POST['id_station'] ?? null,
        'position' => $_POST['position'] ?? null
    ));

$insert = array(
    'id_track_item' => $_POST['id_track_item'] ?? null,
    'id_station' => $_POST['id_station'] ?? null,
    'angle' => $_POST['angle'] ?? null,
    'position' => $_POST['position'] ?? null,
);

if(isset($_POST['id']) && $_POST['id'] !== "")
    $insert['id'] = $_POST['id'];

$res = $db->insert('instances', $insert, array(
    'id_track_item' => $_POST['id_track_item'] ?? null,
    'angle' => $_POST['angle'] ?? null,
    'position' => $_POST['position'] ?? null,
));

$answer = array(
    'res' => $res !== false,
    'err' => $res === false ? "unable to update the instance" : "",
    'id' => ($res !== false) ? $res : null,
);

echo json_encode($answer);
?>
