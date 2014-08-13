'use strict';

Ext.define('YSWebAdmin.view.main.body.City', {
	extend : 'Ext.grid.Panel',

	xtype 	: 'app-city',

	controller: 'city',
    viewModel: {
        type: 'city'
    },

    store : 'City',
    width   : 715,
    height  : 600,

    columns 	: [
        {
            bind        : {
                text    : '{code}'
            },
            dataIndex   : 'code',
            width       : 102,
            editor: {
                xtype           : 'uppercasetextfield',
                uppercaseValue  : true,
                allowBlank      : true,
                vtype           : 'countryCode',
                msgTarget       : 'side'
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
    		handler : 'onAddCityClick'
    	}, {
    		xtype 	: 'button',
    		bind 	: {
    			text 	: '{addStateMultiple}'
    		},
    		handler : 'onAddCityMultipleClick'
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