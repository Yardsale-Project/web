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
        console.log('focus', cbo);
        cbo.expand();
    },

    onKeyUpCategory : function(cbo) {

        console.log('key up category');
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
        var searchBox   = this.lookupReference('searchBox').getValue();
        var categoryBox = this.lookupReference('categoryBox').getValue();
        var locationBox = this.lookupReference('locationBox').getValue();
        var filterSet   = [];
        var filterItem  = {};

        YSDebug.log('searchBox', searchBox);
        YSDebug.log('categoryBox', categoryBox);
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
                        "value": newValue
                    }, {
                        "table": "city",
                        "field": "name",
                        "bitOp": "LIKE",
                        "value": newValue
                    }
                ]
            };
        }
    }
});
