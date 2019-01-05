class EcosCom
{
    constructor()
    {
        this._socket = io('http://' + IP + ':3000');
        this._reply_queue = [];
        this._event_queue = [];
        this._socket.on('ecos_reply', (data) => {
            console.log(data);
            if(data.message_id in this._reply_queue)
                this._reply_queue[data.message_id](data.body, data.err);
        });

        this._socket.on('ecos_event', (data) => {
            console.log(data);
            if(data.header.cmd in this._event_queue)
                this._event_queue[data.header.cmd](data.body, data.err);
        });
    }


    send_cmd(cmd, id, args, cb)
    {
        this._socket.emit('ecos_cmd', {
            cmd: cmd,
            id: id,
            args: args
        }, (msg_id) => {
            this._reply_queue[msg_id] = cb;
        });
    }

    request_view(id, cb, cb_request)
    {
        this.send_cmd('request', id, ['view'], (data, err) => {
            if(cb_request !== undefined) cb_request(err);
            if(!err.state)
                this._event_queue[id] = cb;
        });
    }

    release_view(id)
    {
        this.send_cmd('release', id, ['view'], (data, err) => {
            if(!err.state)
                delete this._event_queue[id];
        });
    }
}

class Station
{
    constructor(rows, cols)
    {
        this._row_count = rows;
        this._col_count = cols;
        this._item_size = 64;
    }

    add_tracks(data)
    {
        data.forEach((item, index) => {
            var trackItem = this.create_track_item(item.id, item.id_track_item,
                item.angle, item.position, item.drives, item.drive_count);

            if(TrackContainer.grid[item.position] === void 0)
            {
                return;
            }
            TrackContainer.grid[item.position].set_track_item(trackItem);
        });
    }

    build_grid($target)
    {
        for(var i = 0; i < this._row_count; i++)
        {
            for(var j = 0; j < this._col_count; j++)
            {
                var trackContainer = this.create_track_container(i + '-' + j);
                trackContainer.append_html($target);
            }
        }
    }

    build_station($target)
    {
        this.resize_target($target);
        this.build_grid($target);
        $.post(BASE_PATH + '/get_station', {
            'id_station': ID_STATION
        }, (data) => {
            if(data.res) this.add_tracks(data.data);
        }, 'json');
    }

    create_track_container(position)
    {
        return new TrackContainer(position);
    }

    create_track_item(id, type, angle, pos, drives, drive_count)
    {
        if(drive_count === "0")
            return new TrackItem(id, type, angle, pos, drives);
        else
            return new DrivenTrackItem(id, type, angle, pos, drives);
    }

    get_grid_count()
    {
        return this._col_count * this._row_count;
    }

    resize_target($target)
    {
        $target.width(this._item_size * this._col_count);
        $target.height(this._item_size * this._row_count);
    }
}
Station.ecos = new EcosCom();

class ConfigStation extends Station
{
    constructor(rows, cols)
    {
        super(rows, cols);
    }

    build_inventory($target)
    {
        Station.ecos.send_cmd('queryObjects', 11, ['name1', 'name2', 'name3', 'addr'], (data, err) => {
            if(err.state) return
            data.forEach(function(args, index) {
                var $cont = $('<div/>', {'class': 'card card-body p-1'});
                for(let [key, arg] of Object.entries(args)) {
                    $cont.append($('<div/>', {'class':'small'}).text(key + ": " + arg));
                }
                $target.append(
                    $('<div/>', {
                        'class':'alert alert-dark mb-1 ecos-item',
                        'id':'ecos-item-' + args.id + '-' + args.addr,
                        'draggable':true
                    }).append(
                        $('<div/>',{'class':'float-left'}).text(args.name1)
                    ).append(
                        $('<a/>', {
                            'class':'dropdown-toggle ml-2 small',
                            'href':'#',
                            'data-toggle':'collapse',
                            'data-target':'#ecos-item-dropdown-' + index,
                            'aria-expanded':false,
                            'aria-controls':'ecos-item-dropdown-' + index
                        }).text('Details')
                    ).append(
                        $('<div/>', {
                            'class': 'collapse',
                            'id':'ecos-item-dropdown-' + index
                        }).append($cont)
                    ).on('dragstart', function(e) {
                        var ids = $(this).attr('id').split('-');
                        e.originalEvent.dataTransfer.setData("ecos-item-id", args.id);
                        e.originalEvent.dataTransfer.setData("ecos-item-addr", args.addr);
                    })
                );
            });
        });
    }

    build_library($target)
    {
        $.get(BASE_PATH + '/get_library', function(data) {
            if(data.res)
            {
                data.data.forEach(function(item, index) {
                    var trackItem = new LibraryTrackItem(item.id);
                    trackItem.append_html($target);
                });
            }
        }, 'json');
    }

    create_track_container(position)
    {
        return new ConfigTrackContainer(position);
    }

    create_track_item(id, type, angle, pos, drives)
    {
        return new ConfigTrackItem(id, type, angle, pos, drives);
    }
}

class TrackContainer
{
    constructor(position)
    {
        this._position = position;
        this._track_item = null;
        this._$html = null;
        TrackContainer.grid[this._position] = this;
    }

    append_html($target)
    {
        var id = 'track-container-' + this._position;
        $target.append(
            $('<div/>', {
                'id': id,
                'class':'track-container'
            })
        );
        this._$html = $('#' + id);
        this._$html.addClass('border-left border-bottom');
    }

    clear_track_item()
    {
        this._track_item = null;
        this._$html.removeClass('busy');
        this._$html.empty();
    }

    get_track_item()
    {
        return this._track_item;
    }

    get_position()
    {
        return this._position;;
    }

    set_track_item(track_item)
    {
        this.clear_track_item();
        this._track_item = track_item;
        this._track_item.append_html(this._$html);
        this._$html.addClass('busy');
        this._$html.removeClass('dragover');
    }
}
TrackContainer.grid = {};

class ConfigTrackContainer extends TrackContainer
{
    constructor(id)
    {
        super(id);
    }

    append_html($target)
    {
        super.append_html($target);
        this._$html.addClass('border-warning');
        this._$html.on('dragover', (e) => {
            e.preventDefault();
            if(!e.originalEvent.dataTransfer.getData("track-item-position"))
                return;
            this.dragover();
        });
        this._$html.on('dragleave', (e) => {
            e.preventDefault();
            if(!e.originalEvent.dataTransfer.getData("track-item-position"))
                return;
            this.dragleave();
        });
        this._$html.on('drop', (e) => {
            e.preventDefault();
            var old_pos = e.originalEvent.dataTransfer.getData("track-item-position");
            var type = e.originalEvent.dataTransfer.getData("track-item-type");
            var trackItem = null;
            var old_container = null;
            if(old_pos === "" || type === "") return;
            if(old_pos === "null")
            {
                trackItem = new ConfigTrackItem(null, type, 0, this._position, []);
            }
            else
            {
                old_container = TrackContainer.grid[old_pos];
                trackItem = old_container.get_track_item();
                trackItem.set_position(this._position);
                old_container.clear_track_item();
            }
            trackItem.update_db((id) => {
                trackItem.set_id(id);
                this.set_track_item(trackItem);
            }, true);
        });
    }

    clear_track_item()
    {
        this._track_item = null;
        this._$html.removeClass('busy');
        this._$html.empty();
    }

    dragleave()
    {
        this._$html.removeClass('dragover');
    }

    dragover()
    {
        this._$html.addClass('dragover');
    }
}

class TrackItem
{
    constructor(id, type, angle, position, drives)
    {
        this._id = id;
        this._type = type;
        this._angle = parseInt(angle);
        this._position = position;
        this._drives = drives;
        this._$html = null;
    }

    append_html($target)
    {
        var id = 'track-item-' + this._type;
        if(this._id !== null)
            id += '-' + this._id;
        $target.append(
            $('<div/>', {
                'id': id,
                'class': 'track-item track-' + this._type
            })
        );
        this._$html = $('#' + id);
        this.update_rotation();
        this._drives.forEach((drive, index) => {
            if(drive === null) return;
            this.init_state(drive);
        });
    }

    set_position(position)
    {
        this._position = position;
    }

    init_state(drive)
    {
        this.set_wait_state(drive.drive_number);
    }

    set_wait_state(drive_number)
    {
        this._$html.addClass('pending-' + drive_number);
        this._$html.removeClass('state-' + drive_number + '-' + DrivenTrackItem.ecos_states[0]);
        this._$html.removeClass('state-' + drive_number + '-' + DrivenTrackItem.ecos_states[1]);
    }

    update_rotation()
    {
        this._$html.css('transform', 'rotate(' + this._angle + 'deg)');
    }
}
TrackItem.counter = 0;

class DrivenTrackItem extends TrackItem
{
    constructor(id, type, angle, position, drives)
    {
        super(id, type, angle, position, drives);
    }

    append_html($target)
    {
        super.append_html($target);
        this._drives.forEach((drive, index) => {
            this._$html.addClass('no-view-' + index +' no-state-' + index);
            if(drive !== null)
                Station.ecos.request_view(drive.id, (data, err) => {
                    this.update_state(data, index);
                }, (err) => {
                    this._$html.removeClass('no-view-' + index);
                });
        });
        this._$html.on('click', (e) => {
            if(this._$html.hasClass('track-item-modal'))
                return;
            var $selection_box = $('<div/>', {'class': 'track-item-selection-box border d-flex'});
            var state_count = this._drives.length;
            var states = [];
            for(var i = 0; i < Math.pow(2, state_count); i++)
            {
                var bin_str = i.toString(2);
                var state_items = [];
                var zeros = new Array(state_count - bin_str.length).fill(0).join();
                var state_set = true;
                bin_str = zeros + bin_str;
                for(var j = 0; j < state_count; j++)
                {
                    var state_item = "state-" + j + '-' + DrivenTrackItem.ecos_states[bin_str[j]];
                    state_items.push(state_item);
                    if(!this._$html.hasClass(state_item))
                        state_set = false;
                }
                if(!state_set)
                    states.push(state_items);
            }
            if(states.length === 1)
            {
                var elems = states[0][0].split('-');
                this.set_switch_state(this._drives[elems[1]], elems[2]);
            }
            else
            {
                states.forEach((state_items, index) => {
                    $selection_box.append(
                        $('<div/>', {'class': 'track-item track-' + this._type + ' m-1 inline-block ' + state_items.join(' ')}).on('click', (e) => {
                            e.stopPropagation();
                            state_items.forEach((item, index) => {
                                if(this._$html.hasClass(item)) return;
                                var elems = item.split('-');
                                this.set_switch_state(this._drives[elems[1]], elems[2]);
                            });
                            $selection_box.remove();
                            this._$html.removeClass('track-item-modal');
                        })
                    );
                });
                this._$html.append($selection_box);
                this._$html.addClass('track-item-modal');
            }
        });
    }

    init_state(drive)
    {
        super.init_state(drive);
        if(drive.state === null)
            this.get_switch_state(drive);
    }

    get_switch_state(drive)
    {
        Station.ecos.send_cmd('get', 11, ['switch[DCC' + drive.addr + 'r]'], (data, err) => {
            this.update_state(data, drive.drive_number);
            this._$html.removeClass('no-state-' + drive.drive_number);
        });
    }

    set_switch_state(drive, state)
    {
        Station.ecos.send_cmd('set', 11, ['switch[DCC' + drive.addr + state + ']'], (data, err) => {
            this.set_wait_state(drive.drive_number);
        });
    }

    update_state(data, idx)
    {
        var state, state_inv;
        if(data[0].switch !== undefined)
            state = parseInt(data[0].switch)
        else if(data[0].state !== undefined)
            state = parseInt(data[0].state)
        var state_inv = 1 - state;
        if(this._drives[idx].is_inverted == 1)
        {
            state = state_inv;
            state_inv = 1 - state_inv;
        }
        this._drives[idx].state = state;
        this._$html.addClass('state-' + idx + '-' + DrivenTrackItem.ecos_states[state]);
        this._$html.removeClass('pending-' + idx + ' state-' + idx + '-' + DrivenTrackItem.ecos_states[state_inv]);
    }
}
DrivenTrackItem.ecos_states = ['g', 'r'];

class DraggableTrackItem extends TrackItem
{
    constructor(id, type, angle, position, drives)
    {
        super(id, type, angle, position, drives);
    }

    append_html($target)
    {
        super.append_html($target);
        this._$html.on('dragstart', (e) => {
            e.originalEvent.dataTransfer.setData("track-item-position", this._position);
            e.originalEvent.dataTransfer.setData("track-item-type", this._type);
        });
        this._$html.attr('draggable', true);
    }
}

class ConfigTrackItem extends DraggableTrackItem
{
    constructor(id, type, angle, position, drives)
    {
        super(id, type, angle, position, drives);
    }

    dragleave()
    {
        if(!this.is_droppable()) return;
        this._$html.removeClass('dragover');
    }

    dragover()
    {
        if(!this.is_droppable()) return;
        this._$html.addClass('dragover');
    }

    append_html($target)
    {
        super.append_html($target);
        this._$html.on('dblclick', (e) => {
            if(this._$html.hasClass('processing'))
                return;
            this._$html.addClass('processing');
            this._angle += 90;
            if(this._angle >= 360)
                this._angle = 0;
            this.update_db((id) => {
                this.update_rotation();
                this._$html.removeClass('processing');
            }, false);
        });
        this._$html.on('dragleave', (e) => {
            e.preventDefault();
            if(!e.originalEvent.dataTransfer.getData("ecos-item-id")) return;
            this.dragleave();
        });
        this._$html.on('dragover', (e) => {
            e.preventDefault();
            if(!e.originalEvent.dataTransfer.getData("ecos-item-id")) return;
            this.dragover();
        });
        this._$html.on('drop', (e) => {
            e.preventDefault();
            var id = e.originalEvent.dataTransfer.getData("ecos-item-id");
            var addr = e.originalEvent.dataTransfer.getData("ecos-item-addr");
            var drive_nb = 0;
            var rm_classes = "";
            if(id === "" || addr === "" || !this.is_droppable()) return;
            this._drives.forEach((drive, index) => {
                if(this._$html.hasClass('pending-' + index))
                {
                    drive_nb++;
                    rm_classes += ' pending-' + index;
                }
            });
            if(this._drives.length == drive_nb)
            {
                drive_nb = 0;
                this._$html.removeClass(rm_classes);
            }
            $.post(BASE_PATH + '/update_instance_ecos', {
                'id': this._id,
                'id_station': ID_STATION,
                'ecos_id': id,
                'ecos_addr': addr,
                'drive': drive_nb,
                'is_inverted': 0
            }, (data) => {
                if(data.res)
                {
                    this._drives[drive_nb] = {id: id, addr:addr};
                    this.dragleave();
                    this.set_wait_state(drive_nb);
                }
            }, 'json');
        });

    }

    is_droppable()
    {
        return (this._type > 2);
    }

    update_db(cb, remove)
    {
        $.post(BASE_PATH + '/update_instance', {
            'id': this._id,
            'id_track_item': this._type,
            'id_station': ID_STATION,
            'angle': this._angle,
            'position': this._position,
            'remove': remove
        }, (data) => {
            if(data.res)
                cb(data.id);
        }, 'json');
    }

    set_id(id)
    {
        if(this._id !== null) return;
        this._id = id;
        if(this._$html !== null)
            this._$html.attr('id', this._$html.attr('id') + '-' + id);
    }
}

class LibraryTrackItem extends DraggableTrackItem
{
    constructor(type)
    {
        super('lib', type, 0, null, []);
    }

    append_html($target)
    {
        super.append_html($target);
        this._$html.addClass('border mb-1');
    }
}
