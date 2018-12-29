$(document).ready(function() {
    const col_count = 20;
    const row_count = 6;
    var socket = io('http://' + IP + ':3000');
    var station = new Station(row_count, col_count, true);
    var ecos = new EcosCom(socket);
    var $ecos = $('#ecos-items');

    // build station
    station.build_canvas($('.canvas'));
    station.build_library($('#library'));

    // fetch switch articles
    ecos.send_cmd('queryObjects', 11, ['name1', 'name2', 'name3', 'addr'], function(data, err) {
        if(err.state) return
        data.forEach(function(args, index) {
            var $cont = $('<div/>', {'class': 'card card-body p-1'});
            for(let [key, arg] of Object.entries(args)) {
                $cont.append($('<div/>', {'class':'small'}).text(key + ": " + arg));
            }
            $ecos.append(
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
});
