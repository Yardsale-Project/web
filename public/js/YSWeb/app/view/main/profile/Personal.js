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
            store 		: {
                type	: 'states'
            },
            bind 		: {
				fieldLabel 	: '{country}'
			},
			name 		: 'country',
            reference   : 'states',
            displayField: 'state',
            valueField  : 'abbr',
            filterPickList: true,
            queryMode   : 'local',
            multiSelect : false
        }
	]
});