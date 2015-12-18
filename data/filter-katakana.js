function filterAllTextNodes(elem, filter, doc) {
    var child = elem.firstChild;
    var found = false;
    while (child) {
        if (child.nodeType == 3) { // text
            var array = filter(doc, child);
            if (array.length != 1 || array[0] != child) {
                found = true;
                var nextChild = child.nextSibling;
                elem.removeChild(child);
                for (var i in array) {
                    elem.insertBefore(array[i], nextChild);
                }
                child = array[array.length - 1];
            }
        } else if (child.nodeType == 1) { // element
            found = found | filterAllTextNodes(child, filter, doc);
        }
        child = child.nextSibling;
    }
    return found;
}

var kata = '\u30A1-\u30F5\u30F7-\u30FB\u31F0-\u31FF\uFF65-\uFF9D';
var regexp = new RegExp('['+kata+']['+kata+'\u30FC\u309A]*', 'g');

function convertKatakanaFilter(converter) {
    return function (doc, child) {
        var text = child.data;

        var pos = 0;
        var result = [];
        var found = false;
        var matches;

        while ((matches = regexp.exec(text)) !== null) {
            var intermediate = text.substr(pos, matches.index - pos);
            if (intermediate.length > 0) {
                result.push(document.createTextNode(intermediate));
            }
            pos = regexp.lastIndex;
            k = matches[0];

            r = converter.convert(k);

            result.push(document.createTextNode(' '));
            span = document.createElement('span');
            span.setAttribute('title', k);
            span.appendChild(document.createTextNode(r));
            result.push(span);
            result.push(document.createTextNode(' '));
        }

        if (pos == 0) {
            result.push(child);
        } else if (pos < text.length) {
            result.push(document.createTextNode(text.substr(pos)));
        }

        return result;
    };
}

katakanaReceived = function(katakanaStr) {

    if (!document.body)
        return;

    var converter = new K2RConverter(katakanaStr);
    var found = filterAllTextNodes(document.body,
                                   convertKatakanaFilter(converter),
                                   document);

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
