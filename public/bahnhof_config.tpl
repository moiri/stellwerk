<div class="container-fluid">
    <?php
        $active = array("", "");
        $active[$id_station] = "active";
        $target = "bahnhof_config";
        require __DIR__ . "/nav.tpl";
    ?>
    <div class="row mt-3">
        <div id="library" class="col-auto">
        </div>
        <div class="col">
            <div class="canvas border-top border-right border-warning d-flex flex-wrap"></div>
        </div>
        <div id="ecos-items" class="col-auto">
        </div>
    </div>
</div>
