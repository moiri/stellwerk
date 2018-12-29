<div class="container-fluid">
    <?php
        $active = array("", "");
        $active[$id_station] = "active";
        $target = "bahnhof";
        require __DIR__ . "/nav.tpl";
    ?>
    <div class="mt-3 canvas border-top border-right d-flex flex-wrap"></div>
</div>
