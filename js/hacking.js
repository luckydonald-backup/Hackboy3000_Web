/**
 * Created with IntelliJ IDEA.
 * User: Chris
 * Date: 5/14/13
 * Time: 11:46 PM
 * To change this template use File | Settings | File Templates.
 */
$(document).ready(function() {
    var test = ["ORGANIZATION", "PURIFICATION", "RELATIONSHIP", "HEADQUARTERS", "INFILTRATION",
        "CONSPIRATORS", "CIVILIZATION", "QUARTERSTAFF", "INDEFINITELY", "ANTICIPATING",
        "RECUPERATING", "BROADCASTING", "CONSTRUCTION", "PASSWORD #14", "PASSWORD #15",
        "PASSWORD #16", "PASSWORD #17", "PASSWORD #18", "PASSWORD #1923", "PASSWORD #201"];

    initialize(test);
    analyze();
    promptWord();
});
var passwords;
var flags;
var correlations = [];
var wordsLeft;

var bestGuess = '#bestGuessWord';
var input = '#consoleInput';
var currentWord = null;

function promptWord() {
    $(bestGuess).html(passwords[findBestOption()]);
    $(input).html('Which word did you pick');
    advanceLine(input);
}

function promptCorrelation() {
    $(bestGuess).html(passwords[findBestOption()]);
    $(input).html('What was its correlation?');
    advanceLine(input);
    $('#hiddenConsole').val('').focus();
}

function initialize(array) {
    passwords = new Array(array.length);
    flags = new Array(array.length);
    wordsLeft = array.length;

    // Fill the arrays
    $.each(array, function(index, value) {
        passwords[index] = value;
        flags[index] = true;
        correlations[index] = new Array(array.length);
    });

    // Display the passwords and bind events
    $.each(passwords, function(index, value) {
        //words.append("<span id='word_" + index + "' class='word'>" + value + "</span><span id='best_" + index + "'> <-BEST</span><br>");
        $('#words').append("<span id='word_" + index + "' class='word'>" + value + "</span><audio id='mouse_over_" + index + "' src='audio/scroll_step.mp3' preload='auto'></audio><br>");
        var selector = '#word_' + index;

        $(selector).mouseenter(function() {
            if (!$(this).hasClass('disabled')) {
                $(this).toggleClass('hovered');
                $("#mouse_over_"+index)[0].play();
            }
        });

        $(selector).mouseleave(function() {
            if (!$(this).hasClass('disabled')) {
                $(this).toggleClass('hovered');
            }
        });

        $(selector).click(function() {
            advanceLine(selector);
            currentWord = index;
            promptCorrelation();
        });
    });
}

/** Sets the correlation between words for each password */
function analyze() {
    for (var i = 0; i < passwords.length; i++) {
        var chars1 = passwords[i].split('');
        for (var j = 0; j < passwords.length; j++) {
            var sum = 0;
            var chars2 = passwords[j].split('');
            for (var k = 0; k < chars2.length; k++) {
                if (chars1[k] === chars2[k]) {
                    sum++;
                }
            }
            correlations[i][j] = sum;
            correlations[j][i] = sum;
        }
         correlations[i][i] = chars1.length;
    }
}

/** Iterates through the flags array toggling the flag for each password that is no longer possible */
function flagDuds(index, correlation) {
    for (var i = 0; i < flags.length; i++) {
        if (flags[i] && correlations[index][i] != correlation) {
            console.log('Eliminated a potential password: ' + passwords[i]);
            var selector = '#word_' + i;
            flags[i] = false;
            wordsLeft--;
            $(selector).addClass('disabled');
        }
    }

    if (wordsLeft > 1) {
        currentWord = null;
        promptWord();
    } else if (wordsLeft == 1) {
        $(input).html('The password must be');
        advanceLine(input);
        $(input).html($('[id^="word_"]:not(".disabled")').html());
        advanceLine(input);
    } else {
        console.log("OOPS: wordsLeft = " + wordsLeft);
    }
}

/** Finds the password that will eliminate the most incorrect passwords and returns its index */
function findBestOption() {
    var frequencies = new Array(passwords.length);
    var bestIndex = 0;

    for (var i = 0; i < passwords.length; i++) {
        if (flags[i]) {
            var map = [];
            for (var j = 0; j < passwords.length; j++) {
                if (flags[j] && ($.inArray(correlations[i][j], map) === -1)) {
                    map.push(correlations[i][j]);
                }
            }
            frequencies[i] = map.length;
        }
    }

    // set initial bestIndex guess
    var flag = false;
    var index = 0;
    do {
        if (flags[index]) {
            bestIndex = index;
            flag = true;
        }
        index++;
    } while (!flag);

    // set the actual bestIndex value
    for (i = 0; i < passwords.length; i++) {
        if (frequencies[i] > frequencies[bestIndex]) {
            bestIndex = i;
        }
    }

    return bestIndex;
}
