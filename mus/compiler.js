var endTime = function (startTime, expr) {
    var duration = function (expr) {
        if (expr.tag === 'rest') {
            return expr.duration;
        } if (expr.tag === 'note') {
            return expr.dur;
        } else if (expr.tag === 'seq') {
            return duration(expr.left) + duration(expr.right);
        } else {
            var leftDuration = duration(expr.left),
                rightDuration = duration(expr.right);
            return leftDuration > rightDuration ? leftDuration : rightDuration;
        }
    };

    return startTime + duration(expr);
};

var compile = function(musexpr) {
    var notes = [];

    (function buildNotes(expr, startTime) {
        if (expr.tag === 'note') {
            notes.push({
                tag: 'note',
                pitch: convertPitch(expr.pitch),
                dur: expr.dur,
                start: startTime
            });
        } else if (expr.tag === 'seq') {
            buildNotes(expr.left, startTime);
            buildNotes(expr.right, endTime(startTime, expr.left));
        } else if (expr.tag === 'par') {
            buildNotes(expr.left, startTime);
            buildNotes(expr.right, startTime);
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
            tag: 'note',
            pitch: 'a4',
            dur: 250
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