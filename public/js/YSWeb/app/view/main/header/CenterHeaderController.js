'use strict';

Ext.define('YSWeb.view.main.header.CenterHeaderController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.centerheader',

    init : function () {
        this.control({
            /*'app-centerheader #location' : {
                beforerender : 'onLocationBeforeRender'
            }*/
        });
    },

    onLocationBeforeRender : function() {
        var store = this.view.getStore();

        store.on('beforeload', function(str, op) {
            var filter = {
                "op": "AND",
                "set": [
                    {
                        "field": "country_id",
                        "bitOp": "EQ",
                        "value": 170
                    }
                ]
            }

            op.setParams( {
                filter: Ext.encode( filter )
            } );
        });

        store.load();
    },

    onFocus   : function(cbo) {
        cbo.expand();
    },

    onKeyUpCategory : function(cbo) {

        var newValue = cbo.getRawValue();

        cbo.setRawValue(newValue);
        cbo.getStore().on('beforeload', function(str, op) {
            var filter = {
                "op": "AND",
                "set": [
                    {
                        "table": "parent",
                        "field": "category_id",
                        "bitOp": "EQ",
                        "value": 0
                    }
                ]
            };

            if(!Ext.isEmpty(newValue)) {
                filter.set.push({
                    "table": "category",
                    "field": "name",
                    "bitOp": "LIKE",
                    "value": newValue
                });
            }

            op.setParams( {
                filter: Ext.encode( filter )
            } );
        });

        cbo.getStore().load();
    },

    onKeyUpLocation : function(cbo) {

        var newValue = cbo.getRawValue();

        cbo.setRawValue(newValue);
        cbo.getStore().on('beforeload', function(str, op) {
            var filter = {
                "op": "AND",
                "set": [
                    {
                        "field": "country_id",
                        "bitOp": "EQ",
                        "value": 170
                    }
                ]
            };

            if(!Ext.isEmpty(newValue)) {
                filter.set.push({
                    "op": "OR",
                    "set": [
                        {
                            "table": "states",
                            "field": "name",
                            "bitOp": "LIKE",
                            "value": newValue
                        }, {
                            "table": "city",
                            "field": "name",
                            "bitOp": "LIKE",
                            "value": newValue
                        }
                    ]
                });
            }

            op.setParams( {
                filter: Ext.encode( filter )
            } );
        });

        cbo.getStore().load();
    },

    onAddNewBtnClick : function() {
    	Ext.create('Ext.window.Window', {
    		modal 		: true,
    		layout 		: 'fit',
    		resizable 	: false,
    		closeAction : 'destroy',
    		title 		: 'Add New Product',

    		items 		: [
    			{
    				xtype	: 'app-product'
    			}
    		]
    	}).show();
    },

    onSearchButtonClick : function() {
        var categoryPanel   = Ext.ComponentQuery.query('#categoryPanel')[0];
        var breadcrumb   = Ext.ComponentQuery.query('#breadcrumb')[0];
        var sm = categoryPanel.getSelectionModel();
        var searchBox   = this.lookupReference('searchBox').getValue();
        var categoryBox = this.lookupReference('categoryBox').getValue();
        var categoryRawBox = this.lookupReference('categoryBox').getRawValue();
        var locationBox = this.lookupReference('locationBox').getValue();
        var filterSet   = [];
        var filterItem  = {};
        var store       = Ext.getStore('app-productStore');

        var breadcrumbItems = [
            {
                xtype   : 'tbtext',
                text    : 'Search'
            }, {
                xtype   : 'tbtext',
                text    : '>'
            }, {
                xtype   : 'tbtext',
                text    : 'All Categories'
            }
        ];

        if(categoryRawBox.length > 0) {
            breadcrumbItems[2].text = categoryRawBox;
        } else {
            breadcrumbItems[2].text = 'All Categories';
        }

        breadcrumb.removeAll();

        for(var bIndex in breadcrumbItems) {
            breadcrumb.add(breadcrumbItems[bIndex])
        }

        sm.deselectAll();

        YSDebug.log('searchBox', searchBox);
        YSDebug.log('categoryBox', typeof categoryBox);
        YSDebug.log('locationBox', locationBox);

        filterSet.push({
            "table": "user",
            "field": "country",
            "bitOp": "EQ",
            "value": 170
        });

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
});
