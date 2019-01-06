<?php
    $fk = $_POST['id_station'] ?? null;
$sql = "SELECT i.*, ti.drive_count FROM instances AS i
        LEFT JOIN track_items AS ti ON ti.id = i.id_track_item
        WHERE id_station = :fk";
    $res = $db->query_db($sql, array(':fk' => $fk));
    $answer = array(
        'res' => $res !== false,
        'err' => $res === false ? "unable to load the instances" : "",
        'data' => $res !== false ? array() : null,
    );
    $sql = "SELECT di.*
        FROM drive_instances AS di
        LEFT JOIN instances AS i ON i.id = di.id_instance
        WHERE i.id_station = :fk ORDER BY di.id, di.drive_number";
    $drives = $db->query_db($sql, array(':fk' => $fk));
    foreach($res as $instance)
    {
        $instance['drives'] = array_fill(0, $instance['drive_count'], null);
        foreach($drives as $drive)
        {
            $drive['state'] = null;
            if($instance['id'] === $drive['id_instance'])
                $instance['drives'][intval($drive['drive_number'])] = $drive;
        }
        $answer['data'][] = $instance;
    }
    echo json_encode($answer);
?>
