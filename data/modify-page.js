katakanaReceived = function(katakanaStr) {

    var converter = new K2RConverter(katakanaStr);

    var html = document.body.innerHTML;

    var kata = '\u30A1-\u30F5\u30F7-\u30FB\u31F0-\u31FF\uFF65-\uFF9D';
    var regexp = new RegExp('['+kata+']['+kata+'\u30FC\u309A]*', 'g');

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

        r = converter.convert(k);

        r = '<span title="'+ k +'">' + r + '</span>';
        r = ' ' + r + ' ';
        result += r;
    }

    result += html.substr(pos);

    if (found) {
        document.body.innerHTML = result;
    }

    if (self.port)
        self.port.emit('finished', found);

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
