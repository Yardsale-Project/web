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
        console.log('box width', width);

        this.createGridView();
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
        console.log('create grid vire');

        if(this.createdPanel) {
            this.createdPanel.destroy();
            this.lookupReference('productsViewContainer').removeAll();
        }

        this.createdPanel = Ext.create('YSWeb.view.main.product.thumbnail.GridView', { panelWidth : this.createdPanelWidth });

        this.lookupReference('productsViewContainer').add(this.createdPanel);
    },

    createListView : function() {
        console.log('create list view');

        if(this.createdPanel) {
            this.createdPanel.destroy();
            this.lookupReference('productsViewContainer').removeAll();
        }
    }
});
