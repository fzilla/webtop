widget.onInit('widget-clock', function (page, panel, data) {

    let settings = widget.getSettings('widget-clock');

    page.find('.clock').thooClock({

        onAlarm: on_alarm,
        offAlarm: off_alarm,

        size: page.width(),

        dialColor: settings.colors.dial,
        secondHandColor: settings.colors.second_hand,
        minuteHandColor: settings.colors.minute_hand,
        hourHandColor: settings.colors.hour_hand,
        alarmHandColor: settings.colors.alarm_hand,
        alarmHandTipColor: settings.colors.alarm_hand_tip,
        showNumerals: settings.show_numerals,
        brandText: settings.main_text,
        brandText2: settings.sub_text,
    });

    if (settings.alarm.enabled && settings.alarm.time) {
        $.fn.thooClock.setAlarm(settings.alarm.time);
    }

    let intVal;
    let audioElement = new Audio("");

    page.find('.alarm').on('click', function () {
        $.fn.thooClock.clearAlarm();
    });

    function on_alarm() {
        alarmBackground(0);
        page.append(audioElement);
        let canPlayType = audioElement.canPlayType("audio/ogg");
        if(canPlayType.match(/maybe|probably/i)) {
            audioElement.src = '/assets/audio/alarm.ogg';
        } else {
            audioElement.src = '/assets/audio/alarm.mp3';
        }
        audioElement.addEventListener('canplay', function() {
            audioElement.loop = true;
            audioElement.play();
        }, false);

        if (!settings.alarm.daily) {
            settings.alarm.enabled = false;
            widget.setSettings('widget-clock', settings);
        }

        page.find('.alarm').show();
    }

    function off_alarm() {
        audioElement.pause();
        clearTimeout(intVal);
        page.find('.clock').css('background-color','transparent');
        page.find('.alarm').hide();
    }


    function alarmBackground(y){
        let color;
        if(y===1){
            color = '#CC0000';
            y=0;
        }
        else{
            color = '#FCFCFC';
            y+=1;
        }
        page.find('.clock').css('background-color', color);
        intVal = setTimeout(function(){alarmBackground(y);},100);
    }

});