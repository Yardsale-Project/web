'use strict';

Ext.define('YSWeb.controller.Root', {
    extend: 'Ext.app.Controller',

    routes : {
    	'validate/:hash' : 	'validateUser',
    	'home'			: 'home'
    },

    home 	: function() {
    	YSDebug.log('home');

        var accountBtn,
            signInBtn,
            orTbText,
            registerBtn,
            logoutToken,
            me = this;

        Ext.Ajax.request({
            url     : YSConfig.url + '/application/user/getUserSessionCode',
            method  : 'POST',
            success : function(response) {

                var rsp = Ext.JSON.decode(response.responseText);
                

                accountBtn  = Ext.ComponentQuery.query('#accountBtn')[0];
                signInBtn   = Ext.ComponentQuery.query('#signInBtn')[0];
                orTbText    = Ext.ComponentQuery.query('#orTbText')[0];
                registerBtn = Ext.ComponentQuery.query('#registerBtn')[0];
                logoutToken = Ext.ComponentQuery.query('#logoutToken')[0];

                if(rsp.success)
                {
                    if( rsp.email != '') {
                        YSDebug.log('account btn', accountBtn);
                        accountBtn.setText(rsp.email);

                        accountBtn.show();

                        signInBtn.hide();
                        orTbText.hide();
                        registerBtn.hide();

                        me.requestCSRFToken(me, logoutToken);
                    }
                } else {
                    YSDebug.log('failed', rsp.success);

                    Ext.Msg.show({
                        title       : 'User Account Info',
                        msg         : rsp.errorMessage,
                        buttons     : Ext.MessageBox.OK,
                        icon        : Ext.MessageBox.ERROR
                    });
                }
            },
            failure : me.onFailure
        });
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
    },

    requestCSRFToken : function(cmp, field) {

        var me = cmp;

        Ext.Ajax.request({
            url     : YSConfig.url + '/application/user/generateToken',
            success : function(response) {
                var rsp = Ext.JSON.decode(response.responseText);

                if(rsp.success)
                {
                    YSDebug.log('success', rsp);
                    me.token = rsp.token;
                    field.setValue(rsp.token);
                }
            },
            failure : function(response) {

            }
        });
    }
});
