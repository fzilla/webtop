plugin.onInit('settings-wallpaper', function (page, panel, data, ev) {

    let wallpaper = {
        slide_show: false,
        transition: 'cross_fade',
        interval: {
            time: 1,
            spec: 'm'
        },
        order: []
    };

    panel.setHeaderLogo('<i class="fa fa-image"></i>');
    panel.setHeaderTitle('Wallpaper');

    let jWallSortable = page.find('.wall-sortable');
    let jWallSlideShow = page.find('.wall-slide-show');
    let jWallIntTime = page.find('.wall-int-time');
    let jWallIntSpec = page.find('.wall-int-spec');
    let jWallTrans = page.find('.wall-trans');
    let jWallSlideShowOpt = page.find('.wall-slide-show-options');
    let jWallImgAdd =  page.find('.wall-img-li.wall-btn-add');
    let jWallImgFile =  page.find('.wall-img-file');


    function init() {
        page.find('.wall-img-li:not(.wall-btn-add)').remove();

        wallpaper = my_theme.getThemeWallpaper();

        let walls = my_theme.getWallpaper();
        $.each(walls, function (index, value) {
            addWallpaperDOM(index, value);
        });

        if (wallpaper.slide_show) {
            jWallSlideShow.addClass('selected');
            jWallSlideShowOpt.slideDown();
        }
        jWallIntTime.val(wallpaper.interval.time);
        jWallIntSpec.val(wallpaper.interval.spec);
        jWallTrans.val(wallpaper.transition);

        $.each(wallpaper.order, function (index, value) {
            page.find('.wall-img-li[data-id="'+value+'"]').addClass('selected');
        })
    }

    init();

    function setWallpaper() {
        my_theme.setWallpaper(wallpaper, function () {
            my_theme.apply();
        });
    }

    function selectWallpaper() {
        let li = $(this).closest('.wall-img-li');
        let id = Number(li.attr('data-id'));

        if (li.hasClass('selected')) {
            if (page.find('.wall-img-li.selected').length > 1) {
                wallpaper.order.splice(wallpaper.order.indexOf(id));
                li.removeClass('selected');
            }
        }
        else {
            if (wallpaper.slide_show) {
                li.addClass('selected');
                getOrder();
            }
            else {
                let sel = page.find('.wall-img-li.selected');
                sel.removeClass('selected');
                li.addClass('selected');
                wallpaper.order = [id];
            }
        }
        setWallpaper();
    }

    function deleteWallpaper(e) {
        e.preventDefault();
        let li = $(this).closest('.wall-img-li');
        let id = Number(li.attr('data-id'));

        if (li.hasClass('selected')) {
            wallpaper.order.splice(wallpaper.order.indexOf(id));
            li.removeClass('selected');

            let sel = page.find('.wall-img-li.selected');
            if (!sel.length) {
                sel = page.find('.wall-img-li:first');
                wallpaper.order = [Number(sel.attr('data-id'))];
            }
            setWallpaper();
        }

        $.confirm({
            title: 'Delete Wallpaper!',
            content: 'Do You Want to Delete the Wallpaper?',
            icon: 'fa fa-warning',
            buttons: {
                yes: function () {
                    my_theme.removeWallpaper(id, function () {
                        init();
                    })
                },
                no: function () {}
            }
        });
    }

    function getOrder() {
        let sel = page.find('.wall-img-li.selected');
        let order = [];
        $.each(sel, function (index, value) {
            order.push(Number($(value).attr('data-id')))
        });
        wallpaper.order = order;
    }

    jWallIntTime.on('change', function (e) {
        let t = $(this).val();
        let v = wallpaper.interval.spec;

        let min = 0;
        let max = 0;

        switch (v) {
            case 's':
                min = 3;
                max = 10000;
                break;
            case 'm':
                min = 0.5;
                max = 500;
                break;
            case 'h':
                min = 0.5;
                max = 100;
        }

        if (t < min || t > max) {
            jWallIntTime.val(min);
            wallpaper.interval.time = min;
        }

        wallpaper.interval.time = t;
        setWallpaper();
    });

    jWallIntSpec.on('change', function () {
        let v = $(this).val();
        let t = wallpaper.interval.time;
        let min = 0;
        let max = 0;

        switch (v) {
            case 's':
                min = 3;
                max = 10000;
                break;
            case 'm':
                min = 0.5;
                max = 500;
                break;
            case 'h':
                min = 0.5;
                max = 100;
        }

        if (t < min || t > max) {
            jWallIntTime.val(min);
            wallpaper.interval.time = min;
        }

        wallpaper.interval.spec = v;
        setWallpaper();
    });

    jWallTrans.on('change', function () {
        wallpaper.transition = $(this).val();
        setWallpaper();
    });

    jWallSlideShow.on('click', function (e) {
        wallpaper.slide_show = !wallpaper.slide_show;

        $(this).toggleClass('selected');

        if (wallpaper.slide_show) {
            jWallSlideShowOpt.slideDown();
        }
        else {
            jWallSlideShowOpt.slideUp();
        }

        let selected = page.find('.wall-img-li.selected');
        if (selected.length > 1) {
            selected.removeClass('selected');
            $.each(selected, function (index, value) {
                wallpaper.order.splice(wallpaper.order.indexOf(Number($(value).attr('data-id'))));
            });

            $(selected[0]).addClass('selected');
            wallpaper.order.push(Number($(selected[0]).attr('data-id')));
        }
        setWallpaper();
    });

    jWallImgAdd.on('click', function () {
        jWallImgFile.trigger('click');
    });

    jWallImgFile.on('change', function () {
        if($(this)[0].files[0].type.indexOf("image") === -1) {
            $.alert('Unsupported file. (Supported: jpeg, png)');
            return;
        }

        let iSize = ($(this)[0].files[0].size / 1024);
        if (iSize > 5120) {
            $.alert('File Size too high. (Supported: <5 MB)');
            return;
        }

        if (this.files && this.files[0]) {
            let reader = new FileReader();

            reader.onload = function(e) {
                let image = e.target.result;

                my_theme.addWallpaper(image, function (id) {
                    addWallpaperDOM(id, {url: image, system: false});
                }, function () {
                    $.alert('Unexpected Error.');
                })
            };

            reader.readAsDataURL(this.files[0]);
        }
    });

    function addWallpaperDOM(id, wall) {
        let system = wall.system ? 'system' : '';
        let html = '<li class="wall-img-li '+system+'" data-id="'+id+'">\n' +
            '            <img class="wall-img" src="'+wall.url+'">\n' +
            '            <span class="wall-delete"><a href="#"><i class="fa fa-trash"></i></a></span>\n' +
            '            <span class="wall-select"><i class="fa fa-square"></i><i class="fa fa-check-square"></i></span>\n' +
            '        </li>';
        html = $(html);
        html.find('.wall-select .fa-square, .wall-select .fa-check-square').on('click', selectWallpaper);
        html.find('.wall-delete').on('click', deleteWallpaper);
        jWallImgAdd.before(html);
        jWallSortable.sortable({
            items: "li:not(.wall-btn-add)",
            change: function () {
                getOrder();
                setWallpaper();
            }
        });
    }
});