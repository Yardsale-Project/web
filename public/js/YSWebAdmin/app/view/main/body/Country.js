'use strict';

Ext.define('YSWebAdmin.view.main.body.Country', {
	extend : 'Ext.grid.Panel',

	xtype 	: 'app-country',

	controller: 'country',
    viewModel: {
        type: 'country'
    },

    bind 	: {
    	title 	: '{title}'
    },

    store : 'Country',
    columnWidth : .95,

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
    			text 	: '{addCountry}'
    		},
    		handler : 'onAddCountryClick'
    	}, {
    		xtype 	: 'button',
    		bind 	: {
    			text 	: '{addCountryMultiple}'
    		},
    		handler : 'onAddCountryMultipleClick'
    	}, {
    		xtype 	: 'button',
    		bind 	: {
    			text 	: '{statesProvinces}'
    		},
    		handler : 'onStateProvinceBtnClik',
    		reference : 'statProvince',
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