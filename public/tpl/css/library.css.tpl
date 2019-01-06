<?php $items = $db->select_table('track_items');
    foreach($items as $item)
    {
        $id = intval($item['id']);
        $base_url = BASE_PATH . '/img/' . $item['img_name'];
        $drive_count = intval($item['drive_count']);
        if($drive_count > 0)
        {
            $ecos_states = array('g', 'r');
            $suffix = "";
            for($i = 0; $i<$drive_count; $i++)
            {
                $suffix .= ".pending-" . $i;
                $important = false;
                if($i == $drive_count -1)
                {
                    $important = true;
                }
                $url = $base_url . "_" . $i . ".gif";
                require __DIR__ . "/library_item.css.tpl";
            }
            for($i = 0; $i<pow(2, $drive_count); $i++)
            {
                $important = false;
                $suffix = "";
                $states = array_reverse(str_split(sprintf('%0' . $drive_count . 'd', decbin($i))));
                foreach($states as $idx => $s)
                    $suffix .= ".state-" . $idx . "-" . $s;
                $url = $base_url. "_" . implode('_', $states) . ".png";
                require __DIR__ . "/library_item.css.tpl";
                if($i % 2 === 0 && $drive_count > 1)
                {
                    for($j = 0; $j<$drive_count; $j++)
                    {
                        $important = false;
                        $suffix = "";;
                        $states = array_reverse(str_split(sprintf('%0' . $drive_count . 'd', decbin($i))));
                        unset($states[0]);
                        array_splice($states, $j, 0, 'x');
                        foreach($states as $idx => $s)
                        {
                            if($s === 'x')
                                $suffix .= ".pending-" . $j;
                            else
                                $suffix .= ".state-" . $idx . "-" . $s;
                        }
                        $url = $base_url. "_" . implode('_', $states) . ".gif";
                        require __DIR__ . "/library_item.css.tpl";
                    }
                }
            }
        }
        $suffix = "";
        $url = $base_url . ".png";
        $important = false;
        require __DIR__ . "/library_item.css.tpl";
    }
?>
