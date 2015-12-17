var self = require('sdk/self');
var pageMod = require('sdk/page-mod');
var winUtils = require('sdk/window/utils');
let { Cc, Ci } = require('chrome');
var IO = Cc["@mozilla.org/network/io-service;1"]
           .getService(Ci.nsIIOService);
var UITour = require("resource:///modules/UITour.jsm").UITour;

var katakanaStr = self.data.load('Katakana.txt');
var win, btn;

function injectStyleSheet(win, uri) {
    win.QueryInterface(Ci.nsIInterfaceRequestor)
       .getInterface(Ci.nsIDOMWindowUtils)
       .loadSheet(IO.newURI(uri, null, null), 1);
}

function finished(found) {
    if (found) {
        UITour.showInfo(win,
                        win.gBrowser.selectedBrowser.messageManager,
                        { node: btn },
                        'Katakana detected!',
                        'Congratulations! We found some katakana lurking around in this page!',
                        self.data.url('icons/icon-48.png'));
    }
}

pageMod.PageMod({
    include: "*",
    contentScriptFile: [
        self.data.url('k2r-converter.js'),
        self.data.url('modify-page.js')
    ],
    onAttach: function (worker) {
        worker.port.emit("katakana", katakanaStr);

        win = winUtils.getMostRecentBrowserWindow();
        var doc = win.document;
        btn = doc.getElementById('katakana-button');
        if (!btn) {
            injectStyleSheet(win, self.data.url('css/address-bar-button.css'));

            btn = doc.createElement('toolbarbutton');
            btn.setAttribute('id', 'katakana-button');
            //btn.setAttribute('class', 'urlbar-icon');
            btn.setAttribute('tooltiptext', 'Configure katakana display');

            var ubi = doc.getElementById('urlbar-icons');
            ubi.appendChild(btn);
        }

        worker.port.on('finished', finished);
    }
});
