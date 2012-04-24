var compile = function(musexpr) {
    var notes = [];

    (function buildNotes(expr, startTime) {
        switch (expr.tag) {
            case 'rest':
                return startTime + expr.duration;
            case 'repeat':
                for (var i = 0; i < expr.count; i++) {
                    startTime = buildNotes(expr.section, startTime);
                }

                return startTime;
            case 'note':
                notes.push({
                    tag: 'note',
                    pitch: convertPitch(expr.pitch),
                    dur: expr.dur,
                    start: startTime
                });

                return startTime + expr.dur;
            case 'seq':
                startTime = buildNotes(expr.left, startTime);
                startTime = buildNotes(expr.right, startTime);

                return startTime;
            case 'par':
                var leftTime = buildNotes(expr.left, startTime);
                var rightTime = buildNotes(expr.right, startTime);

                return leftTime > rightTime ? leftTime : rightTime;
        }
    })(musexpr, 0);

    return notes;
};

var convertPitch = function(pitch) {
    var letter = pitch[0],
        octave = pitch[1];

    return 12 + 12 * octave + "c d ef g a b".indexOf(letter);
};

// Tests

var test = {
    tag: 'seq',
    left: {
        tag: 'seq',
        left: {
            tag: 'repeat',
            section: {
                tag: 'note',
                pitch: 'a4',
                dur: 250
            },
            count: 5
        },
        right: {
            tag: 'note',
            pitch: 'b4',
            dur: 250
        }
    },
    right: {
        tag: 'seq',
        left: {
            tag: 'rest',
            duration: 500
        },
        right: {
            tag: 'note',
            pitch: 'd4',
            dur: 500
        }
    }
};

console.log(test);
console.log(compile(test));