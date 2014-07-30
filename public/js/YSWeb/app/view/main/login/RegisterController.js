'use strict';

Ext.define('YSWeb.view.main.login.RegisterController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.register',

    init : function() {
    	this._me = this;
    },

    onSubmitBtnClick : function() {
    	var me = this;
    	var form = me.view.getForm();
    	var params = null;

    	if( form.isValid()) {

    		var getParams = document.URL.split("?");
		    // transforming the GET parameters into a dictionnary

		    if(getParams.length > 1) {
		        params = Ext.urlDecode(getParams[getParams.length - 1]);

		        console.log('params init', params);
		        params = params.request_ids.replace('#home', '');

		    }
    		form.submit({
    			url 	: YSConfig.url + '/application/user/registerUser',
    			waitMsg : 'Registering new user...',
    			params 	: {
    				uriParams : params
    			},
    			success : function( frm, action ) {
			    	Ext.Msg.show({
						title      	: 'Register User',
			           	msg        	: action.result.message,
			           	buttons    	: Ext.MessageBox.OK,
			           	fn 			: function(btn) {
			           		if(btn === 'ok') {

			           			var uriParams = params.split(',');
			           			var paramsIndex = 0;

			           			if(uriParams.length > 0) {
			           				FB.getLoginStatus(function(response) {

								        if (response.status === 'connected') {

								            for(paramsIndex in uriParams) {
						           				FB.api(uriParams[paramsIndex], 'delete', function(response) {
												    console.log('delete response',response);
												});
						           			}
								            
								        } else if (response.status === 'not_authorized') {
								            // The person is logged into Facebook, but not your app.
								        } else {
								            // The person is not logged into Facebook, so we're not sure if
								            // they are logged into this app or not.

								            FB.login(
								                function(response) {
								                    // handle the response
								                    if (response.status === 'connected') {
								                        for(paramsIndex in uriParams) {
									           				FB.api(uriParams[paramsIndex], 'delete', function(response) {
															    console.log('delete response',response);
															});
									           			}
								                    } else if (response.status === 'not_authorized') {
								                        // The person is logged into Facebook, but not your app.
								                    } else {
								                        // The person is not logged into Facebook, so we're not sure if
								                        // they are logged into this app or not.
								                    }
								                }, {scope: 'xmpp_login, user_friends, publish_actions'}
								            );
								        }
						            });
			           			}

			           			form.reset();
			    				me.view.up('window').close();
			           		}
			           	},
			           	icon       	: Ext.MessageBox.INFO
			        });
			    },
    			failure : function( frm, action ) {
			    	Ext.Msg.show({
						title      	: 'Register User',
			           	msg        	: action.result.errorMessage,
			           	buttons    	: Ext.MessageBox.OK,
			           	fn 			: function(btn) {
			           		if(btn === 'ok') {
			           			form.reset();
			           		}
			           	}, 
			           	icon       	: Ext.MessageBox.ERROR
			        });
			    }
    		});
    	}
    },

    onCancelBtnClick : function() {
    	this.view.up('window').close();	
    }
});
