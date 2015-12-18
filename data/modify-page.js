katakanaReceived = function(katakanaStr) {

    if (!document.body)
        return;

    var converter = new K2RConverter(katakanaStr);
    var found = filterTextNodes(document.body,
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
