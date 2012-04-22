var endTime = function (startTime, expr) {
    var duration = function (expr) {
        if (expr.tag === 'note') {
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
            expr.start = startTime;
            notes.push(expr);
        } else if (expr.tag === 'seq') {
            buildNotes(expr.left, startTime);
            buildNotes(expr.right, endTime(startTime, expr.left));
        } else {
            buildNotes(expr.left, startTime);
            buildNotes(expr.right, startTime);
        }
    })(musexpr, 0);

    return notes;
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
            tag: 'note',
            pitch: 'c4',
            dur: 500
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