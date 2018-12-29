<nav class="navbar navbar-expand-lg navbar-light bg-light">
    <a class="navbar-brand" href="<?php echo $router->generate('home'); ?>">Home</a>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto">
            <li class="nav-item <?php echo $active[1]; ?>">
                <a class="nav-link" href="<?php echo $router->generate($target, array('id' => 1)); ?>">Bahnhof 1</a>
            </li>
            <li class="nav-item <?php echo $active[2]; ?>">
                <a class="nav-link" href="<?php echo $router->generate($target, array('id' => 2)); ?>">Bahnhof 2</a>
            </li>
        </ul>
    </div>
</nav>
