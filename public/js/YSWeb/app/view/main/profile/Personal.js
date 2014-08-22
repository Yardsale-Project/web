'use strict'

Ext.define('YSWeb.view.main.profile.Personal', {
	extend : 'Ext.form.Panel',
	xtype 	: 'app-personal',
	layout 	: 'form',

	bind 	: {
		title 	: '{title}'
	},

	viewModel: {
        type: 'personal'
    },

    controller : 'personal',

	items 	: [
		{
			xtype 		: 'hiddenfield',
			name 		: 'user_id'
		}, {
			xtype 		: 'textfield',
			bind 		: {
				fieldLabel 	: '{firstname}'
			},
			name 		: 'firstname',
			allowBlank 	: false
		}, {
			xtype 		: 'textfield',
			bind 		: {
				fieldLabel 	: '{middlename}'
			},
			name 		: 'middlename',
			allowBlank 	: true
		}, {
			xtype 		: 'textfield',
			bind 		: {
				fieldLabel 	: '{lastname}'
			},
			name 		: 'lastname',
			allowBlank 	: false
		}, {
			xtype 		: 'textfield',
			bind 		: {
				fieldLabel 	: '{telephone}'
			},
			name 		: 'telephone',
			allowBlank 	: true
		}, {
			xtype 		: 'textfield',
			bind 		: {
				fieldLabel 	: '{mobile}'
			},
			name 		: 'mobile',
			allowBlank 	: false,
			vtype 		: 'mobile'
		}, {
			xtype 		: 'textfield',
			bind 		: {
				fieldLabel 	: '{address1}'
			},
			name 		: 'address1',
			allowBlank 	: false
		}, {
			xtype 		: 'textfield',
			bind 		: {
				fieldLabel 	: '{address2}'
			},
			name 		: 'address2',
			allowBlank 	: true
		}, {
            xtype   	: 'combobox',
            store 		: 'Country',
            bind 		: {
				fieldLabel 	: '{country}'
			},
			name 		: 'country',
            reference   : 'country',
            displayField: 'name',
            valueField  : 'id',
            queryMode   : 'remote',
            queryDelay 	: 10,
            multiSelect : false,
            allowBlank 	: false,
            listeners 	: {
            	select 	: 'onCountrySelect',
            	change 	: 'onValueChange'
            }
        }, {
            xtype   	: 'combobox',
            store 		: 'States',
            bind 		: {
				fieldLabel 	: '{states}'
			},
			name 		: 'state',
            reference   : 'state',
            displayField: 'name',
            valueField  : 'id',
            queryMode   : 'remote',
            queryDelay 	: 10,
            multiSelect : false,
            disabled 	: true,
            allowBlank 	: false,
            listeners 	: {
            	select 	: 'onStateSelect',
            	change 	: 'onValueChange'
            }
        }, {
            xtype   	: 'combobox',
            store 		: 'City',
            bind 		: {
				fieldLabel 	: '{city}'
			},
			name 		: 'city',
            reference   : 'city',
            displayField: 'name',
            valueField  : 'id',
            queryMode   : 'remote',
            queryDelay 	: 10,
            multiSelect : false,
            allowBlank 	: false,
            disabled 	: true,
            listeners 	: {
            	change 	: 'onValueChange'
            }
        }
	]
});