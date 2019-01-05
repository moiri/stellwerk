<li class="nav-item <?php echo ($id_station == $station['id']) ? "active" : ""; ?>">
    <a class="nav-link" href="<?php echo $router->generate($target, array('id' => $station['id'])); ?>"><?php echo $station['name']; ?></a>
</li>

