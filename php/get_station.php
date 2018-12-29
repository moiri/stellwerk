<?php
    $fk = $_POST['id_station'] ?? null;
    $res = $db->select_by_fk('instances', 'id_station', $fk);
    $answer = array(
        'res' => $res !== false,
        'err' => $res === false ? "unable to load the instances" : "",
        'data' => $res !== false ? $res : null,
    );
    echo json_encode($answer);
?>
