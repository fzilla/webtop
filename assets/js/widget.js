const widget = {
    desktop_widgets: [],
    widget_settings: {},
    getAll: function () {
        return widget.desktop_widgets;
    },
    get: function (id) {
        return widget.desktop_widgets[id];
    },
    set: function (id, data, success, failure) {
        widget.desktop_widgets[id] = data;
        widget.store_widgets(success, failure);
    },
    add: function (data, success, failure) {
        widget.desktop_widgets.push(data);
        widget.store_widgets(success, failure);
    },
    remove: function (id, success, failure) {
        widget.desktop_widgets.splice(id, 1);
        widget.store_widgets(success, failure);
    },

    getSettings: function (id) {
        return widget.widget_settings[id];
    },
    setSettings: function (id, data, success, failure) {
        widget.widget_settings[id] = data;
        widget.store_settings(success, failure);
    },

    store_widgets: function (success, failure) {
        browser.storage.local.set({'desktop_widgets': widget.desktop_widgets}).then(success, failure);
    },
    store_settings: function (success, failure) {
        browser.storage.local.set({'widget_settings': widget.widget_settings}).then(success, failure);
    },

    init: function (success, failure) {
        browser.storage.local.get(['desktop_widgets', 'widget_settings']).then(function (value) {
            if (value['desktop_widgets'])
                widget.desktop_widgets = value['desktop_widgets'];

            if (value['widget_settings'])
                widget.widget_settings = value['widget_settings'];
            success();
        }, failure);
    },

    initCallbacks: {},
    onInit: function (page, callback) {
        widget.initCallbacks[page] = callback;
    },
    triggerInit: function (page, page_content, window, data, ev) {
        if (widget.initCallbacks[page]) {
            widget.initCallbacks[page](page_content, window, data, ev);
        }
    }
};