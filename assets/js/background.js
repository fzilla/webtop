'use strict';



var myApp = {
    myTab: '/index.html',

    openMyTab: function () {
        const url = browser.extension.getURL(myApp.myTab);

        browser.tabs.query({}).then(function (queryInfo) {

            let tabId = null;
            for (let i = 0; i < queryInfo.length; i++) {
                if (queryInfo[i].url === url) {
                    tabId = queryInfo[i].id;
                    break;
                }
            }

            if (tabId) {
                browser.tabs.update(tabId, {active: true});
            }
            else {
                browser.tabs.create({url: url});
            }
        })
    },

    onInstalled: function (details) {
        let wallpapers = [
            {url: 'assets/images/wallpapers/wallpaper-1.jpg', system: true},
            {url: 'assets/images/wallpapers/wallpaper-2.jpg', system: true},
            {url: 'assets/images/wallpapers/wallpaper-3.jpg', system: true},
            {url: 'assets/images/wallpapers/wallpaper-4.jpg', system: true},
            {url: 'assets/images/wallpapers/wallpaper-5.jpg', system: true},
            {url: 'assets/images/wallpapers/wallpaper-6.jpg', system: true}
        ];

        let my_theme = {
            wallpaper: {
                slide_show: false, transition: 'fade', interval: {time: 1, spec: 'm'}, order: [0]
            }
        };

        let desktop_widgets = [
            {
                "position": {
                    "row": 0,
                    "col": 0,
                    "row2": 0,
                    "col2": 0
                },
                "icon": "assets/images/icons/google.png",
                "text": " Google",
                "url": "https://www.google.com/",
                "type": "shortcut"
            },
            {
                "position": {
                    "row": 1,
                    "col": 0,
                    "row2": 1,
                    "col2": 0
                },
                "icon": "assets/images/icons/bing.png",
                "text": " Bing",
                "url": "https://www.bing.com/",
                "type": "shortcut"
            },
            {
                "position": {
                    "row": 2,
                    "col": 0,
                    "row2": 2,
                    "col2": 0
                },
                "icon": "assets/images/icons/yahoo.png",
                "text": " Yahoo",
                "url": "https://www.yahoo.com/",
                "type": "shortcut"
            },
            {
                "position": {
                    "row": 3,
                    "col": 0,
                    "row2": 3,
                    "col2": 0
                },
                "icon": "assets/images/icons/yandex.png",
                "text": " Yandex",
                "url": "https://www.yandex.com/",
                "type": "shortcut"
            },
            {
                "position": {
                    "row": 4,
                    "col": 0,
                    "row2": 4,
                    "col2": 0
                },
                "icon": "assets/images/icons/duckduckgo.png",
                "text": "DuckDuckGo",
                "url": "https://duckduckgo.com/",
                "type": "shortcut"
            },
            {
                "position": {
                    "row": 0,
                    "col": 1,
                    "row2": 0,
                    "col2": 1
                },
                "icon": "assets/images/icons/gmail.png",
                "text": "Gmail",
                "url": "https://gmail.com/",
                "type": "shortcut"
            },
            {
                "position": {
                    "row": 1,
                    "col": 1,
                    "row2": 1,
                    "col2": 1
                },
                "icon": "assets/images/icons/outlook.png",
                "text": "Outlook",
                "url": "https://outlook.com/",
                "type": "shortcut"
            },
            {
                "position": {
                    "row": 2,
                    "col": 1,
                    "row2": 2,
                    "col2": 1
                },
                "icon": "assets/images/icons/yahoo-mail.png",
                "text": "Yahoo Mail",
                "url": "https://mail.yahoo.com/",
                "type": "shortcut"
            },
            {
                "position": {
                    "row": 3,
                    "col": 1,
                    "row2": 3,
                    "col2": 1
                },
                "icon": "assets/images/icons/accuweather.png",
                "text": "AccuWeather",
                "url": "https://www.accuweather.com/",
                "type": "shortcut"
            },
            {
                "position": {
                    "row": 5,
                    "col": 0,
                    "row2": 5,
                    "col2": 0
                },
                "icon": "assets/images/icons/wikipedia.png",
                "text": "Wikipedia",
                "url": "https://en.wikipedia.org/wiki/Wikipedia/",
                "type": "shortcut"
            },
            {
                "position": {
                    "row": 0,
                    "col": 2,
                    "row2": 0,
                    "col2": 2
                },
                "icon": "assets/images/icons/fb.png",
                "text": "Facebook",
                "url": "https://www.facebook.com/",
                "type": "shortcut"
            },
            {
                "position": {
                    "row": 1,
                    "col": 2,
                    "row2": 1,
                    "col2": 2
                },
                "icon": "assets/images/icons/twitter.png",
                "text": "Twitter",
                "url": "https://twitter.com/",
                "type": "shortcut"
            },
            {
                "position": {
                    "row": 2,
                    "col": 2,
                    "row2": 2,
                    "col2": 2
                },
                "icon": "assets/images/icons/instagram.png",
                "text": "Instagram",
                "url": "https://www.instagram.com/",
                "type": "shortcut"
            },
            {
                "position": {
                    "row": 3,
                    "col": 2,
                    "row2": 3,
                    "col2": 2
                },
                "icon": "assets/images/icons/whatsapp.png",
                "text": "WhatsApp",
                "url": "https://www.whatsapp.com/",
                "type": "shortcut"
            },
            {
                "position": {
                    "row": 3,
                    "col": 4,
                    "row2": 3,
                    "col2": 4
                },
                "icon": "assets/images/icons/linkedin.png",
                "text": "LinkedIn",
                "url": "https://www.linkedin.com/",
                "type": "shortcut"
            },
            {
                "position": {
                    "row": 1,
                    "col": 3,
                    "row2": 1,
                    "col2": 3
                },
                "icon": "assets/images/icons/youtube.png",
                "text": "Youtube",
                "url": "https://www.youtube.com/",
                "type": "shortcut"
            },
            {
                "position": {
                    "row": 0,
                    "col": 3,
                    "row2": 0,
                    "col2": 3
                },
                "icon": "assets/images/icons/netflix.png",
                "text": "Netflix",
                "url": "https://www.netflix.com/",
                "type": "shortcut"
            },
            {
                "position": {
                    "row": 4,
                    "col": 1,
                    "row2": 4,
                    "col2": 1
                },
                "icon": "assets/images/icons/reddit.png",
                "text": "reddit",
                "url": "https://www.reddit.com/",
                "type": "shortcut"
            },
            {
                "position": {
                    "row": 4,
                    "col": 2,
                    "row2": 4,
                    "col2": 2
                },
                "icon": "assets/images/icons/quora.png",
                "text": "Quora",
                "url": "https://www.quora.com/",
                "type": "shortcut"
            },
            {
                "position": {
                    "row": 5,
                    "col": 1,
                    "row2": 5,
                    "col2": 1
                },
                "icon": "assets/images/icons/stackoverflow.png",
                "text": "StackOverflow",
                "url": "https://stackoverflow.com/",
                "type": "shortcut"
            },
            {
                "position": {
                    "row": 4,
                    "col": 3,
                    "row2": 4,
                    "col2": 3
                },
                "icon": "assets/images/icons/amazon.png",
                "text": "Amazon",
                "url": "https://www.amazon.com/",
                "type": "shortcut"
            },
            {
                "position": {
                    "row": 2,
                    "col": 3,
                    "row2": 2,
                    "col2": 3
                },
                "icon": "assets/images/icons/flipkart.png",
                "text": "Flipkart",
                "url": "https://www.flipkart.com/",
                "type": "shortcut"
            },
            {
                "position": {
                    "row": 3,
                    "col": 3,
                    "row2": 3,
                    "col2": 3
                },
                "icon": "assets/images/icons/ebay.png",
                "text": "ebay",
                "url": "https://www.ebay.com/",
                "type": "shortcut"
            },
            {
                "position": {
                    "row": 5,
                    "col": 2,
                    "row2": 5,
                    "col2": 2
                },
                "icon": "assets/images/icons/microsoft.png",
                "text": "Microsoft",
                "url": "https://www.microsoft.com/",
                "type": "shortcut"
            },
            {
                "position": {
                    "row": 4,
                    "col": 4,
                    "row2": 4,
                    "col2": 4
                },
                "icon": "assets/images/icons/vk.png",
                "text": "VK",
                "url": "https://vk.com/",
                "type": "shortcut"
            },
            {
                "position": {
                    "row": 0,
                    "col": 4,
                    "row2": 0,
                    "col2": 4
                },
                "icon": "assets/images/icons/google-drive.png",
                "text": "Google Drive",
                "url": "https://drive.google.com/",
                "type": "shortcut"
            },
            {
                "position": {
                    "row": 1,
                    "col": 4,
                    "row2": 1,
                    "col2": 4
                },
                "icon": "assets/images/icons/onedrive.png",
                "text": "OneDrive",
                "url": "https://onedrive.live.com/",
                "type": "shortcut"
            },
            {
                "position": {
                    "row": 2,
                    "col": 4,
                    "row2": 2,
                    "col2": 4
                },
                "icon": "assets/images/icons/dropbox.png",
                "text": "DropBox",
                "url": "https://www.dropbox.com/",
                "type": "shortcut"
            },
            {
                "position": {
                    "row": 5,
                    "col": 3,
                    "row2": 5,
                    "col2": 3
                },
                "icon": "/assets/images/icons/firefox.png",
                "text": "Firefox",
                "url": "https://www.mozilla.org/en-US/firefox/new/",
                "type": "shortcut"
            },
            {
                "position": {
                    "row": 5,
                    "col": 4,
                    "row2": 5,
                    "col2": 4
                },
                "icon": "assets/images/icons/mozilla.png",
                "text": "Mozilla",
                "url": "https://www.mozilla.org/en-US/",
                "type": "shortcut"
            },
            {
                "position": {
                    "row": 0,
                    "col": 5,
                    "row2": 1,
                    "col2": 10
                },
                "name": "Web Search",
                "id": "widget-search",
                "url": "/widget-search.html",
                "type": "widget"
            },
            {
                "position": {
                    "row": 1,
                    "col": 12,
                    "row2": 3,
                    "col2": 14
                },
                "name": "Clock",
                "id": "widget-clock",
                "url": "/widget-clock.html",
                "type": "widget"
            }
        ];

        let widget_settings = {
            'web-search': {
                search_engine: 'google',
                enabled_search_engines: ['google', 'bing', 'yahoo', 'yandex', 'duckduckgo', 'youtube', 'wikipedia'],
                enable_suggestions: true
            },
            'widget-clock': {
                colors: {
                    dial: '#000000',
                    second_hand: '#F3A829',
                    minute_hand: '#222222',
                    hour_hand: '#222222',
                    alarm_hand: '#FFFFFF',
                    alarm_hand_tip: '#026729',
                },
                defaults: {
                    colors: {
                        dial: '#000000',
                        second_hand: '#F3A829',
                        minute_hand: '#222222',
                        hour_hand: '#222222',
                        alarm_hand: '#FFFFFF',
                        alarm_hand_tip: '#026729',
                    },
                },
                alarm: {
                    enabled: false,
                    time: '',
                    daily: false
                },
                show_numerals:true,
                main_text: 'Webtop',
                sub_text: 'Gifty'
            },
            'browser-theme': {
                enabled: false,
                image: '',
                colors: {
                    accent_color: "#CF723F",
                    text_color: "#000"
                },
                images: {
                    default: [
                        {url: 'assets/images/themes/theme-1.jpg', system: true},
                        {url: 'assets/images/themes/theme-2.jpg', system: true},
                        {url: 'assets/images/themes/theme-3.jpg', system: true},
                        {url: 'assets/images/themes/theme-4.jpg', system: true},
                        {url: 'assets/images/themes/theme-5.jpg', system: true},
                        {url: 'assets/images/themes/theme-6.jpg', system: true},
                    ],
                    user: ''
                }
            },
            'widgets': [
                {
                    position: {
                        row: 0,
                        col: 3,
                        row2: 1,
                        col2: 8
                    },
                    name: "Web Search",
                    id: 'widget-search',
                    url: "/widget-search.html",
                    type: 'widget'
                },
                {
                    position: {
                        row: 3,
                        col: 6,
                        row2: 5,
                        col2: 8
                    },
                    name: "Clock",
                    id: 'widget-clock',
                    url: "/widget-clock.html",
                    type: 'widget'
                }
            ]
        };

        browser.storage.local.set({wallpapers, my_theme, desktop_widgets, widget_settings});
    },

    onLoaded: function () {
        browser.storage.local.get('widget_settings').then(function (value) {
            if (value['widget_settings'] && value['widget_settings']['browser-theme'] && value['widget_settings']['browser-theme']['enabled']) {
                let b_theme = value['widget_settings']['browser-theme'];
                let image = b_theme.image;
                if (image === 'user') image = b_theme.images.user;
                let theme = {
                    images: {
                        headerURL: image
                    },
                    colors: {
                        accentcolor: b_theme.colors.accent_color,
                        textcolor: b_theme.colors.text_color
                    }
                };

                browser.theme.update(theme)
            }
        });
    }
};


browser.browserAction.onClicked.addListener(myApp.openMyTab);
browser.runtime.onInstalled.addListener(myApp.onInstalled);

myApp.onLoaded();