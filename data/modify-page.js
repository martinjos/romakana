self.port.on('katakana', function(katakana) {

var romaji = katakana.romaji;
var small = katakana.small;

var html = document.body.innerHTML;

var kata = '\u30A1-\u30F5\u30F7-\u30FB\u31F0-\u31FF\uFF65-\uFF9D';
var regexp = XRegExp('['+kata+'] ['+kata+'\u30FC]*', 'gx');
var pos = 0;
var result = "";
var found = false;
var matches;
var inTag = false;

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
    var geminate = false;
    for (var i in chars) {
        var ch = chars[i];
        if (romaji[ch] == 'tsu' && small[ch])
            geminate = true;
        else if (romaji[ch] !== undefined) {
            if (geminate) {
                if (romaji[ch].substr(0, 2) == 'ch') {
                    r += "t";
                } else {
                    r += romaji[ch].charAt(0);
                }
            }
            r += romaji[ch];
            geminate = false;
        } else {
            geminate = false;
            if (ch == '\u30FB' || ch == '\uFF65')
                r += ' ';
            else if (i > 0 && (ch == '\u30FC' || ch == '\uFF70'))
                r += '\u0304';
            else
                r += ch;
        }
    }
    r = r.normalize();
    r = '<span title="'+ k +'">' + r + '</span>';
    r = ' ' + r + ' ';
    result += r;
}

result += html.substr(pos);

if (found) {
    document.body.innerHTML = result;
}

}); // self.port.on('katakana', ...)
