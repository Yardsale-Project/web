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
        YSDebug.log('create grid vire');

        var categoryPanel   = Ext.ComponentQuery.query('#categoryPanel')[0];
        var searchBox       = Ext.ComponentQuery.query('#searchBox')[0].getValue();
        var categoryBox     = Ext.ComponentQuery.query('#categoryBox')[0].getValue();
        var locationBox     = Ext.ComponentQuery.query('#locationBox')[0].getValue();
        var sm = categoryPanel.getSelectionModel();

        var filterSet   = [];
        var filterItem  = {};


        if(this.createdPanel) {

            /*YSDebug.log('this.createdPanel.getStore', this.createdPanel.getStore());
            this.createdPanel.getStore().destroy();*/
            this.createdPanel.destroy();
            this.lookupReference('productsViewContainer').removeAll();
        }

        this.createdPanel = Ext.create('YSWeb.view.main.product.thumbnail.GridView', { panelWidth : this.createdPanelWidth });

        var store       = Ext.getStore('app-productStore');

        filterSet.push({
            "table": "user",
            "field": "country",
            "bitOp": "EQ",
            "value": 170
        });

        if(sm.hasSelection()) {
            var selection = sm.getSelection()[0];

            

            store.on('beforeload', function(str, op) {

                var filter = {
                    'op': 'AND',
                    'set': [
                        {
                            'table': 'parent',
                            'field': 'category_id',
                            'bitOp': 'EQ',
                            'value': selection.data.id
                        },
                    ]
                };

                op.setParams( {
                    filter: Ext.encode( filter )
                } );
            });

            store.load();
        } else {
            if(searchBox.length > 0) {
                filterItem = {
                    "op": "OR",
                    "set": [
                        {
                            "table": "product",
                            "field": "name",
                            "bitOp": "LIKE",
                            "value": searchBox
                        }, {
                            "table": "product",
                            "field": "short_description",
                            "bitOp": "LIKE",
                            "value": searchBox
                        }, {
                            "table": "product",
                            "field": "description",
                            "bitOp": "LIKE",
                            "value": searchBox
                        }
                    ]
                };

                filterSet.push(filterItem);
            }

            if( typeof categoryBox != 'undefined' && categoryBox.length > 0 && categoryBox > 0) {
                filterItem = {
                    "table": "parent",
                    "field": "category_id",
                    "bitOp": "EQ",
                    "value": categoryBox
                };

                filterSet.push(filterItem);
            }

            if( typeof locationBox != 'undefined' && locationBox.length > 0 && locationBox != 0) {
                var loc = locationBox.split('_');

                if(loc[0] == 's') {
                    filterItem = {
                        "table": "user",
                        "field": "state",
                        "bitOp": "EQ",
                        "value": loc[1]
                    };
                } else if(loc[0] == 'c') {
                    filterItem = {
                        "table": "user",
                        "field": "city",
                        "bitOp": "EQ",
                        "value": loc[1]
                    };
                }
                

                filterSet.push(filterItem);
            }

            store.on('beforeload', function(str, op) {
                var filter = {
                    "op": "AND",
                    "set": filterSet
                };
                
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
        var searchBox       = Ext.ComponentQuery.query('#searchBox')[0].getValue();
        var categoryBox     = Ext.ComponentQuery.query('#categoryBox')[0].getValue();
        var locationBox     = Ext.ComponentQuery.query('#locationBox')[0].getValue();
        var sm = categoryPanel.getSelectionModel();

        var filterSet   = [];
        var filterItem  = {};

        if(this.createdPanel) {
                /*YSDebug.log('this.createdPanel.getStore', this.createdPanel.getStore());
                this.createdPanel.getStore().destroy();*/
            this.createdPanel.destroy();
            this.lookupReference('productsViewContainer').removeAll();
        }

        this.createdPanel = Ext.create('YSWeb.view.main.product.thumbnail.ListView', { panelWidth : this.createdPanelWidth });

        var store       = Ext.getStore('app-productStore');

        filterSet.push({
            "table": "user",
            "field": "country",
            "bitOp": "EQ",
            "value": 170
        });

        if(sm.hasSelection()) {
            var selection = sm.getSelection()[0];

            YSDebug.log('selection', selection);

            var store = this.createdPanel.getStore();

            store.on('beforeload', function(str, op) {
                var filter = {
                    'op': 'AND',
                    'set': [
                        {
                            'table': 'parent',
                            'field': 'category_id',
                            'bitOp': 'EQ',
                            'value': selection.data.id
                        },
                    ]
                };

                op.setParams( {
                    filter: Ext.encode( filter )
                } );
            });

            store.load();
        } else {
            if(searchBox.length > 0) {
                filterItem = {
                    "op": "OR",
                    "set": [
                        {
                            "table": "product",
                            "field": "name",
                            "bitOp": "LIKE",
                            "value": searchBox
                        }, {
                            "table": "product",
                            "field": "short_description",
                            "bitOp": "LIKE",
                            "value": searchBox
                        }, {
                            "table": "product",
                            "field": "description",
                            "bitOp": "LIKE",
                            "value": searchBox
                        }
                    ]
                };

                filterSet.push(filterItem);
            }

            if( typeof categoryBox != 'undefined' && categoryBox.length > 0 && categoryBox > 0) {
                filterItem = {
                    "table": "parent",
                    "field": "category_id",
                    "bitOp": "EQ",
                    "value": categoryBox
                };

                filterSet.push(filterItem);
            }

            if( typeof locationBox != 'undefined' && locationBox.length > 0 && locationBox != 0) {
                var loc = locationBox.split('_');

                if(loc[0] == 's') {
                    filterItem = {
                        "table": "user",
                        "field": "state",
                        "bitOp": "EQ",
                        "value": loc[1]
                    };
                } else if(loc[0] == 'c') {
                    filterItem = {
                        "table": "user",
                        "field": "city",
                        "bitOp": "EQ",
                        "value": loc[1]
                    };
                }
                

                filterSet.push(filterItem);
            }

            store.on('beforeload', function(str, op) {
                var filter = {
                    "op": "AND",
                    "set": filterSet
                };
                
                op.setParams( {
                    filter: Ext.encode( filter )
                } );
            });

            store.load();
        }

        this.lookupReference('productsViewContainer').add(this.createdPanel);
    }
});
