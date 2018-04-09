
const plugin= {
    pages: {},
    onInit: function (page, callback) {
        plugin.pages[page] = callback;
    },
    triggerInit: function (page, page_content, window, data, ev) {
        if (plugin.pages[page]) {
            plugin.pages[page](page_content, window, data, ev);
        }
    }
};

const window_specs = {
    shortcut: {
        contentSize: {
            width: 335,
            height: 390
        },
        headerTitle: 'Shortcut',
        headerControls: 'closeonly'
    },
    settings: {
        contentSize: {
            width: 890,
            height: 390
        },
        headerTitle: 'Settings',
        headerControls: 'closeonly'
    }
};

const context_menus = {
    desktop: {
        new_shortcut: {name: "New Shortcut", icon: "fa-plus", action: "window", page: "shortcut", options: window_specs.shortcut, data: {action: 'add'}},
        refresh: {name: "Refresh", icon: "fa-refresh", action: "link", url: "", target: '_self'},
        sep1: "---------",
        open_new_tab: {name: "Open New Tab", icon: "fa-external-link-square", action: "js", call: "action.openNewTab"},
        open_private_tab: {name: "Open Private Tab", icon: "fa-user-secret", action: "js", call: "action.openPrivateTab"},
        sep2: "---------",
        change_background: {name: "Change Background", icon: "fa-picture-o", action: "window", page: "page-settings", options: window_specs.settings, data: {tab: 'settings-wallpaper'}},
        add_widget: {name: "Add Widget", icon: "fa-puzzle-piece", action: "window", url: "", page: "page-settings", options: window_specs.settings, data: {tab: 'settings-widgets'}},
        settings: {name: "Settings", icon: "fa-cog", action: "window", page: "page-settings", options: window_specs.settings, data: {}}
    },
    shortcut: {
        open_in_new_tab: {name: "Open In New Tab", icon: "fa-external-link-square", action: "js", call: "action.openNewTab"},
        open_in_private_tab: {name: "Open In Private Tab", icon: "fa-user-secret", action: "js", call: "action.openPrivateTab"},
        sep1: "---------",
        edit: {name: "Edit", icon: "fa-pencil", action: "window", page: "shortcut", options: window_specs.shortcut, data: {action: 'edit'}},
        delete: {name: "Delete", icon: "fa-trash", action: "js", call: "action.deleteShortcut"}
    },
    widgets: {
        default: {
            remove: {name: "Remove", icon: "fa-trash", action: "js", call: "action.removeWidget"}
        },
        'web-search': {
            remove: {name: "Remove", icon: "fa-trash", action: "js", call: "action.removeWidget"},
            settings: {name: "Settings", icon: "fa-cog", action: "window", page: "page-settings", options: window_specs.settings, data: {tab: 'widget-search'}}
        }
    }
};

const search_engine_url = {
    google: {
        search: 'https://www.google.com/search?q={q}&ie=utf-8&oe=utf-8&client=firefox-b-ab',
        suggestion: 'http://suggestqueries.google.com/complete/search?output=firefox&client=firefox&q={q}'
    },
    bing: {
        search: 'https://www.bing.com/search?q={q}&pc=MOZI&form=MOZLBR',
        suggestion: 'http://api.bing.com/osjson.aspx?query={q}'
    },
    yahoo: {
        search: 'https://search.yahoo.com/search?p={q}',
        suggestion: 'http://ff.search.yahoo.com/gossip?output=fxjson&command={q}'
    },
    youtube: {
        search: 'https://www.youtube.com/results?search_query={q}'
    },
    yandex: {
        search: 'https://yandex.com/search/?text={q}'
    },
    duckduckgo: {
        search: 'https://duckduckgo.com/?q={q}&t=ffab&atb=v100-4'
    },
    wikipedia: {
        search: 'https://en.wikipedia.org/wiki/Special:Search?search={q}&sourceid=Mozilla-search',
        suggestion: 'http://en.wikipedia.org/w/api.php?action=opensearch&search={q}'
    },
    stackoverflow: {
        search: 'https://stackoverflow.com/search?q={q}'
    },
    flipkart: {
        search: 'https://www.flipkart.com/search?q={q}'
    },
    amazon: {
        search: 'https://www.amazon.com/exec/obidos/external-search/?field-keywords={q}&ie=UTF-8&mode=blended&tag=mozilla-20&sourceid=Mozilla-search',
        suggestion: 'http://completion.amazon.com/search/complete?search-alias=aps&client=amazon-search-ui&mkt=1&q={q}'
    }
};


$.contextMenu({
    selector: '.desktop_grid .widget_grid',
    build: function($trigger, e) {
        return {
            callback: function(key, options) {
                options = options.build()['items'][key];
                let ev = {
                    row: Number($trigger.attr('data-row')),
                    col: Number($trigger.attr('data-col')),
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
            },
            items: context_menus.desktop
        };
    }
});

let my_theme = {
    data: {},
    wallpapers: [],
    desktop_Wallpaper_wrapper: $('.wallpaper_slider .swiper-wrapper'),
    swiper: null,
    getThemeWallpaper: function () {
        return my_theme.data['wallpaper'];
    },
    getWallpaper: function (id) {
        if (id >= 0) {
            return my_theme.wallpapers[id]
        }
        return my_theme.wallpapers;
    },
    addWallpaper: function (wallpaper, success, failure) {
        my_theme.wallpapers.push({url: wallpaper, system: false});
        my_theme.storeWallpaper(function () {
            success(my_theme.wallpapers.length - 1);
        }, failure)
    },
    removeWallpaper: function (id, success, failure) {
        my_theme.wallpapers.splice(id, 1);
        my_theme.storeWallpaper(success, failure)
    },
    setWallpaper: function (wallpaper, success, failure) {
        my_theme.data['wallpaper'] = wallpaper;
        my_theme.store(success, failure)
    },
    getTheme: function () {
        return my_theme.data['theme']
    },
    setTheme: function (theme, success, failure) {
        my_theme.data['theme'] = theme;
        my_theme.store(success, failure)
    },

    apply: function () {
        let wall = my_theme.getThemeWallpaper();

        if (wall.slide_show) {
            if (my_theme.swiper) { my_theme.swiper.destroy(); my_theme.swiper = null; }
            my_theme.desktop_Wallpaper_wrapper.html('');

            $.each(wall.order, function (index, value) {
                let v = my_theme.getWallpaper(value);
                my_theme.desktop_Wallpaper_wrapper.append('<div class="swiper-slide"><img src="'+v.url+'"></div>')
            });

            let delay = 5000;

            switch (wall.interval.spec) {
                case 's':
                    delay = wall.interval.time * 1000;
                    break;
                case 'm':
                    delay = wall.interval.time * 60000;
                    break;
                case 'h':
                    delay = wall.interval.time * 3600000;
                    break;
            }

            my_theme.swiper = new Swiper('.wallpaper_slider', {
                speed: 400,
                spaceBetween: 100,

                simulateTouch: false,
                shortSwipes: false,
                longSwipes: false,

                preloadImages: false,
                lazy: true,

                loop: true,

                effect: wall.transition,

                autoplay: {
                    delay: delay,
                },
            });
        }
        else {
            if (my_theme.swiper) { my_theme.swiper.destroy(); my_theme.swiper = null; }
            let v = my_theme.getWallpaper(wall.order[0]);
            my_theme.desktop_Wallpaper_wrapper.html('<img src="'+v.url+'">');
        }
    },

    store: function (success, failure) {
        browser.storage.local.set({'my_theme': my_theme.data}).then(success, failure);
    },
    storeWallpaper: function (success, failure) {
        browser.storage.local.set({'wallpapers': my_theme.wallpapers}).then(success, failure);
    },

    init: function (success, failure) {
        browser.storage.local.get(['my_theme', 'wallpapers']).then(function (value) {
            if (value['my_theme'])
                my_theme.data = value['my_theme'];

            if (value['wallpapers'])
                my_theme.wallpapers = value['wallpapers'];
            success();
        }, failure);
    }
};

my_theme.init(function () {
    widget.init(function () {
        desktop.init();
    });

    my_theme.apply();
});


// browser.storage.local.get().then(function (value) { console.log(JSON.stringify(value)) });
// browser.storage.local.clear()