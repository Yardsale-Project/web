'use strict';

Ext.define('YSWeb.view.main.setting.ClientPaypalSetting', {
	extend : 'Ext.form.Panel',
	xtype 	: 'app-clientpaypalsetting',
	cls 	: 'app-clientpaypalsetting',

	layout 	: 'column',

	viewModel: {
        type: 'clientsetting'
    },

    controller : 'clientpaypalsetting',

    width 	: 500,
    bodyPadding 	: 10,
    autoScroll : true,

	items 	: [
		{
			xtype 	    : 'hiddenfield',
			name 	    : 'id',
			value 	    : '0'
		}, {
			xtype 		: 'textfield',
			bind 		: {
				fieldLabel 	: '{ppEmail}'
			},
			columnWidth : 1,
			name 		: 'pp_email',
			vtype 		: 'email',
			msgTarget 	: 'side',
			allowBlank 	: false
		}, {
			xtype 		: 'checkboxfield',
			boxLabel 	: 'Enable SMS Payment',
			columnWidth	: 1,
			name 		: 'sms_payment_enabled',
			inputValue 	: '1',
			listeners 	: {
				change 	: 'onCheckBoxChange'
			}
		}, {
			xtype 		: 'textfield',
			bind 		: {
				fieldLabel 	: '{ppPassword}'
			},
			inputType 	: 'password',
			columnWidth	: 1,
			name 		: 'pp_password',
			reference 	: 'pppassword',
			hidden 		: true,
			allowBlank 	: true
		}
	]
});