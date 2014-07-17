'use strict';

Ext.define('YSCommon.view.main.login.Signin', {
	extend : 'Ext.form.Panel',
	xtype : 'app-signin',

	requires : [
		'YSCommon.validation.Validation'
	],

	controller : 'signin',

	viewModel: {
        type: 'signin'
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
            reference:'email',
    		vtype	: 'email',
    		allowBlank:false,
    		width 	: 380,
    		msgTarget : 'side'
            //value   : 'egeeboygutierrez91@gmail.com'
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
    		msgTarget : 'side'
            //value   : '!l0v3A!za143'
    	}, {
    		xtype 	: 'hiddenfield',
    		allowBlank:false,
            itemId  : 'token',
            name    : 'token',
            reference:'token',
    		value 	: ''
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