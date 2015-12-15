katakanaReceived = function(katakanaStr) {

var hepburn = {
    si:'shi', zi:'ji', ti:'chi', di:'ji', tu:'tsu', du:'zu', hu:'fu',
};

var romaji = {};
var small = {};
var lines = katakanaStr.split("\n");
for (var i in lines) {
    var line = lines[i];
    var pieces = line.split(/[ \t]+/);
    if (pieces.length < 2)
        continue;
    var ch = String.fromCharCode(parseInt(pieces[0], 16));
    var name = pieces[pieces.length - 1].toLowerCase();
    small[ch] = pieces[pieces.length - 2] == 'SMALL';
    if (hepburn[name] !== undefined)
        name = hepburn[name];
    romaji[ch] = name;
}

var html = document.body.innerHTML;

var kata = '\u30A1-\u30F5\u30F7-\u30FB\u31F0-\u31FF\uFF65-\uFF9D';
var regexp = XRegExp('['+kata+'] ['+kata+'\u30FC\u309A]*', 'gx');
var shichiji = { shi: true, chi: true, ji: true };

var consonantMoras = {};
var consonantMorasArray = ['fu', 'vu', 'te', 'to', 'de', 'do', 'ho', 'tsu', 'su', 'zu', 'shi', 'chi', 'ji'];
for (var i in consonantMorasArray)
    consonantMoras[ consonantMorasArray[i] ] = true;

// The purpose of implementing the Ainu stuff here is not really to support the
// Ainu language, but to provide more flexibility for Japanese katakana
// transcription of foreign sounds. As such, Ainu is not fully supported
// (sorry).

var ainuConsonants = {};
var ainuConsonantsArray = ['k', 'sh', 's', 't', 'n', 'h', 'f', 'm', 'r'];
for (var i in ainuConsonantsArray)
    ainuConsonants[ ainuConsonantsArray[i] ] = true;

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
                var moraConsonant = mora.substr(0, mora.length - 1);
                if (ainuConsonants[moraConsonant]) {
                    mora = moraConsonant;
                } else if (shichiji[lastMora] && moraConsonant == 'y') {
                    r = r.substr(0, r.length - 1);
                    mora = mora.substr(1);
                } else if (consonantMoras[lastMora] ||
                           (lastChar == 'u' && moraConsonant == 'w') ||
                           (lastChar == 'i' && moraConsonant == 'y')) {
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
            if (ch == '\u30FB' || ch == '\uFF65')
                r += ' ';
            else if (i > 0 && (ch == '\u30FC' || ch == '\uFF70'))
                // prolonged sound mark - replace with combining macron
                r += '\u0304';
            else if (i > 0 && ch == '\u309A' && lastMora == 'f') {
                // combining semi-voiced sound mark - convert f to p
                r = r.substr(0, r.length - 1) + 'p';
            } else
                r += ch;
            geminate = false;
            lastMora = undefined;
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

}; // katakanaReceived = function (katakana) { ...

function request(url, func) {
    var xhr = new XMLHttpRequest();
    try {
        xhr.onreadystatechange = function(){
            if (xhr.readyState != 4) {
                return;
            }

            if (xhr.responseText) {
                func(xhr.responseText);
            }
        };

        xhr.onerror = function(error) {
            console.error(error);
        };

        xhr.open("GET", url, true);
        xhr.send(null);
    } catch(e) {
        console.error(e);
    }
}

if (self.port)
    self.port.on('katakana', katakanaReceived);
else
    request(chrome.extension.getURL('data/Katakana.txt'), katakanaReceived);
