self.port.on('katakana', function(katakana) {

var html = document.body.innerHTML;

var regexp = XRegExp('\\p{Katakana} (?: \\p{Katakana} | \u30FC )*', 'gx');
var pos = 0;
var result = "";
var found = false;
var matches;

var i = 0;
while ((matches = regexp.exec(html)) !== null) {
    result += html.substr(pos, matches.index - pos);
    pos = regexp.lastIndex;
    found = true;

    k = matches[0];
    var r = "";
    var chars = k.split('');
    for (var i in chars) {
        var ch = chars[i];
        if (katakana[ch] !== undefined)
            r += katakana[ch];
    }
    result += r;

    i += 1;
    //if (i == 10) break;
}

result += html.substr(pos);

if (found) {
    document.body.innerHTML = result;
}

}); // self.port.on('katakana', ...)
