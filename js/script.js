/**
 * Created with IntelliJ IDEA.
 * User: Chris
 * Date: 5/14/13
 * Time: 11:45 PM
 * To change this template use File | Settings | File Templates.
 */
$(document).ready(function() {
    $('#preHiddenConsole').on('keyup keydown', function() {
        $('#preConsoleInput').html(this.value);
    });

    $('#hiddenConsole').on('keyup keydown', function() {
        $('#consoleInput').html(this.value);
    });

    $('#preScreen').click(function() {
        $('#preHiddenConsole').focus();
    });

    $('#console').click(function() {
        $('#hiddenConsole').focus();
    });

    $('#preHiddenConsole').keyup(function(event) {
        if (event.keyCode == 13) {
            //TODO: Check list for errors (spelling, word length)

            //TODO: If the list checks out, proceed to main screen; Else prompt the user to fix the list.
        }
    });

    $('#hiddenConsole').keyup(function(event) {
        if (event.keyCode == 13) {
            if (currentWord != null) {
                var corr = $(this).val().match(/\d+/g);
                if (corr != null) {
                    advanceLine('#consoleInput');
                    flagDuds(currentWord, corr);
                } else {
                    $('#consoleInput').html('Correlation must be a number');
                    advanceLine('#consoleInput');
                }
            } else {
                advanceLine(this);
            }
        }
    });
});

function advanceLine(element) {
    var span;
    if ($(element).is('input')) {
        span = "<span class='output'>" + $(element).val() + "</span><br>";
        $('#output').append(span);
        $(element).val('');
        $('#consoleInput').html('');
    } else {
        span = "<span class='output'>" + $(element).text() + "</span><br>";
        $('#output').append(span);
        //$(element).html('');
        $('#consoleInput').html('');
    }
}