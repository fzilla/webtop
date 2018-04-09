plugin.onInit('shortcut', function (page, panel, data, ev) {

    let jImg = page.find('.icon_image');
    let jName = page.find('[name="name"]');
    let jUrl = page.find('[name="url"]');
    let jIconType = page.find('[name="icon_type"]');
    let jIconUrlDiv = page.find('.icon_url');
    let jIconLocalDiv = page.find('.icon_local');
    let jIconUrl = page.find('[name="icon_url"]');
    let jIconFile = page.find('[name="icon_file"]');

    let jErrName = page.find('.err-name');
    let jErrUrl = page.find('.err-url');
    let jErrIconUrl = page.find('.err-icon-url');
    let jErrFile = page.find('.err-file');


    let icon_data = {
        auto: "",
        local: "",
        url: ""
    };
    let iconType = 'auto';
    let id = 0;
    let position = {};
    let action = data.action;

    if (action === 'edit') {
        page.find('[name="submit"]').html('Update');
        jName.val(ev.widget.text);
        jUrl.val(ev.widget.url);
        jImg.attr('src', ev.widget.icon);
        id = ev.id;
        position = ev.widget.position;
        icon_data.auto = ev.widget.icon;
    }
    else {
        position = {
            row: ev.row,
            col: ev.col,
            row2: ev.row,
            col2: ev.col
        }
    }

    jName.on('change', function () {
        if (!jName.val()) {
            jErrName.html('Required').show();
        }
        else {
            jErrName.hide();
        }
    });

    page.find('.create_shortcut_form').submit(function (e) {
        e.preventDefault();

        if (!jName.val()) {
            jErrName.html('Required').show();
            return;
        }

        if (!jUrl.val() || !isUrlValid(jUrl.val())) {
            jErrUrl.html('Invalid Url').show();
            return;
        }

        let type = page.find('[name="icon_type"]:checked').val();
        let i_data;

        if (type === 'url') {
            if (!icon_data.url) {
                jErrIconUrl.html('Icon Required.').show();
                return;
            }
            i_data = icon_data.url;
        }
        else if (type === 'local') {
            if (!icon_data.local) {
                jErrFile.html('Select an Image file').show();
                return;
            }
            i_data = icon_data.local;
        }
        else {
            if (!icon_data.auto) {
                icon_data.auto = 'assets/images/icons/default.png';
            }
            i_data = icon_data.auto;
        }

        let shortcut = {
            position: position,
            icon: i_data,
            text: jName.val(),
            url: jUrl.val(),
            type: 'shortcut',
            target: ''
        };

        if (action === 'edit') {
            widget.set(id, shortcut, function () {
                desktop.init();
                panel.close();
            });
            return;
        }

        widget.add(shortcut, function () {
            desktop.init();
            panel.close();
        });
    });

    page.find('[name="cancel"]').on('click', function () {
        panel.close();
    });

    jIconType.on('click', function () {
        switch ($(this).val()) {
            case 'local':
                jIconLocalDiv.slideDown();
                jIconUrlDiv.slideUp();
                if (icon_data.local) {
                    jImg.attr('src', icon_data.local);
                }
                else {
                    jImg.attr('src', '/assets/images/icons/default.png');
                }
                iconType = 'local';
                break;
            case 'url':
                jIconLocalDiv.slideUp();
                jIconUrlDiv.slideDown();
                if (icon_data.url) {
                    jImg.attr('src', icon_data.url);
                }
                else {
                    jImg.attr('src', '/assets/images/icons/default.png');
                }
                iconType = 'url';
                break;
            default:
                jIconLocalDiv.slideUp();
                jIconUrlDiv.slideUp();
                if (icon_data.auto) {
                    jImg.attr('src', icon_data.auto);
                }
                else  {
                    jImg.attr('src', '/assets/images/icons/default.png');
                }
                iconType = 'auto';
        }
    });

    jUrl.on('change', function() {
        if (!isUrlValid($(this).val())) {
            jErrUrl.html('Invalid URL').show();
            return;
        }
        else {
            jErrUrl.hide();
        }

        if (iconType === 'auto') {
            jImg.attr('src', '/assets/images/icons/loading.gif');
        }

        let url  = 'https://api.statvoo.com/favicon/?url=' + get_hostname($(this).val());

        readImage(url, function (image) {
            icon_data.auto =  image;

            if (iconType === 'auto') {
                jImg.attr('src', icon_data.auto);
            }
        }, function () {
            if (iconType === 'auto') {
                jImg.attr('src', '/assets/images/icons/default.png');
            }
        });

    });

    jIconUrl.on('change', function () {
        if (!isUrlValid($(this).val())) {
            jErrIconUrl.html('Invalid URL').show();
            return;
        }
        else {
            jErrIconUrl.hide();
        }

        jImg.attr('src', '/assets/images/icons/loading.gif');

        readImage($(this).val(), function (image) {
            icon_data.url =  image;

            if (iconType === 'url') {
                jImg.attr('src', icon_data.url);
            }
        }, loadDefaultImage);
    });

    jIconFile.on('change', function () {
        if($(this)[0].files[0].type.indexOf("image") === -1) {
            jErrFile.html('File not supported. (Accepted: jpeg, png)');
            return false;
        }

        let iSize = ($(this)[0].files[0].size / 1024);
        if (iSize / 1024 <= 1) {
            jErrFile.hide();
            readURL(this)
        }
        else {
            jErrFile.html('File Size Too High. (Accepted: <1 MB)');
        }
    });



    function loadDefaultImage() {
        jImg.attr('src', '/assets/images/icons/default.png');
    }

    function readURL(input) {
        jImg.attr('src', '/assets/images/icons/loading.gif');
        if (input.files && input.files[0]) {
            let reader = new FileReader();

            reader.onload = function(e) {
                icon_data.local = e.target.result;
                jImg.attr('src', icon_data.local);
            };

            reader.readAsDataURL(input.files[0]);
        }
        else {
            jImg.attr('src', '/assets/images/icons/default.png');
        }
    }

    function readImage(url, success, error) {
        let img = new Image();
        img.setAttribute('crossOrigin', 'anonymous');

        img.onload = function () {
            let canvas = document.createElement("canvas");
            canvas.width = 60;
            canvas.height = 60;

            let ctx = canvas.getContext("2d");
            ctx.drawImage(this, 0, 0, canvas.width, canvas.height);

            success(canvas.toDataURL("image/png"));
        };

        img.onerror = function () {
            error();
        };

        img.src = url;
    }

    let elm;
    function isUrlValid(u){
        if(!elm){
            elm = document.createElement('input');
            elm.setAttribute('type', 'url');
        }
        elm.value = u;
        return elm.validity.valid;
    }

    function get_hostname(url) {
        let m = url.match(/^(http|https):\/\/[^/]+/);
        return m ? m[0] : null;
    }

});