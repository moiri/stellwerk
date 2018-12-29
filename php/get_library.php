<?php
    $sql = "SELECT * FROM track_items ORDER BY position";
    $res = $db->query_db($sql);
    $answer = array(
        'res' => $res !== false,
        'err' => $res === false ? "unable to load the track items" : "",
        'data' => $res !== false ? $res : null,
    );
    echo json_encode($answer);
?>
