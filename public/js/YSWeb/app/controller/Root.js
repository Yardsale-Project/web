'use strict';

Ext.define('YSWeb.controller.Root', {
    extend: 'Ext.app.Controller',

    routes : {
    	'validate/:hash' : 	'validateUser',
    	'home'			: 'home'
    },

    home 	: function() {
    	YSDebug.log('home');
    },
    validateUser : function(hash) {
    	YSDebug.log('hashg', hash);

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
    	YSDebug.log(rsp);
    	if(rsp.success)
    	{
    		YSDebug.log('success', rsp);
    	} else {
    		YSDebug.log('failed', rsp.success);

    		Ext.Msg.show({
				title      	: 'User Account Activation',
	           	msg        	: rsp.errorMessage,
	           	buttons    	: Ext.MessageBox.OK,
	           	icon       	: Ext.MessageBox.ERROR
	        });
    	}
    },

    onFailure : function(response) {
    	YSDebug.log('failure', response.responseText);
    }
});
