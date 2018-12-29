<div class="container-fluid">
    <?php
        $active = array("", "");
        $active[$id_station] = "active";
        $target = "bahnhof";
        require __DIR__ . "/nav.tpl";
    ?>
    <div class="canvas bg-light d-flex flex-wrap"></div>
</div>
