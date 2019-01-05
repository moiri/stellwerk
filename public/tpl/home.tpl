<?php
    $stations = $db->select_table('station');
?>
<div class="container">
    <div class="jumbotron mt-3">
        <div class="display-1">Stellwerk</div>
    </div>
    <?php foreach($stations as $station) require __DIR__ . "/home_station.tpl"; ?>
</div>
