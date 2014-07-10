'use strict';

Ext.define('YSWeb.view.main.login.Register', {
	extend : 'Ext.form.Panel',
	xtype : 'app-register',

	requires : [
		'YSCommon.validation.Validation'
	],

	controller : 'register',

	viewModel: {
        type: 'register'
    },

    bodyPadding : 10,

    layout : 'form',


    items 	: [
    	{
    		xtype 	: 'textfield',
    		bind 	: {
    			fieldLabel : '{email}'
    		},
    		name 	: 'email',
    		vtype	: 'email',
    		allowBlank:false,
    		width 	: 380,
    		msgTarget : 'side',
    		value 	: 'admin@admin.com'
    	}, {
    		xtype 	: 'textfield',
    		inputType : 'password',
    		bind 	: {
    			fieldLabel : '{password}'
    		},
    		allowBlank:false,
    		name 	: 'password',
    		vtype 	: 'password',
    		width 	: 380,
    		margin 	: '8 0 0 0',
    		msgTarget : 'side',
    		value 	: '!l0v3A!za143'
    	}, {
    		xtype 	: 'textfield',
    		inputType : 'password',
    		bind 	: {
    			fieldLabel : '{confirmPassword}'
    		},
    		allowBlank:false,
    		width 	: 380,
    		msgTarget : 'side',
    		value 	: '!l0v3A!za143',
    		validator: function(value) {
	            var password1 = this.previousSibling('[name=password]');

	            return (value === password1.getValue()) ? true : 'Passwords do not match.'
	        }
    	}
    ],

    buttons 	: [
    	{
    		bind  	: {
    			text 	: '{submit}'
    		},
    		handler : 'onSubmitBtnClick'
    	}, {
    		bind  	: {
    			text 	: '{cancel}'
    		},
    		handler : 'onCancelBtnClick'
    	}
    ]
});