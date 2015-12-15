var self = require('sdk/self');
var pageMod = require('sdk/page-mod');

var katakanaStr = self.data.load('Katakana.txt');

var katakana = {};
var lines = katakanaStr.split("\n");
for (var i in lines) {
  var line = lines[i];
  var pieces = line.split(/[ \t]+/);
  if (pieces.length < 2)
    break;
  var ch = String.fromCharCode(parseInt(pieces[0], 16));
  var name = pieces[pieces.length - 1].toLowerCase();
  katakana[ch] = name;
}

pageMod.PageMod({
  include: "*",
  contentScriptFile: [self.data.url('xregexp-all.js'),
                      self.data.url('modify-page.js')],
  onAttach: function (worker) {
    worker.port.emit("katakana", katakana);
  },
});
