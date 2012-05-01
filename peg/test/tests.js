var PEG = require('pegjs')
  , should = require('should')
  , fs = require('fs');

var data = fs.readFileSync('scheem.pegjs', 'utf-8');

var parse = PEG.buildParser(data).parse;

describe('Parse', function() {
    it('handles (a b c)', function() {
        should.deepEqual(parse('(a b c)'), ['a', 'b', 'c']);
    });
});