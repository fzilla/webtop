plugin.onInit('page-settings', function (page, panel, data, ev) {

    let tab = 'settings-theme';
    if (data['tab']) tab = data['tab'];

    page.find('.pg-set-tab-list li').on('click', function (e) {
        if ($(this).hasClass('selected')) return;

        page.find('.pg-set-tab-list li').removeClass('selected');
        $(this).addClass('selected');

        tab = $(this).attr('data-tab');

        let url = $(this).find('a').attr('href');
        page.find('.pg-set-tab-cont').load(url, function () {
            plugin.triggerInit(tab, $(this), panel, data, ev)
        })
    });

    page.find('.pg-set-tab-list li a').on('click', function (e) {
        e.preventDefault();
    });

    page.find('.pg-set-tab-list li[data-tab="'+tab+'"]').trigger('click')
});