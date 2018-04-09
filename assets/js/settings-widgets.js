plugin.onInit('settings-widgets', function (page, panel, data, ev) {
    panel.setHeaderLogo('<i class="fa fa-puzzle-piece"></i>');
    panel.setHeaderTitle('Widgets');

    let settings = widget.getSettings('widgets');
    console.log(settings);

    $.each(settings, function (index, value) {
        let top = value.position.row * desktop.icon.size.height + desktop.size.offsetTop;
        let left = value.position.col * desktop.icon.size.width + desktop.size.offsetLeft;

        if (!value.position.col2) value.position.col2 = value.position.col;
        if (!value.position.row2) value.position.row2 = value.position.row;

        let width = (value.position.col2 - value.position.col + 1) * desktop.icon.size.width;
        let height = (value.position.row2 - value.position.row + 1) * desktop.icon.size.height;

        let html = '<div class="drag-handler" data-widget="'+value.id+'" data-widget-id="'+index+'"></div><div class="set-widget-content"></div>';
        let div = $('<div></div>')
            .addClass('set_widget_container')
            .addClass(value.type)
            .data('width', width)
            .data('height', height)
            .attr('data-widget-id', index)
            .attr('data-row', value.position.row)
            .attr('data-col', value.position.col)
            .css('top', top)
            .css('left', left)
            .css('width', width)
            .css('height', height)
            .html(html);

        page.find('.draggable').append(div);

        div.find('.set-widget-content').load(value.url, function () {
            widget.triggerInit(value.id, $(this), div, value.data || {}, value)
        })
    });

    page.find( ".set_widget_container" ).draggable({
        helper: "clone",
        appendTo: ".desktop_grid",
        cancel: ".set_widget-content",
        zIndex: 9900,
        revert: function () {
            if ($(this).hasClass('drag-no-revert')) {
                $(this).removeClass('drag-no-revert');
                return false;
            }
            return true;
        }
    });
});