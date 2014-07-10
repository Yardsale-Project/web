'use strict';

Ext.define('YSWeb.controller.Root', {
    extend: 'Ext.app.Controller',

    routes : {
    	'validate/:hash' : 	'validateUser',
    	'home'			: 'home'
    },

    home 	: function() {
    	console.log('home');
    },
    validateUser : function(hash) {
    	console.log(hash);

    	var me = this;

    	Ext.Ajax.request({
    		url 	: YSConfig.url + '/application/user/validateHash',
    		params 	: {
    			h 	: hash
    		},
    		waitMsg : 'Validating/activating user account',
    		success : me.onSuccess,
    		failure : me.onFailure
    	});
    },

    onSuccess : function(response) {

    	var rsp = Ext.JSON.decode(response.responseText);
    	console.log(rsp);
    	if(rsp.success)
    	{
    		console.log('success', rsp);
    	} else {
    		console.log('failed', rsp.success);

    		Ext.Msg.show({
				title      	: 'User Account Activation',
	           	msg        	: rsp.errorMessage,
	           	buttons    	: Ext.MessageBox.OK,
	           	icon       	: Ext.MessageBox.ERROR
	        });
    	}
    },

    onFailure : function(response) {
    	console.log('failure', response.responseText);
    }
});
