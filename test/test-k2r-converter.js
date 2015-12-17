var k2rconverter = require("../data/k2r-converter");

var self = require('sdk/self');
var katakanaStr = self.data.load('Katakana.txt');

var conv = new k2rconverter.K2RConverter(katakanaStr);

var k2rTestTable = {

    // Hepburn

    'シ': 'shi',
    'チ': 'chi',
    'ツ': 'tsu',
    'フ': 'fu',
    'ジ': 'ji',
    'ヂ': 'ji',
    'ヅ': 'zu',

    // Native combinations - no (han-)dakuten

    'キャ': 'kya',
    'キュ': 'kyu',
    'キョ': 'kyo',
    'シャ': 'sha',
    'シュ': 'shu',
    'ショ': 'sho',
    'チャ': 'cha',
    'チュ': 'chu',
    'チョ': 'cho',
    'ニャ': 'nya',
    'ニュ': 'nyu',
    'ニョ': 'nyo',
    'ヒャ': 'hya',
    'ヒュ': 'hyu',
    'ヒョ': 'hyo',
    'ミャ': 'mya',
    'ミュ': 'myu',
    'ミョ': 'myo',
    'リャ': 'rya',
    'リュ': 'ryu',
    'リョ': 'ryo',

    // Native combinations - with (han-)dakuten

    'ギャ': 'gya',
    'ギュ': 'gyu',
    'ギョ': 'gyo',
    'ジャ': 'ja',
    'ジュ': 'ju',
    'ジョ': 'jo',
    'ヂャ': 'ja',
    'ヂュ': 'ju',
    'ヂョ': 'jo',
    'ビャ': 'bya',
    'ビュ': 'byu',
    'ビョ': 'byo',
    'ピャ': 'pya',
    'ピュ': 'pyu',
    'ピョ': 'pyo',

    // Transcription combinations

    'キェ': 'kye',
    'クヮ': 'kwa',
    'クィ': 'kwi',
    'クェ': 'kwe',
    'クォ': 'kwo',
    'ギェ': 'gye',
    'グヮ': 'gwa',
    'グィ': 'gwi',
    'グェ': 'gwe',
    'グォ': 'gwo',
    'スィ': 'si',
    'シェ': 'she',
    'ズィ': 'zi',
    'ジェ': 'je',
    'ティ': 'ti',
    'トゥ': 'tu',
    'テュ': 'tyu',
    'チェ': 'che',
    'ツァ': 'tsa',
    'ツィ': 'tsi',
    'ツェ': 'tse',
    'ツォ': 'tso',
    'ディ': 'di',
    'ドゥ': 'du',
    'デュ': 'dyu',
    'ニェ': 'nye',
    'ホゥ': 'hu',
    'ヒェ': 'hye',
    'ファ': 'fa',
    'フィ': 'fi',
    'フェ': 'fe',
    'フォ': 'fo',
    'フャ': 'fya',
    'フュ': 'fyu',
    'フィェ': 'fye',
    'フョ': 'fyo',
    'ビェ': 'bye',
    'ピェ': 'pye',
    'ミェ': 'mye',
    'イィ': 'yi',
    'イェ': 'ye',
    'リェ': 'rye',
    'ウィ': 'wi',
    'ウゥ': 'wu',
    'ウェ': 'we',
    'ウォ': 'wo',
    'ウュ': 'wyu',
    'ヴァ': 'va',
    'ヴィ': 'vi',
    'ヴェ': 've',
    'ヴォ': 'vo',
    'ヴャ': 'vya',
    'ヴュ': 'vyu',
    'ヴィェ': 'vye',
    'ヴョ': 'vyo',

};

exports["test convert"] = function(assert) {
    for (var k in k2rTestTable) {
        var r = k2rTestTable[k];
        var gr = conv.convert(k);
        assert.equal(r, gr, "Is '"+k+"' converted to '"+r+"'?");
    }
};

require("sdk/test").run(exports);
