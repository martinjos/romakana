self.port.on('katakana', function(katakana) {

var html = document.body.innerHTML;

var regexp = XRegExp('\\p{Katakana} (?: \\p{Katakana} | \u30FC )*', 'gx');
var pos = 0;
var result = "";
var found = false;
var matches;
var inTag = false;

var i = 0;
while ((matches = regexp.exec(html)) !== null) {
    var intermediate = html.substr(pos, matches.index - pos);
    result += intermediate;
    pos = regexp.lastIndex;
    k = matches[0];

    var oti = intermediate.lastIndexOf('<');
    var cti = intermediate.lastIndexOf('>');
    if (oti < cti) {
        inTag = false;
    } else if (cti < oti) {
        inTag = true;
    }

    if (inTag) {
        result += k;
        continue;
    }

    found = true;
    var r = "";
    var chars = k.split('');
    for (var i in chars) {
        var ch = chars[i];
        if (katakana[ch] !== undefined)
            r += katakana[ch];
        else if (ch == '\u30FC')
            r += '\u0304';
    }
    r = r.normalize();
    r = '<span title="'+ k +'">' + r + '</span>';
    result += r;

    i += 1;
    //if (i == 10) break;
}

result += html.substr(pos);

if (found) {
    document.body.innerHTML = result;
}

}); // self.port.on('katakana', ...)
