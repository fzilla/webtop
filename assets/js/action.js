var action = {
    openNewTab: function (data) {
        browser.tabs.create({url: data.widget && data.widget.url || null}).then();
    },

    openPrivateTab: function (data) {
        browser.windows.create({incognito: true, url: data.widget && data.widget.url || null}).then();
    },

    openURL: function (url, target) {
        if (url) {
            if (!target || target === '_self') {
                location.href = url;
            }
            else {
                this.openNewTab(url);
            }
        }
        else {
            location.reload();
        }
    },

    openWindow: function (page, options, data, ev) {
        let config = {
            theme:       'none',
            contentSize: {
                width: function() { return Math.min(730, window.innerWidth*0.9);},
                height: function() { return Math.min(400, window.innerHeight*0.5);}
            },
            position:    'center',
            animateIn:   'jsPanelFadeIn',
            headerTitle: 'Firefox'
        };

        config = Object.assign(config, options);

        jsPanel.create({
            container:   'body',
            config: config,
            content: function (panel) {
                $(this.content).load('/'+page+'.html', function () {
                    $(panel.content).mCustomScrollbar({
                        scrollButtons: {enable: true},
                        theme: 'dark-thin',
                        scrollInertia: 100
                    });

                    plugin.triggerInit(page, $(this), panel, data, ev)
                });
            },
            onwindowresize: true
        });
    },

    deleteShortcut: function (data) {
        $.confirm({
            title: 'Delete Shortcut!',
            content: 'Do You Want to Delete the Shortcut?',
            icon: 'fa fa-warning',
            type: 'red',
            typeAnimated: true,
            buttons: {
                yes: {
                    btnClass: 'btn-red',
                    action: function () {
                        widget.remove(data.id, function () {
                            desktop.init();
                        });
                    }
                },
                no: function () {}
            }
        });
    },

    removeWidget: function (data) {
        $.confirm({
            title: 'Delete Widget!',
            content: 'Do You Want to Remove the Widget?',
            icon: 'fa fa-warning',
            type: 'red',
            typeAnimated: true,
            buttons: {
                yes: {
                    btnClass: 'btn-red',
                    action: function () {
                        console.log(data.id)
                        widget.remove(data.id, function () {
                            desktop.init();
                        });
                    }
                },
                no: function () {}
            }
        });
    },

    executeFunc: function(functionName, context /*, args */) {
        let args = Array.prototype.slice.call(arguments, 2);
        let namespaces = functionName.split(".");
        let func = namespaces.pop();
        for(let i = 0; i < namespaces.length; i++) {
            context = context[namespaces[i]];
        }
        return context[func].apply(context, args);
    }
};