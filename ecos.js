exports.parse_msg = function(data)
{
    const regex_header = /<(REPLY|EVENT) (.*\(.*\)|\d*)>/g;
    const regex_footer = /<(END) (\d+) \((.*)\)>/g;
    const regex_arg = /(.*)\[(.*)\]/;
    const regex_split = /\s+(?![^\[]*\])/;
    var lines = data.split(/\r?\n/);
    var sets = [];
    var set, is_body = false;

    console.log("<-- " + data);

    if(lines.length < 2)
        res.err.server.push("bad response format");

    lines.forEach((line, index) => {
        var args, body_item, f, h;
        if(line.match(regex_header))
        {
            h = regex_header.exec(line);
            set = {
                err: { state: false, server: [], ecos: null },
                header: null,
                body: null
            };
            if(h.length === 3)
            {
                set.header = { type: h[1], cmd: h[2] };
                set.body = [];
            }
            else
                set.err.server.push("bad header format");
            is_body = true;
        }
        else if(f = line.match(regex_footer))
        {
            f = regex_footer.exec(line);
            if(f.length === 4 && f[1] === 'END')
                set.err.ecos = { error_code: f[2], error: f[3] };
            else
                set.err.server.push("bad footer format");
            if(set.err.ecos.error_code != 0 || set.err.server.length > 0)
                set.err.state = true;
            sets.push(set);
            is_body = false
        }
        else if(is_body)
        {
            body_item = {};
            args = line.split(regex_split);
            body_item['id'] = parseInt(args[0]);
            args.shift();

            args.forEach(function(arg, index) {
                var item = regex_arg.exec(arg);
                if(item) body_item[item[1]] = item[2].replace(/"/g, '');
            });
            set.body.push(body_item);
        }
    });

    return sets;
}

exports.create_cmd = function(data)
{
    return data.cmd + '(' + data.id + ', ' + data.args.join(', ') + ')';
}

exports.is_view_request = function(data)
{
    return (data.cmd === 'request' && data.args.includes('view'));
}

exports.is_view_release = function(data)
{
    return (data.cmd === 'release' && data.args.includes('view'));
}
