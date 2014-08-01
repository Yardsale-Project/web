'use strict';

Ext.define('YSWeb.view.main.header.NavigationController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.navigation',

    init : function () {
        this.control({
            
        });
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
