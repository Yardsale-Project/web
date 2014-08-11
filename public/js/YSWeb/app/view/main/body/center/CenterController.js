'use strict';

Ext.define('YSWeb.view.main.body.center.CenterController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.center',



    init : function () {
        this.control({
            'app-bodyCenter #productsViewContainer' : {
                afterlayout     : 'onProductsViewContainerAfterrender'
            }, 
            'app-bodyCenter #breadcrumb' : {
                boxready        : 'onBreadCrumbBoxready'
            }
        });

        this.createdPanel = null;
        this.createdPanelWidth = 0;

        this.layoutCount = 0;
    },

    onBreadCrumbBoxready : function(obj, width) {

        this.createdPanelWidth = width;
        YSDebug.log('box width', width);

        this.createListView();
    },

    onProductsViewContainerAfterrender : function() {

        
        var bodyCenter = this.view;
        var productsViewContainer = this.view.down('#productsViewContainer');

        bodyCenter.maxHeight = this.view.up('app-body').getHeight();
        productsViewContainer.maxHeight = this.view.up('app-body').getHeight() - 87;

        
    },

    onGridViewBtnRender : function(btn) {
        /*if(btn.pressed) {
            this.createGridView();
        }*/
    },

    onSegmentedBtnToggle : function(obj, btn, ispressed) {

        if(btn.text == 'Grid') {
            this.createGridView();
        } else {
            this.createListView();
        }

    },

    createGridView : function() {
        YSDebug.log('create grid vire');

        var categoryPanel  = Ext.ComponentQuery.query('#categoryPanel')[0];
        var sm = categoryPanel.getSelectionModel();

        if(this.createdPanel) {

            /*YSDebug.log('this.createdPanel.getStore', this.createdPanel.getStore());
            this.createdPanel.getStore().destroy();*/
            this.createdPanel.destroy();
            this.lookupReference('productsViewContainer').removeAll();
        }

        this.createdPanel = Ext.create('YSWeb.view.main.product.thumbnail.GridView', { panelWidth : this.createdPanelWidth });

        if(sm.hasSelection()) {
            var selection = sm.getSelection()[0];

            var store = this.createdPanel.getStore();

            store.on('beforeload', function(str, op) {
                var filter = [
                    { 
                        'table' : 'parent',
                        'field' : 'category_id',
                        'value' : selection.data.id
                    }
                ];

                op.setParams( {
                    filter: Ext.encode( filter )
                } );
            });

            store.load();
        }

        this.lookupReference('productsViewContainer').add(this.createdPanel);
    },

    createListView : function() {
        YSDebug.log('create list view');

        var categoryPanel  = Ext.ComponentQuery.query('#categoryPanel')[0];
        var sm = categoryPanel.getSelectionModel();

        if(this.createdPanel) {
                /*YSDebug.log('this.createdPanel.getStore', this.createdPanel.getStore());
                this.createdPanel.getStore().destroy();*/
            this.createdPanel.destroy();
            this.lookupReference('productsViewContainer').removeAll();
        }

        this.createdPanel = Ext.create('YSWeb.view.main.product.thumbnail.ListView', { panelWidth : this.createdPanelWidth });

        if(sm.hasSelection()) {
            var selection = sm.getSelection()[0];

            var store = this.createdPanel.getStore();

            store.on('beforeload', function(str, op) {
                var filter = [
                    { 
                        'table' : 'parent',
                        'field' : 'category_id',
                        'value' : selection.data.id
                    }
                ];

                op.setParams( {
                    filter: Ext.encode( filter )
                } );
            });

            store.load();
        }

        this.lookupReference('productsViewContainer').add(this.createdPanel);
    }
});
