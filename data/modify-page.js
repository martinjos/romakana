self.port.on('katakana', function(katakana) {

var romaji = katakana.romaji;
var small = katakana.small;

var html = document.body.innerHTML;

var kata = '\u30A1-\u30F5\u30F7-\u30FB\u31F0-\u31FF\uFF65-\uFF9D';
var regexp = XRegExp('['+kata+'] ['+kata+'\u30FC]*', 'gx');
var shichiji = { shi: true, chi: true, ji: true };

var consonantMoras = {};
var consonantMorasArray = ['fu', 'vu', 'te', 'to', 'de', 'do', 'ho', 'tsu', 'su', 'zu', 'shi', 'chi', 'ji'];
for (var i in consonantMorasArray)
    consonantMoras[ consonantMorasArray[i] ] = true;

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
    var lastMora = undefined;
    for (var i in chars) {
        var ch = chars[i];
        var mora = romaji[ch];
        if (mora == 'tsu' && small[ch]) {
            geminate = true;
            lastMora = undefined;
        } else if (mora !== undefined) {
            if (geminate) {
                if (mora.substr(0, 2) == 'ch') {
                    r += "t";
                } else {
                    r += mora[0];
                }
            } else if (small[ch]) {
                var lastChar = r[r.length - 1];
                if (shichiji[lastMora] && mora[0] == 'y') {
                    r = r.substr(0, r.length - 1);
                    mora = mora.substr(1);
                } else if (consonantMoras[lastMora] ||
                           (lastChar == 'u' && mora[0] == 'w') ||
                           (lastChar == 'i' && mora[0] == 'y')) {
                    r = r.substr(0, r.length - 1);
                } else if (lastChar == 'u') {
                    r = r.substr(0, r.length - 1) + 'w';
                } else if (lastChar == 'i') {
                    r = r.substr(0, r.length - 1) + 'y';
                }
            }
            r += mora;
            geminate = false;
            lastMora = mora;
        } else {
            geminate = false;
            lastMora = undefined;
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
