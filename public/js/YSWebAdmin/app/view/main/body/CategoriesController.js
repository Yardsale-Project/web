'use strict';

Ext.define('YSWebAdmin.view.main.body.CategoriesController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.categories',

    init : function() {
        this.control({
            'app-categories' : {
                boxready  : 'onAppCategoriesBoxReady'
            },

            'app-categories #categoryPanel' : {
                afterrender  : 'onTreePanelAfterRender'
            }
        });
    },

    onAppCategoriesBoxReady : function() {
        var appBodyHeight = this.view.up('app-body').getHeight();

        this.lookupReference('categoryPanel').setHeight(appBodyHeight);
        this.lookupReference('categoryInfo').setHeight(appBodyHeight);

        //this.lookupReference('categoryPanel').expandAll();

        YSDebug.log('App body height',appBodyHeight);
    },

    onTreePanelAfterRender : function() {
        var treePanel = this.lookupReference('categoryPanel');
        var store = treePanel.getStore();

        store.on('load', function(el, records, successful) {
            if(successful) {
                treePanel.expandAll();
            }
        });
    }
});