plugin.onInit('settings-theme', function (page, panel, data, ev) {

    panel.setHeaderLogo('<i class="fa fa-snowflake-o"></i>');
    panel.setHeaderTitle('Browser Theme');

    let settings = widget.getSettings('browser-theme');

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
            settings.colors[$(this).attr('name')] = color.toHexString();
            setTheme();
        }
    });

    $.each(settings.images.default, function (index, value) {
        addWallpaperDOM(index, value);
    });

    if (settings.images.user) {
        addWallpaperDOM('user', {url: settings.images.user, system: false});
    }

    $.each(settings.colors, function (i, v) {
        page.find('.color-picker[name="'+i+'"]').spectrum("set", v);
    });

    page.find('.theme-img-li[data-id="'+settings.image+'"]').addClass('selected');

    function setTheme() {
        widget.setSettings('browser-theme', settings, function () {
            let image = '';
            if (settings.image === 'user') {
                image = settings.images.user;
            }
            else if (settings.images.default[settings.image]) {
                image = settings.images.default[settings.image].url;
            }

            let theme = {
                images: {
                    headerURL: image
                },
                colors: {
                    accentcolor: settings.colors.accent_color,
                    textcolor: settings.colors.text_color
                }
            };

            browser.theme.update(theme)
        });
    }

    function addWallpaperDOM(id, wall) {
        let html = '<li class="theme-img-li" data-id="'+id+'">\n' +
            '            <img class="theme-img" src="'+wall.url+'">\n' +
            '            <span class="theme-select"><i class="fa fa-square"></i><i class="fa fa-check-square"></i></span>\n' +
            '        </li>';
        html = $(html);
        html.find('.theme-select .fa-square, .theme-select .fa-check-square').on('click', selectImage);
        page.find('.theme-image .theme-btn-add').before(html);

    }

    function selectImage() {
        let li = $(this).closest('.theme-img-li');
        let id = Number(li.attr('data-id'));

        if (isNaN(id)) {
            id = 'user';
        }

        if (!li.hasClass('selected')) {
            page.find('.theme-img-li.selected').removeClass('selected');
            li.addClass('selected');

            settings.enabled = true;
            settings.image = id;
        }
        setTheme();
    }

    page.find('.reset').on('click', function (e) {
        e.preventDefault();
        settings.enabled = false;

        browser.theme.reset();

        settings.colors.text_color = '#ffffff';
        settings.colors.accent_color = '#000000';

        widget.setSettings('browser-theme', settings);

        $.each(settings.colors, function (i, v) {
            page.find('.color-picker[name="'+i+'"]').spectrum("set", v);
        });
    });

    page.find('.theme-btn-add').on('click', function (e) {
        page.find('.img-file').trigger('click');
    });

    page.find('.img-file').on('change', function () {
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

                jsPanel.modal.create({
                    headerTitle: 'Crop Image',
                    contentSize: {
                        width: 890,
                        height: 390
                    },
                    resizeit: {
                        handles:   'n, e, s, w, ne, se, sw, nw',
                        minWidth:  890,
                        minHeight: 390,
                    },
                    content: function (panel) {
                        $(this.content).load('/settings-theme.html #cropper-modal', function () {

                            let $image = $(this).find('#crop-image').attr('src', image);
                            $image.cropper({
                                aspectRatio: 15 / 1
                            });

                            let cropper = $image.data('cropper');

                            $(this).find('.crop-button').on('click', function (e) {
                                let canvas = cropper.getCroppedCanvas();
                                console.log(canvas.toDataURL("image/png"));
                                settings.images.user = canvas.toDataURL("image/png");
                                widget.setSettings('browser-theme', settings, function () {
                                    page.find('.theme-img-li[data-id="user"]').remove();
                                    addWallpaperDOM('user', {url: settings.images.user, system: false});
                                    panel.close();
                                });
                            })

                        });
                    },
                });
            };

            reader.readAsDataURL(this.files[0]);
        }
    });
});