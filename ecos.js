exports.parse_msg = function(data)
{
    const regex_header = /<(REPLY|EVENT) (.*\(.*\)|\d*)>/gm;
    const regex_footer = /<(END) (\d+) \((.*)?\)>/gm;
    var lines = data.split(/\r?\n/);
    var res = {
        msg: data,
        err: { state: false, server: [], ecos: null },
        header: null,
        body: null
    };
    var header = "", footer = "", body_lines = [], body = [];
    var line = 1;
    var f, h;
    if(lines.length < 2)
        res.err.server.push("bad response format");

    // parse header
    if(h = regex_header.exec(lines[0]))
    {
        if(h.length === 3)
            header = {
                type: h[1],
                cmd: h[2],
            };
    }
    else
        res.err.server.push("bad header format");

    // extract body
    for(line = 1; line < lines.length-1; line++)
        body_lines.push(lines[line]);

    // parse footer
    f = regex_footer.exec(lines[lines.length-1]);
    if(f !== null && f.length === 4 && f[1] === 'END')
        footer = {
            error_code: f[2],
            error: f[3]
        };
    else
        res.err.server.push("bad footer format");

    // parse body
    body_lines.forEach(function(line, index) {
        const regex_arg = /(.*)\[(.*)\]/;
        const regex_split = /\s+(?![^\[]*\])/;
        var body_item = {};
        var args = line.split(regex_split);
        body_item['id'] = parseInt(args[0]);
        args.shift();

        args.forEach(function(arg, index) {
            var item = regex_arg.exec(arg);
            if(item) body_item[item[1]] = item[2].replace(/"/g, '');
        });
        body.push(body_item);
    });

    res.header = header;
    res.err.ecos = footer;
    res.body = body;
    if(res.err.ecos.error_code != 0 || res.err.server.length > 0)
        res.err.state = true;
    return res;
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
