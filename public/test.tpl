<div class="container mt-3">
    <div class="card">
        <div class="card-header">
            Message Log
        </div>
        <div class="card-body">
            <div class="accordion" id="event-log">
            </div>
        </div>
    </div>
    <div class="card mt-1">
        <div class="card-body">
            <input type="hidden" id="rpi-ip" class="form-control" value="<?php echo $_SERVER['SERVER_ADDR']; ?>">
            <div class="form-group">
                <textarea id="ecos-cmd-msg" class="form-control"></textarea>
            </div>
            <button id="ecos-cmd" class="btn btn-primary">Submit</button>
        </div>
    </div>
</div>
