<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" lang="de">
<head>
    <title>Stellwerk</title>
    <meta http-equiv="content-type" content="text/html; charset=UTF-8" />
    <meta charset="UTF-8" />
    <meta name="description" content="A Front-end to the ESU ECoS" />
    <meta name="author" content="Simon Maurer" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <?php require __DIR__ . "/library.css.tpl"; ?>
    <link rel="stylesheet" type="text/css" href="<?php echo BASE_PATH ?>/css/bootstrap.min.css" />
    <link rel="stylesheet" type="text/css" href="<?php echo BASE_PATH ?>/css/main.css" />
    <script type="text/javascript">
        const BASE_PATH = "<?php echo BASE_PATH; ?>";
        const ID_STATION = "<?php echo $id_station; ?>";
        const IP = "<?php echo $_SERVER['SERVER_ADDR']; ?>";
    </script>
    <script src="<?php echo BASE_PATH ?>/js/jquery.min.js" type="text/javascript"></script>
    <script src="<?php echo BASE_PATH ?>/js/bootstrap.min.js" type="text/javascript"></script>
    <script src="<?php echo BASE_PATH ?>/js/socket.io.js" type="text/javascript"></script>
    <script src="<?php echo BASE_PATH ?>/js/station.js" type="text/javascript"></script>
    <script src="<?php echo BASE_PATH ?>/js/bahnhof_config.js" type="text/javascript"></script>
</head>
<body>