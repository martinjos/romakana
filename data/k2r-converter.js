function K2RConverter(katakanaStr) {
    var hepburn = {
        si:'shi', zi:'ji', ti:'chi', di:'ji', tu:'tsu', du:'zu', hu:'fu',
    };

    this.romaji = {};
    this.small = {};

    var lines = katakanaStr.split("\n");
    for (var i in lines) {
        var line = lines[i];
        var pieces = line.split(/[ \t]+/);
        if (pieces.length < 2)
            continue;
        var ch = String.fromCharCode(parseInt(pieces[0], 16));
        var name = pieces[pieces.length - 1].toLowerCase();
        this.small[ch] = pieces[pieces.length - 2] == 'SMALL';
        if (hepburn[name] !== undefined)
            name = hepburn[name];
        this.romaji[ch] = name;
    }
}

K2RConverter.prototype.shichiji = { shi: true, chi: true, ji: true };

K2RConverter.prototype.consonantMoras = {};
var consonantMorasArray = ['fu', 'vu', 'te', 'to', 'de', 'do', 'ho', 'tsu', 'su', 'zu', 'shi', 'chi', 'ji'];
for (var i in consonantMorasArray)
    K2RConverter.prototype.consonantMoras[ consonantMorasArray[i] ] = true;

// The purpose of implementing the Ainu stuff here is not really to support the
// Ainu language, but to provide more flexibility for Japanese katakana
// transcription of foreign sounds. As such, Ainu is not fully supported
// (sorry).

// The second of each pair is the combining dakuten form.

K2RConverter.prototype.ainuConsonants = {
    'k': 'g', 'sh': 'j', 's': 'z', 't': 'd', 'n': 'ng', 'h': 'b',
    'f': 'b',  'm': 'm', 'r': 'l'
};

K2RConverter.prototype.convert = function(k) {
    var r = "";
    var chars = k.split('');
    var geminate = false;
    var lastMora = undefined;
    for (var i in chars) {
        var ch = chars[i];
        var mora = this.romaji[ch];
        if (mora == 'tsu' && this.small[ch]) {
            geminate = true;
            lastMora = undefined;
        } else if (mora !== undefined) {
            if (geminate) {
                if (mora.substr(0, 2) == 'ch') {
                    r += "t";
                } else {
                    r += mora[0];
                }
            } else if (this.small[ch]) {
                var lastChar = r[r.length - 1];
                var moraConsonant = mora.substr(0, mora.length - 1);
                if (this.ainuConsonants[moraConsonant]) {
                    mora = moraConsonant;
                } else if (this.shichiji[lastMora] && moraConsonant == 'y') {
                    r = r.substr(0, r.length - 1);
                    mora = mora.substr(1);
                } else if (this.consonantMoras[lastMora] ||
                           (lastChar == 'u' && moraConsonant == 'w') ||
                           (lastChar == 'i' && moraConsonant == 'y')) {
                    r = r.substr(0, r.length - 1);
                } else if (lastChar == 'u') {
                    r = r.substr(0, r.length - 1) + 'w';
                } else if (lastChar == 'i') {
                    r = r.substr(0, r.length - 1) + 'y';
                } else {
                    r = r.substr(0, r.length - 1);
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
            } else if (i > 0 && ch == '\u3099' &&
                       (this.ainuConsonants[lastMora] || lastMora == 'n')) {
                // combining voiced sound mark - convert isolated (Ainu)
                // consonant to voiced
                r = r.substr(0, r.length - lastMora.length) +
                    this.ainuConsonants[lastMora];
            } else
                r += ch;
            geminate = false;
            lastMora = undefined;
        }
    }
    r = r.normalize();
    return r;
};

if (typeof(exports) != 'undefined')
    exports.K2RConverter = K2RConverter;
