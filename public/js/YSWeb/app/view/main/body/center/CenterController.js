'use strict';

Ext.define('YSWeb.view.main.body.center.CenterController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.center',


    init : function () {
        this.control({
            'app-bodyCenter #productsViewContainer' : {
                afterlayout     : 'onProductsViewContainerAfterrender'
            }
        });

        this.createdPanel = null;
    },

    onProductsViewContainerAfterrender : function() {

        var bodyCenter = this.view;
        var productsViewContainer = this.view.down('#productsViewContainer');

        bodyCenter.maxHeight = this.view.up('app-body').getHeight();
        productsViewContainer.maxHeight = this.view.up('app-body').getHeight() - 87;

    },

    onGridViewBtnRender : function(btn) {
        if(btn.pressed) {
            this.createGridView();
        }
    },

    onSegmentedBtnToggle : function(obj, btn, ispressed) {

        if(btn.text == 'Grid') {
            this.createGridView();
        } else {
            this.createListView();
        }

    },

    createGridView : function() {
        var me = this;
        console.log('create grid view', me.lookupReference('productsViewContainer'));

        if(this.createdPanel) {
            this.createdPanel.destroy();
            me.lookupReference('productsViewContainer').removeAll();
        }

        this.createdPanel = Ext.create('YSWeb.view.main.product.thumbnail.GridView');

        me.lookupReference('productsViewContainer').add(this.createdPanel);
    },

    createListView : function() {
        console.log('create list view');

        if(this.createdPanel) {
            this.createdPanel.destroy();
            me.lookupReference('productsViewContainer').removeAll();
        }
    }
});
