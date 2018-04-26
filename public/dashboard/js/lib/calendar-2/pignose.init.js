$(function() {
    "use strict";
    $('.year-calendar').pignoseCalendar({
        theme: 'blue' // light, dark, blue
    	,disabledRanges: [
        ['2018-04-01', '2018-04-23']
    ]
    });


    $('input.calendar').pignoseCalendar({
        format: 'YYYY-MM-DD' // date format string. (2017-02-02)
    });
});

