var self = require('sdk/self');
var pageMod = require('sdk/page-mod');

var katakanaStr = self.data.load('Katakana.txt');

pageMod.PageMod({
  include: "*",
  contentScriptFile: [
    self.data.url('k2r-converter.js'),
    self.data.url('filter.js'),
    self.data.url('filter-katakana.js'),
    self.data.url('modify-page.js')
  ],
  onAttach: function (worker) {
    worker.port.emit("katakana", katakanaStr);
  }
});
