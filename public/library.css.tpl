<style type="text/css">
<?php
    $items = $db->select_table('track_items');
    foreach($items as $item)
    {
        $id = intval($item['id']);
        $suffix = "";
        $base_url = BASE_PATH . '/img/' . $item['img_name'];
        $url = $base_url . ".png";
        require __DIR__ . "/library_item.css.tpl";
        $drive_count = intval($item['drive_count']);
        if($drive_count > 0)
        {
            $ecos_states = array('g', 'r');
            $suffix = ".pending";
            $url = $base_url . ".gif";
            require __DIR__ . "/library_item.css.tpl";
            for($i = 0; $i<pow(2, $drive_count); $i++)
            {
                $suffix = "";
                $states = str_split(sprintf('%0' . $drive_count . 'd', decbin($i)));
                foreach($states as $idx => $s)
                    $suffix .= ".state-" . $idx . "-" . $ecos_states[$s];
                $url = $base_url. "_" . implode('_', $states) . ".png";
                require __DIR__ . "/library_item.css.tpl";
            }
        }
    }
?>
</style>
