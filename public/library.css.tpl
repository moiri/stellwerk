<style type="text/css">
<?php
    $items = $db->select_table('track_items');
    foreach($items as $item)
    {
        $id = intval($item['id']);
        $suffix = "";
        $url = BASE_PATH . '/' . $item['img_path'];
        require __DIR__ . "/library_item.css.tpl";
        if($item['img_path_animated'] !== null)
        {
            $suffix = ".animated";
            $url = BASE_PATH . '/' . $item['img_path_animated'];
            require __DIR__ . "/library_item.css.tpl";
        }
    }
?>
</style>
