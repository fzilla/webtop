let desktop = {
    grid: $('.desktop_grid'),
    size: {
        width: 0,
        height: 0
    },

    icon: {
        size: {
            width: 90,
            height: 90
        },
        count: {
            col: 0,
            row: 0,
            count: 0
        }
    },

    init: function () {
        desktop.size = {
            width: desktop.grid.width(),
            height: desktop.grid.height(),
            offsetTop: parseInt(desktop.grid.css('margin-top')) + parseInt(desktop.grid.css('padding-top')),
            offsetLeft: parseInt(desktop.grid.css('margin-left')) + parseInt(desktop.grid.css('padding-left')),
            innerWidth: desktop.grid.innerWidth(),
            innerHeight: desktop.grid.innerHeight()
        };

        desktop.icon.count = {
            row: Math.floor(desktop.size.height/desktop.icon.size.height),
            col: Math.floor(desktop.size.width/desktop.icon.size.width)
        };
        desktop.icon.count.count = desktop.icon.count.row * desktop.icon.count.col - 1;

        desktop.grid.html('');

        desktop.createGrid();
        desktop.drawIcons();
        desktop.initCallbacks();
        desktop.initContextMenu();

        $(window).resize(desktop.onResize);
    },

    createGrid: function () {
        for (let i = 0; i < desktop.icon.count.row; i ++) {
            for (let j = 0; j < desktop.icon.count.col; j ++) {
                desktop.grid.append('<div class="widget_grid" data-col="'+j+'" data-row="'+i+'"></div>');
            }
        }
    },

    drawIcons: function () {
        $.each(widget.getAll(), function (index, value) {
            if (value.position.row <= desktop.icon.count.row && value.position.col <= desktop.icon.count.col) {
                let top = value.position.row * desktop.icon.size.height + desktop.size.offsetTop;
                let left = value.position.col * desktop.icon.size.width + desktop.size.offsetLeft;

                if (!value.position.col2) value.position.col2 = value.position.col;
                if (!value.position.row2) value.position.row2 = value.position.row;

                let width = (value.position.col2 - value.position.col + 1) * desktop.icon.size.width;
                let height = (value.position.row2 - value.position.row + 1) * desktop.icon.size.height;

                let html = '';

                if (value.type === 'shortcut') {
                    html = '<a href="'+value.url+'"><img src="'+value.icon+'"><p>'+value.text+'</p></a>';
                }
                else if (value.type === 'widget') {
                    html = '<div class="drag-handler" data-widget="'+value.id+'" data-widget-id="'+index+'"></div><div class="widget-content"></div>';
                }

                let div = $('<div></div>')
                    .addClass('widget_container')
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

                desktop.grid.append(div);

                if (value.type === 'widget') {
                    div.find('.widget-content').load(value.url, function () {
                        widget.triggerInit(value.id, $(this), div, value.data || {}, value)
                    })
                }

                let tx = value.position.row + (height / desktop.icon.size.height);
                let ty = value.position.col + (width / desktop.icon.size.width);

                for (let i = value.position.row; i<tx; i++) {
                    for (let j = value.position.col; j<ty; j++) {
                        $('.widget_grid[data-col="'+j+'"][data-row="'+i+'"]').attr('data-widget-id', index);
                    }
                }
            }
        });
    },

    addNewWidget: function () {

    },

    initCallbacks: function () {
        $( ".widget_container" ).draggable({
            cancel: ".widget-content",
            revert: function () {
                if ($(this).hasClass('drag-no-revert')) {
                    $(this).removeClass('drag-no-revert');
                    return false;
                }
                return true;
            }
        });


        $('.widget_grid').droppable({
            tolerance: "pointer",
            drop: function( event, ui ) {

                let draggable = $(ui.draggable);

                let is_new = draggable.hasClass('set_widget_container');

                if (!draggable.hasClass('widget_container') && !is_new) {
                    return;
                }

                let droppable = $(this);
                let x = parseInt(droppable.attr('data-row'));
                let y = parseInt(droppable.attr('data-col'));

                let id = draggable.attr('data-widget-id');

                let ty = y + (draggable.data('width') / desktop.icon.size.width);
                let tx = x + (draggable.data('height') / desktop.icon.size.height);

                for (let i = x; i<tx; i++) {
                    for (let j = y; j<ty; j++) {
                        let c = $('.widget_grid[data-col="'+j+'"][data-row="'+i+'"]');

                        if (c.length && c.attr('data-widget-id') && c.attr('data-widget-id') !== id) {
                            return;
                        }
                    }
                }

                console.log(id);

                draggable
                    .css('top', droppable.position().top)
                    .css('left', droppable.position().left)
                    .attr('data-col', y)
                    .attr('data-row', x);

                let obj;
                if (is_new) {
                    obj = widget.getSettings('widgets')[id]
                }
                else {
                    obj = widget.get(id)
                }

                let pos = obj.position;

                pos.row2 = pos.row2 ? pos.row2 : pos.row;
                pos.col2 = pos.col2 ? pos.col2 : pos.col;

                obj.position = {
                    row: x,
                    col: y,
                    row2: (pos.row2 - pos.row) + x,
                    col2: (pos.col2 - pos.col) + y
                };

                if (is_new) {
                    widget.add(obj);
                }
                else {
                    widget.set(id, obj);
                }

                $('.widget_grid[data-widget-id="'+id+'"]').removeAttr('data-widget-id');

                for (i = x; i<tx; i++) {
                    for (j = y; j<ty; j++) {
                        $('.widget_grid[data-col="'+j+'"][data-row="'+i+'"]').attr('data-widget-id', id);
                    }
                }

                if (is_new)
                    desktop.onResize();

                return draggable.addClass('drag-no-revert');
            }
        });
    },

    initContextMenu: function () {
        $.contextMenu({
            selector: '.widget_container.shortcut',
            build: function($trigger, e) {
                return {
                    callback: function(key, options) {
                        options = options.build()['items'][key];

                        let id = Number($trigger.attr('data-widget-id'));
                        let ev = {
                            id: id,
                            widget: widget.get(id),
                            trigger: $trigger
                        };

                        switch (options.action) {
                            case "window":
                                action.openWindow(options.page, options.options, options.data, ev);
                                break;
                            case "js":
                                action.executeFunc(options.call, window, ev)
                        }
                    },
                    items: context_menus.shortcut
                };
            }
        });

        $.contextMenu({
            selector: '.widget_container.widget .drag-handler',
            build: function($trigger, e) {
                let widget_id = $trigger.attr('data-widget');
                let id = $trigger.attr('data-widget-id');
                let items = context_menus.widgets[widget_id] || context_menus.widgets.default;
                return {
                    callback: function(key, options) {
                        options = options.build($trigger, e)['items'][key];

                        let ev = {
                            id: id,
                            widget: widget.get(id),
                            trigger: $trigger
                        };

                        switch (options.action) {
                            case "window":
                                action.openWindow(options.page, options.options, options.data, ev);
                                break;
                            case "js":
                                action.executeFunc(options.call, window, ev)
                        }
                    },
                    items: items
                };
            }
        });
    },

    onResize: function () {
        desktop.init();
    }
};