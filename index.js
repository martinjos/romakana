var self = require('sdk/self');
var pageMod = require('sdk/page-mod');

var katakanaStr = self.data.load('Katakana.txt');

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

pageMod.PageMod({
  include: "*",
  contentScriptFile: [self.data.url('xregexp-all.js'),
                      self.data.url('modify-page.js')],
  onAttach: function (worker) {
    worker.port.emit("katakana", { romaji: romaji, small: small });
  },
});
