plugin.onInit('settings-widget-clock', function (page, panel, data, ev) {

    panel.setHeaderLogo('<i class="fa fa-clock-o"></i>');
    panel.setHeaderTitle('Clock');

    let settings = widget.getSettings('widget-clock');

    page.find('.color-picker').spectrum({
        showPaletteOnly: true,
        togglePaletteOnly: true,
        togglePaletteMoreText: 'more',
        togglePaletteLessText: 'less',
        color: 'blanchedalmond',
        palette: [
            ["#000","#444","#666","#999","#ccc","#eee","#f3f3f3","#fff"],
            ["#f00","#f90","#ff0","#0f0","#0ff","#00f","#90f","#f0f"],
            ["#f4cccc","#fce5cd","#fff2cc","#d9ead3","#d0e0e3","#cfe2f3","#d9d2e9","#ead1dc"],
            ["#ea9999","#f9cb9c","#ffe599","#b6d7a8","#a2c4c9","#9fc5e8","#b4a7d6","#d5a6bd"],
            ["#e06666","#f6b26b","#ffd966","#93c47d","#76a5af","#6fa8dc","#8e7cc3","#c27ba0"],
            ["#c00","#e69138","#f1c232","#6aa84f","#45818e","#3d85c6","#674ea7","#a64d79"],
            ["#900","#b45f06","#bf9000","#38761d","#134f5c","#0b5394","#351c75","#741b47"],
            ["#600","#783f04","#7f6000","#274e13","#0c343d","#073763","#20124d","#4c1130"]
        ],

        change: function(color) {
            settings.colors[$(this).closest('tr').attr('data-color')] = color.toHexString();
            widget.setSettings('widget-clock', settings);
        }
    });

    page.find('.alarm-time').timepicker({dropdown: false, timeFormat: 'hh:mm p'});

    if (settings.show_numerals) {
        page.find('.show-numerals').addClass('selected')
    }

    if (settings.alarm.enabled) {
        page.find('.enable-alarm').addClass('selected');
        page.find('.alarm_settings').slideDown();
    }

    if (settings.alarm.daily) {
        page.find('.alarm-daily').addClass('selected')
    }

    $.each(settings.colors, function (i, v) {
       page.find('.colors tr[data-color="'+i+'"] .color-picker').spectrum("set", v);
    });

    page.find('[name="main_text"]').val(settings.main_text);
    page.find('[name="sub_text"]').val(settings.sub_text);

    page.find('.show-numerals').on('click', function (e) {

        settings.show_numerals = !settings.show_numerals;

        $(this).toggleClass('selected');
        widget.setSettings('widget-clock', settings);
    });

    page.find('.alarm-daily').on('click', function (e) {

        settings.alarm.daily = !settings.alarm.daily;

        $(this).toggleClass('selected');
        widget.setSettings('widget-clock', settings);
    });

    page.find('.enable-alarm').on('click', function (e) {

        settings.alarm.enabled = !settings.alarm.enabled;

        if (settings.alarm.enabled) {
            $(this).addClass('selected');
            page.find('.alarm_settings').slideDown();
        }
        else {
            $(this).removeClass('selected');
            page.find('.alarm_settings').slideUp();
        }

        widget.setSettings('widget-clock', settings);
    });

    page.find('.text').on('change', function (e) {
        settings[$(this).attr('name')] = $(this).val();
        widget.setSettings('widget-clock', settings);
    });

    page.find('.alarm-time').on('change', function (e) {
        settings.alarm.time = covert_time_to_24_hr($(this).val());
        widget.setSettings('widget-clock', settings);
    }).val(settings.alarm.time);

    page.find('.reset').on('click', function (e) {
        e.preventDefault();

        $.each(settings.defaults.colors, function (i, v) {
            page.find('.colors tr[data-color="'+i+'"] .color-picker').spectrum("set", v);
        });

        settings.colors = settings.defaults.colors;
        widget.setSettings('widget-clock', settings);
    });


    function covert_time_to_24_hr(time) {
        let hrs = Number(time.match(/^(\d+)/)[1]);
        let mnts = Number(time.match(/:(\d+)/)[1]);
        let format = time.match(/\s(.*)$/)[1];
        if (format === "PM" && hrs < 12) hrs = hrs + 12;
        if (format === "AM" && hrs === 12) hrs = hrs - 12;
        let hours = hrs.toString();
        let minutes = mnts.toString();
        if (hrs < 10) hours = "0" + hours;
        if (mnts < 10) minutes = "0" + minutes;
        return hours + ":" + minutes;
    }
});