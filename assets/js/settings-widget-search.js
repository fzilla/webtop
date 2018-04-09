plugin.onInit('settings-widget-search', function (page, panel, data, ev) {

    let settings = widget.getSettings('web-search');

    function init() {
        $.each(settings['enabled_search_engines'], function (i, v) {
            page.find('.search-engines li[data-engine="'+v+'"] .visibility').addClass('visible').addClass('fa-eye').removeClass('fa-eye-slash');
        });

        page.find('.search-engines li[data-engine="'+settings['search_engine']+'"] .check').addClass('checked');

        if (settings.enable_suggestions) {
            page.find('.enable-suggestions').addClass('selected')
        }

        panel.setHeaderLogo('<i class="fa fa-search"></i>');
        panel.setHeaderTitle('Search Engine');
    }

    init();

    page.find('.visibility').on('click', function (e) {
        let engine = $(this).closest('li').attr('data-engine');
        if ($(this).hasClass('visible')) {
            if (engine === settings['search_engine']) return;

            $(this).removeClass('visible').addClass('fa-eye-slash').removeClass('fa-eye');
            settings.enabled_search_engines.slice(settings.enabled_search_engines.indexOf(engine), 1);
            widget.setSettings('web-search', settings);
        }
        else {
            $(this).addClass('visible').addClass('fa-eye').removeClass('fa-eye-slash');
            settings.enabled_search_engines.push(engine);
            widget.setSettings('web-search', settings);
        }
    });

    page.find('.check').on('click', function (e) {
        if(!$(this).hasClass('checked')) {
            let engine = $(this).closest('li').attr('data-engine');

            page.find('.check.checked').removeClass('checked');
            $(this).addClass('checked');
            settings.search_engine = engine;

            if (settings.enabled_search_engines.indexOf(engine) < 0) {
                settings.enabled_search_engines.push(engine);
                page.find('.search-engines li[data-engine="'+engine+'"] .visibility').addClass('visible').addClass('fa-eye').removeClass('fa-eye-slash');
            }
            widget.setSettings('web-search', settings);
        }
    });

    page.find('.enable-suggestions').on('click', function (e) {

        settings.enable_suggestions = !settings.enable_suggestions;

        $(this).toggleClass('selected');
        widget.setSettings('web-search', settings);
    });
});