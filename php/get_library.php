<?php
    $res = $db->select_table('track_items');
    $answer = array(
        'res' => $res !== false,
        'err' => $res === false ? "unable to load the track items" : "",
        'data' => $res !== false ? $res : null,
    );
    echo json_encode($answer);
?>
