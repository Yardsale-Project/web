'use strict';

Ext.define('YSWeb.view.main.product.thumbnail.ListViewController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.app-listView',

    init : function () {
        this.control({
            'app-view-list' : {
                beforerender    : 'onListViewBeforeRender',
                afterrender     : 'onListViewAfterRender'
            }
        });

        this.layoutCount = 0;
    },

    onListViewAfterRender   : function() {
        
    },

    onListViewBeforeRender : function() {

        var store = this.view.getStore();
        var viewListControllerGridWidth = this.view.panelWidth;

        this.view.setWidth(viewListControllerGridWidth);

        store.load();

        console.log('list view render');

    }
});
