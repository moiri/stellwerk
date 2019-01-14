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
        this._row_count = parseInt(rows);
        this._col_count = parseInt(cols);
        this._item_size = 64;
    }

    get_track_item(con, pos)
    {
        var npos = this.get_next_position(con, pos);
        var cont = TrackContainer.grid[npos];
        if(cont !== undefined)
            return cont.get_track_item();
        return null;
    }

    add_tracks(data)
    {
        data.forEach((item, index) => {
            var trackItem = this.create_track_item(item);

            if(TrackContainer.grid[item.position] === void 0) return;
            TrackContainer.grid[item.position].set_track_item(trackItem);
        });
        for(let [key, container] of Object.entries(TrackContainer.grid)) {
            var item;
            if(container.has_track_item())
            {
                item = container.get_track_item();
                item.get_connection().forEach((con, index) => {
                    var pos = key.split('-');
                    item.add_neighbours(this.get_track_item(con[0], pos),
                        this.get_track_item(con[1], pos));
                });
            }
        }
    }

    get_next_position(direction, pos)
    {
        if(direction == 0)
            return pos[0] + '-' + (parseInt(pos[1]) - 1);
        else if(direction == 1)
            return (parseInt(pos[0]) + 1) + '-' + pos[1];
        else if(direction == 2)
            return pos[0] + '-' + (parseInt(pos[1]) + 1);
        else if(direction == 3)
            return (parseInt(pos[0]) - 1) + '-' + pos[1];
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
        $(window).on('resize', () => {
            this.resize_target($target);
        });
        this.build_grid($target);
        $.post(BASE_PATH + '/get_station', {
            'id_station': ID_STATION
        }, (data) => {
            if(data.res) this.add_tracks(data.data);
            this.resize_target($target);
        }, 'json');
    }

    create_track_container(position)
    {
        return new TrackContainer(position);
    }

    create_track_item(item)
    {
        if(item.drive_count === "0")
            return new UndrivenTrackItem(item);
        else
            return new DrivenTrackItem(item);
    }

    get_grid_count()
    {
        return this._col_count * this._row_count;
    }

    resize_target($target)
    {
        var item_size = parseInt(($('.station-container').innerWidth() - 1) / this._col_count);
        if(item_size > this._item_size) item_size = this._item_size;
        $target.innerWidth(item_size * this._col_count);
        $target.innerHeight(item_size * this._row_count);
        $target.children('.track-container').outerWidth(item_size).outerHeight(item_size);
        $target.find('.track-item').width(item_size).height(item_size);
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

    create_track_item(item)
    {
        return new ConfigTrackItem(item);
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

    has_track_item()
    {
        return (this._track_item !== null);
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
                trackItem = new ConfigTrackItem({id: null, id_track_item: type, angle: 0, position: this._position, drives: [], connection: "[]"});
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
    constructor(item)
    {
        this._id = item.id;
        this._type = item.id_track_item;
        this._angle = parseInt(item.angle);
        this._position = item.position;
        this._drives = item.drives;
        this._connection = JSON.parse(item.connection);
        this._neighbours = [];
        this._$html = null;
    }

    add_neighbours(item1, item2)
    {
        this._neighbours.push([item1, item2]);
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

    clear()
    {
        this._$html.removeClass('route');
        this._$html.removeClass('unique');
        this._$html.removeClass('active');
        this._$html.removeClass (function (index, className) {
            return (className.match (/(^|\s)route-\S+/g) || []).join(' ');
        });
    }

    get_connection()
    {
        var res = [];
        this._connection.forEach((con, index) => {
            res.push([this.rotate_connection(con[0]), this.rotate_connection(con[1])]);
        })
        return res;
    }

    rotate_connection(con)
    {
        var delta = this._angle / 90;
        if(con !== null)
        {
            con -= delta;
            if(con < 0) con += 4;
        }
        return con;
    }

    get_neighbours()
    {
        return this._neighbours;
    }

    get_id()
    {
        return this._id;
    }

    get_position()
    {
        return this._position;
    }

    get_drive_count()
    {
        return this._drives.length;
    }

    get_drive(idx)
    {
        return this._drives[idx];
    }

    highlight(css_route, index)
    {
        this._$html.addClass(css_route);
        if(index !== undefined)
            this._$html.addClass(css_route + '-' + index);
        else
            this._$html.addClass('unique');
    }

    show_box(route)
    {
        var $selection_box = $('<div/>', {
            'class': 'track-item-selection-box border d-flex',
            'style': 'transform: rotate(-' + this._angle + 'deg)'
        });
        $selection_box.append(
            $('<div/>', {'class': 'track-item m-1 inline-block accept'}).on('click', (e) => {
                e.stopPropagation();
                $selection_box.remove();
                this._$html.removeClass('route-modal');
                UndrivenTrackItem.set_route(route);
            })
        ).append(
            $('<div/>', {'class': 'track-item m-1 inline-block decline'}).on('click', (e) => {
                e.stopPropagation();
                $selection_box.remove();
                this._$html.removeClass('route-modal');
                UndrivenTrackItem.clear_route(route);
            })
        );
        this._$html.append($selection_box);
        this._$html.addClass('route-modal');
    }

    select_route(routes)
    {
        var css_route = UndrivenTrackItem.css_route;
        if(this._$html.hasClass(css_route)) return;
        this._$html.on('click.route', (e) => {
            var $items = $('.' + css_route);
            var $items_unselect = $items.not('.active');
            var $items_select = $items.filter('.active');
            var routes_to_remove = [];
            var route_keys, final_index;
            $items_unselect.removeClass(css_route);
            $items_unselect.off('mouseenter.route');
            $items_unselect.off('mouseleave.route');
            $items_unselect.each(function(idx) {
                var i, css;
                for(i = 0; i < routes.length; i++)
                {
                    css = css_route + '-' + i;
                    if($(this).hasClass(css))
                        if(!routes_to_remove.includes(css))
                            routes_to_remove.push(css);
                }
            });
            routes_to_remove.forEach((css) => {
                $items.removeClass(css);
                delete UndrivenTrackItem.active_routes[css];
            });
            route_keys = Object.keys(UndrivenTrackItem.active_routes);
            if(route_keys.length === 1)
            {
                $('.' + css_route).off('click.route');
                final_index = UndrivenTrackItem.active_routes[route_keys[0]];
                $items_select.addClass('unique');
                this.show_box(JSON.parse(routes[final_index]));
            }
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
        this._$html.removeClass('state-' + drive_number + '-0');
        this._$html.removeClass('state-' + drive_number + '-1');
    }

    update_rotation()
    {
        this._$html.css('transform', 'rotate(' + this._angle + 'deg)');
    }
}
TrackItem.counter = 0;

class UndrivenTrackItem extends TrackItem
{
    constructor(item)
    {
        super(item);
    }

    end_route()
    {
        var routes = [];
        var route = [];
        var css_route = UndrivenTrackItem.css_route;
        UndrivenTrackItem.route_state = 2;
        UndrivenTrackItem.compute_route(UndrivenTrackItem.route_start, this._id, route, routes);
        if(routes.length === 0)
        {
            UndrivenTrackItem.route_start.clear();
            UndrivenTrackItem.reset_route_states();
        }
        else if(routes.length === 1)
        {
            route = JSON.parse(routes[0]);
            UndrivenTrackItem.enable_route(route, routes);
            this.show_box(route);
        }
        else
        {
            routes.forEach((j_route, index) => {
                var route = JSON.parse(j_route);
                var selector = '.' + css_route + '.' + css_route + '-' + index;
                UndrivenTrackItem.active_routes[css_route + '-' + index] = index;
                UndrivenTrackItem.enable_route(route, routes, index);
                $(selector).on('mouseenter.route', (e) => {
                    $(selector).addClass('active');
                });
                $(selector).on('mouseleave.route', (e) => {
                    $(selector).removeClass('active');
                });
            });
        }
    }

    static enable_route(route, routes, index)
    {
        route.forEach((item) => {
            var track_item = TrackContainer.grid[item.pos].get_track_item();
            if(index !== undefined)
                track_item.select_route(routes);
            track_item.highlight(UndrivenTrackItem.css_route, index);
        });
    }

    start_route()
    {
        this.highlight(UndrivenTrackItem.css_route);
        UndrivenTrackItem.route_start = this;
        UndrivenTrackItem.route_state = 1;
    }

    append_html($target)
    {
        super.append_html($target);
        this._$html.on('click', (e) => {
            if(UndrivenTrackItem.route_state === 0)
                this.start_route();
            else if(UndrivenTrackItem.route_state === 1)
                this.end_route();
        });
    }

    static reset_route_states()
    {
        UndrivenTrackItem.route_state = 0;
        UndrivenTrackItem.route_start = null;
        UndrivenTrackItem.active_routes = {};
    }

    static clear_route(route)
    {
        UndrivenTrackItem.reset_route_states();
        route.forEach((item) => {
            var track_item = TrackContainer.grid[item.pos].get_track_item();
            track_item.clear();
        });
    }

    static set_route(route)
    {
        route.forEach((item) => {
            var track_item = TrackContainer.grid[item.pos].get_track_item();
            var idx, pos, zeros;
            var state = parseInt(item.state)
            var bin_str = state.toString(2);
            if(item.drive_count == 0) return;
            zeros = new Array(parseInt(item.drive_count) - bin_str.length).fill(0).join();
            bin_str = zeros + bin_str;
            for(idx = 0; idx < bin_str.length; idx++)
            {
                pos = idx;
                // pos = bin_str.length - idx - 1;
                state = parseInt(bin_str.charAt(pos));
                track_item.set_switch_state(track_item.get_drive(idx), state);
            }
        });
        UndrivenTrackItem.clear_route(route);
    }

    static compute_route(item, end_id, route, routes)
    {
        var cons = item.get_neighbours();
        var last_item = route[route.length - 1];
        route.push({id:item.get_id(), pos:item.get_position(), state:0, drive_count:item.get_drive_count()});
        if(item.get_id() === end_id)
        {
            routes.push(JSON.stringify(route));
            return;
        }
        cons.forEach((con, index) => {
            var next_items = [];
            if(last_item === undefined)
                next_items = [con[0], con[1]];
            else if(con[0] !== null && con[0].get_id() === last_item.id)
                next_items.push(con[1]);
            else if(con[1] !== null && con[1].get_id() === last_item.id)
                next_items.push(con[0]);
            next_items.forEach((next_item) => {
                if(next_item === null) return;
                route[route.length - 1].state = index;
                UndrivenTrackItem.compute_route(next_item, end_id, route, routes);
                route.pop();
            });

        });
    }
}
UndrivenTrackItem.route_start = null;
UndrivenTrackItem.route_state = 0;
UndrivenTrackItem.css_route = 'route';
UndrivenTrackItem.active_routes = {};

class DrivenTrackItem extends TrackItem
{
    constructor(item)
    {
        super(item);
    }

    append_html($target)
    {
        var first = true;
        super.append_html($target);
        // multiple drives have the same id but only different addresses. Hence,
        // it's ok to just register events with the first drive.
        this._drives.forEach((drive, index) => {
            this._$html.addClass('no-state-' + index);
            if(drive !== null && first)
            {
                this._$html.addClass('no-view');
                Station.ecos.request_view(drive.id, (data, err) => {
                    this.update_state_event(data);
                }, (err) => {
                    this._$html.removeClass('no-view');
                });
                first = false;
            }
        });
        this._$html.on('click', (e) => {
            if(this._$html.hasClass('track-item-modal'))
                return;
            if(this._$html.hasClass('route'))
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
                    var state_item = "state-" + j + '-' + bin_str[j];
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
                this.set_switch_state(this._drives[elems[1]], parseInt(elems[2]));
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
                                this.set_switch_state(this._drives[elems[1]], parseInt(elems[2]));
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
            this.update_state_get(data, drive);
            this._$html.removeClass('no-state-' + drive.drive_number);
        });
    }

    set_switch_state(drive, state)
    {
        if(drive === null) return;
        state = this.normalize_state(drive, state);
        Station.ecos.send_cmd(
            'set',
            11,
            ['switch[DCC' + drive.addr + DrivenTrackItem.ecos_states[state] + ']'],
            (data, err) => {
                this.set_wait_state(drive.drive_number);
            }
        );
    }

    normalize_state(drive, state)
    {
        if(drive.is_inverted == 1)
            return this.invert_state(state);
        return state;
    }

    invert_state(state)
    {
        return 1 - state;
    }

    update_state(state, drive)
    {
        drive.state = this.normalize_state(drive, state);
        this._$html.addClass('state-' + drive.drive_number + '-' + drive.state);
        this._$html.removeClass('pending-' + drive.drive_number
            + ' state-' + drive.drive_number + '-' + this.invert_state(drive.state));
    }

    update_state_get(data, drive)
    {
        var state = parseInt(data[0].switch)
        this.update_state(state, drive)
    }

    update_state_event(data)
    {
        var state = parseInt(data[0].state)
        if(state === 0)
        {
            this.update_state(0, this._drives[0]);
            this.update_state(0, this._drives[1]);
        }
        else if(state === 3)
        {
            this.update_state(0, this._drives[0]);
            this.update_state(1, this._drives[1]);
        }
        else if(state === 2)
        {
            this.update_state(1, this._drives[0]);
            this.update_state(0, this._drives[1]);
        }
        else if(state === 1)
        {
            this.update_state(1, this._drives[0]);
            this.update_state(1, this._drives[1]);
        }
    }

    _update_state_event(data)
    {
        // the geniuses at ESU decided to use different addresses but the same
        // id for switching articles with multiple drives. As views are
        // registered on ids I have to decompose the state number (as it can
        // reach a number of 2^(drive_count-1) and hope that the number they
        // send in base 2 corresponds to the states of each drive).
        var idx, pos;
        var state = parseInt(data[0].state)
        var bin_str = state.toString(2);
        var zeros = new Array(this._drives.length - bin_str.length).fill(0).join();
        bin_str = zeros + bin_str;
        for(idx = 0; idx < bin_str.length; idx++)
        {
            pos = idx;
            // pos = bin_str.length - idx - 1;
            state = parseInt(bin_str.charAt(pos));
            this.update_state(state, this._drives[idx]);
        }
    }
}
DrivenTrackItem.ecos_states = ['g', 'r'];

class DraggableTrackItem extends TrackItem
{
    constructor(item)
    {
        super(item);
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
    constructor(item)
    {
        super(item);
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
        super({id: 'lib', id_track_item: type, angle: 0, position: null, drives: [], connection: "[]"});
    }

    append_html($target)
    {
        super.append_html($target);
        this._$html.addClass('border mb-1');
    }
}
