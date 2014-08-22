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

    onValueChange : function(cbo, newValue) {

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

            var searchFilter = {
                "op": "AND",
                "set": [
                    {
                        "field": "name",
                        "bitOp": "LIKE",
                        "value": newValue
                    }
                ]
            };

            op.setParams( {
                filter: Ext.encode( filter ),
                searchFilter: Ext.encode( searchFilter )
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
    }
});
