
widget.onInit('widget-search', function (page, panel, data) {

    let jSearchEngine = page.find('[data-engine]');
    let jSearchForm = page.find('.form');
    let jSearchInput = page.find('.input');
    let jSearchSuggestion = page.find('.search-suggestions');


    $.contextMenu({
        selector: '[data-widget="web-search"]',
        trigger: 'none',
        items: context_menus.widgets.web_search,
        build: function($trigger, e) {
            return {
                callback: function(key, options) {
                    options = options.build()['items'][key];
                    let ev = {
                        trigger: $trigger
                    };

                    switch (options.action) {
                        case "window":
                            action.openWindow(options.page, options.options, options.data, ev);
                            break;
                        case "js":
                            action.executeFunc(options.call, window, ev);
                            break;
                        case "link":
                            action.openURL(options.url, options.target);
                            break;
                    }
                }
            };
        }
    });

    $('[data-widget="web-search"] input').mousedown(function(event) {
        if (event.which === 3) {
            event.stopPropagation();
        }
    });

    $('[data-widget="web-search"]').mousedown(function(event) {
        if (event.which === 3) {
            $('[data-widget="web-search"]').contextMenu({x: event.pageX, y: event.pageY});
        }
    });


    let settings = widget.getSettings('web-search');
    let searchEngine = settings['search_engine'];

    function init() {
        page.find('[data-engine]').hide();
        $.each(settings['enabled_search_engines'], function (i, v) {
            page.find('[data-engine="'+v+'"]').show();
        });

        page.find('[data-engine="'+searchEngine+'"]').addClass('selected');
    }

    init();

    jSearchSuggestion.mCustomScrollbar({
        scrollButtons: {enable: true},
        theme: 'dark-thin'
    });

    jSearchEngine.on('click', function () {
        jSearchEngine.not($(this)).removeClass('selected');
        $(this).toggleClass('selected');
        searchEngine = $(this).attr('data-engine');
    });

    jSearchForm.submit(function (e) {
        e.preventDefault();
        let url = search_engine_url[searchEngine]['search'];
        url = url.replace('{q}', jSearchInput.val());
        action.openURL(url);
    });

    if (settings.enable_suggestions) {
        jSearchInput.on('keyup', function () {
            if (!search_engine_url[searchEngine]['suggestion']) return;

            let url = search_engine_url[searchEngine]['suggestion'];
            url = url.replace('{q}', jSearchInput.val());

            $.get(url, {}, function (data) {
                data = data[1];

                jSearchInput.autocomplete({
                    source: data,
                    appendTo: jSearchSuggestion
                });
            }, 'json')
        })
    }
});