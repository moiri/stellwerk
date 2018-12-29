<?php
$res = $db->update_by_ids('instances', array(
    'ecos_id' => $_POST['ecos_id'] ?? null,
    'ecos_addr' => $_POST['ecos_addr'] ?? null,
), array(
    'id' => $_POST['id'] ?? null,
    'id_station' => $_POST['id_station'] ?? null,
));

$answer = array(
    'res' => $res !== false,
    'err' => $res === false ? "unable to update the instance with ecos info" : "",
);

echo json_encode($answer);
?>
