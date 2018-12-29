function Station(row, col, is_editable)
{
    var me = this;
    me._new_item_id = 0;
    me.trackItems = [];
    me.trackContainers = [];
    me._is_editable = is_editable;
    me.config = [];
    me._col_count = col;
    me._row_count = row;
    me._item_size = 64;

    function update_db(item, position, cb, remove)
    {
        $.post(BASE_PATH + '/update_instance', {
            'id': item.get_id(),
            'id_track_item': item.get_type(),
            'id_station': ID_STATION,
            'angle': item.get_angle(),
            'position': position,
            'remove': remove
        }, function(data) {
            if(data.res)
                cb();
        }, 'json');
    }

    function update_container_item(container, item)
    {
        container.set_track_item(item);
        if(me._is_editable)
        {
            item.register_event('dragstart', grab_track_item, container.get_position());
            item.register_event('dblclick', rotate_track_item, container.get_position());
            item.register_event('dragleave', leave_item);
            item.register_event('dragover', enter_item);
            item.register_event('drop', drop_ecos_item);
        }
        item.set_draggable(me._is_editable);
    }

    function drop_track_item(e, container)
    {
        e.preventDefault();
        var pos = e.originalEvent.dataTransfer.getData("track-item-position");
        var type = e.originalEvent.dataTransfer.getData("track-item-type");
        if(pos === "" || type === "") return;
        var trackItem = null;
        var old_container = null;
        if(pos === "null")
        {
            me._new_item_id++;
            trackItem = new TrackItem(me._new_item_id, type, 0);
        }
        else
        {
            old_container = me.trackContainers[pos];
            trackItem = old_container.get_track_item();
            old_container.clear_track_item();
        }
        update_db(trackItem, container.get_position(), function() {
            update_container_item(container, trackItem);
        }, true);
    }

    function drop_ecos_item(e, item)
    {
        e.preventDefault();
        var id = e.originalEvent.dataTransfer.getData("ecos-item-id");
        var addr = e.originalEvent.dataTransfer.getData("ecos-item-addr");
        if(id === "" || addr === "" || !item.is_droppable()) return;
        $.post(BASE_PATH + '/update_instance_ecos', {
            'id': item.get_id(),
            'id_station': ID_STATION,
            'ecos_id': id,
            'ecos_addr': addr
        }, function(data) {
            if(data.res)
            {
                item.dragleave();
                item.set_wait_state();
            }
        }, 'json');
    }

    function grab_track_item(e, item, pos)
    {
        e.originalEvent.dataTransfer.setData("track-item-position", pos);
        e.originalEvent.dataTransfer.setData("track-item-type", item.get_type());
    }

    function rotate_track_item(e, item, pos)
    {
        var angle = item.get_angle();
        angle += 90;
        if(angle >= 360)
            angle = 0;
        item.set_angle(angle);
        update_db(item, pos, function() {
            item.rotate(angle);
        }, false);
    }

    function enter_item(e, item)
    {
        e.preventDefault();
        if(!e.originalEvent.dataTransfer.getData("ecos-item-id"))
            return;
        item.dragover();
    }

    function leave_item(e, item)
    {
        e.preventDefault();
        if(!e.originalEvent.dataTransfer.getData("ecos-item-id"))
            return;
        item.dragleave();
    }

    function enter_container(e, container)
    {
        e.preventDefault();
        if(!e.originalEvent.dataTransfer.getData("track-item-position"))
            return;
        container.dragover();
    }

    function leave_container(e, container)
    {
        e.preventDefault();
        if(!e.originalEvent.dataTransfer.getData("track-item-position"))
            return;
        container.dragleave();
    }

    this.build_canvas = function($target)
    {
        var i;
        $target.width(me._item_size * me._col_count);
        $target.height(me._item_size * me._row_count);
        for(i = 0; i < (me._col_count * me._row_count); i++)
        {
            var trackContainer = new TrackContainer(i);
            trackContainer.append_html($target);
            if(me._is_editable)
            {
                trackContainer.register_event('drop', drop_track_item);
                trackContainer.register_event('dragleave', leave_container);
                trackContainer.register_event('dragover', enter_container);
                trackContainer.set_droppable();
            }
            me.trackContainers.push(trackContainer);
        }
        $.post(BASE_PATH + '/get_station', {
            'id_station': ID_STATION,
        }, function(data) {
            if(data.res)
            {
                data.data.forEach(function(item, index) {
                    var item_id = parseInt(item.id);
                    var trackItem = new TrackItem(item_id, item.id_track_item, item.angle);
                    if(me.trackContainers[item.position] === void 0) return;
                    update_container_item(me.trackContainers[item.position], trackItem);
                    if(item.ecos_id !== null && item.ecos_addr !== null)
                        trackItem.set_wait_state();
                    if(me._new_item_id < item_id) me._new_item_id = item_id;
                });
            }
        }, 'json');
    }

    this.build_library = function($target)
    {
        if(!me._is_editable) return;
        $.get(BASE_PATH + '/get_library', function(data) {
            if(data.res)
            {
                data.data.forEach(function(item, index) {
                    var trackItem = new TrackItem(null, item.id, 0);
                    trackItem.append_html($target);
                    trackItem.register_event('dragstart', grab_track_item, null);
                    trackItem.register_event('dblclick', rotate_track_item, null);
                    trackItem.set_draggable(true);
                });
            }
        }, 'json');
    }
}

function TrackContainer(id)
{
    var me = this;
    me._id = id;
    me._track_item = null;
    me._$html = null;

    this.append_html = function($target)
    {
        var id = 'track-container-' + me._id;
        $target.append(
            $('<div/>', {
                'id': id,
                'class':'track-container'
            })
        );
        me._$html = $('#' + id);
    }

    this.clear_track_item = function()
    {
        me._track_item = null;
        me._$html.removeClass('busy');
        me._$html.empty();
    }

    this.dragleave = function()
    {
        me._$html.removeClass('dragover');
    }

    this.dragover = function()
    {
        me._$html.addClass('dragover');
    }

    this.get_track_item = function()
    {
        return me._track_item;
    }

    this.get_position = function()
    {
        return me._id;
    }

    this.register_event = function(event, cb)
    {
        me._$html.on(event, function(e) {
            cb(e, me);
        });
    }

    this.set_track_item = function(track_item)
    {
        me.clear_track_item();
        me._track_item = track_item;
        me._track_item.append_html(me._$html);
        me._$html.addClass('busy');
        me._$html.removeClass('dragover');
    }

    this.set_droppable = function()
    {
        me._$html.addClass('border-left border-bottom');
    }
}

function TrackItem(id, type, angle)
{
    var me = this;
    me._id = id;
    me._type = type;
    me._is_draggable = false;
    me._angle = angle;
    me._$html = null;

    this.append_html = function($target)
    {
        var id = 'track-item-' + me._type;
        if(me._id !== null)
            id += '-' + me._id;
        $target.append(
            $('<div/>', {
                'id': id,
                'class': 'track-item track-' + me._type
            }).css('transform', 'rotate(' + me._angle + 'deg)')
        );
        me._$html = $('#' + id);
    }

    this.dragleave = function()
    {
        if(!me.is_droppable()) return;
        me._$html.removeClass('dragover');
    }

    this.dragover = function()
    {
        if(!me.is_droppable()) return;
        me._$html.addClass('dragover');
    }

    this.get_angle = function()
    {
        return me._angle;
    }

    this.get_id = function()
    {
        return me._id;
    }

    this.get_type = function()
    {
        return me._type;
    }

    this.is_draggable = function()
    {
        return me._is_draggable;
    }

    this.is_droppable = function()
    {
        return (me._type > 2);
    }

    this.register_event = function(event, cb, args)
    {
        args = args || null;
        me._$html.on(event, function(e) {
            cb(e, me, args);
        });
    }

    this.rotate = function(angle)
    {
        me._angle = angle;
        me._$html.css('transform', 'rotate(' + angle + 'deg)');
    }

    this.set_angle = function(angle)
    {
        me._angle = angle;
    }

    this.set_draggable = function(is_draggable)
    {
        if(is_draggable)
        {
            me._is_draggable = true;
            me._$html.attr('draggable', true);
        }
        else
        {
            me._is_draggable = false;
            me._$html.removeAttr('draggable');
        }
    }

    this.set_wait_state = function()
    {
        me._$html.addClass('animated');
    }
}
