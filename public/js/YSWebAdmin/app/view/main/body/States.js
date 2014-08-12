'use strict';

Ext.define('YSWebAdmin.view.main.body.States', {
	extend : 'Ext.grid.Panel',

	xtype 	: 'app-states',

	controller: 'states',
    viewModel: {
        type: 'states'
    },

    store : 'States',
    width   : 715,
    height  : 600,

    columns 	: [
    	{
    		bind 		: {
    			text 	: '{code}'
    		},
    		dataIndex 	: 'code',
    		width 		: 102,
    		editor: {
                xtype 			: 'uppercasetextfield',
                uppercaseValue 	: true,
                allowBlank 		: false,
                vtype 			: 'countryCode',
                msgTarget 		: 'side'
            }
    	}, {
    		bind 		: {
    			text 	: '{name}'
    		},
    		dataIndex 	: 'name',
    		flex 		: 1,
    		editor: {
                xtype 		: 'textfield',
                allowBlank 	: false
            }
    	}
    ],

    selType 		: 'rowmodel',
    plugins 		: {
        ptype 		: 'rowediting',
        clicksToEdit: 2
    },
    tbar 	: [
    	{
    		xtype 	: 'textfield',
    		width 	: 200,
    		listeners : {
    			change : 'onSearchChange'
    		}
    	},{
    		xtype 	: 'button',
    		bind 	: {
    			text 	: '{addState}'
    		},
    		handler : 'onAddStateClick'
    	}, {
    		xtype 	: 'button',
    		bind 	: {
    			text 	: '{addStateMultiple}'
    		},
    		handler : 'onAddStateMultipleClick'
    	}, {
    		xtype 	: 'button',
    		bind 	: {
    			text 	: '{city}'
    		},
    		handler : 'onCitiesBtnClik',
    		reference : 'cities',
    		disabled : true
    	}, {
    		xtype 	: 'button',
    		bind 	: {
    			text 	: '{delBtn}'
    		},
    		handler : 'onDeleteBtnClik',
    		reference : 'deleteBtn',
    		disabled : true
    	}
    ]
});