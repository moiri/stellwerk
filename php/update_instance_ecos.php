<?php
$res = $db->insert('drive_instances', array(
    'id' => $_POST['ecos_id'] ?? null,
    'addr' => $_POST['ecos_addr'] ?? null,
    'id_instance' => $_POST['id'] ?? null,
    'drive_number' => $_POST['drive'] ?? null,
    'is_inverted' => $_POST['is_inverted'] ?? null,
), array(
    'id' => $_POST['ecos_id'] ?? null,
    'addr' => $_POST['ecos_addr'] ?? null,
    'is_inverted' => $_POST['is_inverted'] ?? null,
));

$answer = array(
    'res' => $res !== false,
    'err' => $res === false ? "unable to update the drive_instance" : "",
);

echo json_encode($answer);
?>
