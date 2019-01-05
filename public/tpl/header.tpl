<?php
if(!isset($custom_js)) $custom_js = null;
if(!isset($custom_css)) $custom_css = null;
if(!isset($js_includes)) $js_includes = null;
if(!isset($css_includes)) $css_includes = null;
?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" lang="de">
<head>
    <title>Stellwerk</title>
    <meta http-equiv="content-type" content="text/html; charset=UTF-8" />
    <meta charset="UTF-8" />
    <meta name="description" content="A Front-end to the ESU ECoS" />
    <meta name="author" content="Simon Maurer" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style type="text/css">
        <?php print_tpl($custom_css); ?>
    </style>
    <link rel="stylesheet" type="text/css" href="<?php echo BASE_PATH ?>/css/bootstrap.min.css" />
    <link rel="stylesheet" type="text/css" href="<?php echo BASE_PATH ?>/css/main.css" />
    <?php print_tpl($css_includes); ?>
    <script type="text/javascript">
        <?php foreach($custom_js as $js) echo $js; ?>
    </script>
    <script src="<?php echo BASE_PATH ?>/js/jquery.min.js" type="text/javascript"></script>
    <script src="<?php echo BASE_PATH ?>/js/bootstrap.min.js" type="text/javascript"></script>
    <?php print_tpl($js_includes); ?>
</head>
<body>
