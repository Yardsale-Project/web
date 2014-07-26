'use strict';

Ext.define('YSWeb.controller.Root', {
    extend: 'Ext.app.Controller',

    routes : {
    	'validate/:hash' : 	'validateUser',
    	'home'			: 'home'
    },

    init    : function() {
        this.action = null;

        window.fbAsyncInit = function() {
            FB.init(
                {
                    appId      : '266620273529963',
                    xfbml      : false,
                    status     : true,
                    version    : 'v2.0',
                    redirect_uri    : 'http://yardsale.druidinc.com/' 
                }
            );
        };

        (   
            function(d, s, id) {
                var js, 
                    fjs = d.getElementsByTagName(s)[0];
         
                if ( d.getElementById(id) ) {
                    return;
                }
         
                js      = d.createElement(s); 
                js.id   = id;
                js.src  = "//connect.facebook.net/en_US/sdk.js";
                fjs.parentNode.insertBefore(js, fjs);
            }   (document, 'script', 'facebook-jssdk')
        );
    },

    home 	: function() {
    	YSDebug.log('home');

        var accountBtn,
            signInBtn,
            orTbText,
            registerBtn,
            logoutToken,
            me = this;

        UserHelper.getUserLoginStatus(this, this.loggedInCallback, this.loggedOutCallback);
    },

    loggedInCallback : function(object,rsp) {
        var accountBtn  = Ext.ComponentQuery.query('#accountBtn')[0];
        var signInBtn   = Ext.ComponentQuery.query('#signInBtn')[0];
        var orTbText    = Ext.ComponentQuery.query('#orTbText')[0];
        var registerBtn = Ext.ComponentQuery.query('#registerBtn')[0];
        var logoutToken = Ext.ComponentQuery.query('#logoutToken')[0];


        accountBtn.setText(rsp.email);

        accountBtn.show();

        signInBtn.hide();
        orTbText.hide();
        registerBtn.hide();

        object.requestCSRFToken(object, logoutToken);

        if(object.action) {
            object.action.resume();
        }
    },

    loggedOutCallback : function(object,rsp) {
        YSDebug.log('not logged in');
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

            Ext.create('Ext.window.Window', {
                modal       : true,
                resizable   : false,
                layout      : 'fit',
                closeAction : 'destroy',
                width       : 400,

                title       : 'Account activated. Please log in to continue',

                items       : [
                    {
                        xtype   : 'app-signin'
                    }
                ]
            }).show();
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

    /*onBeforeSmsInvite : function(sms, action) {
        this.action = action;
        YSDebug.log('before sms');
        // separating the GET parameters from the current URL

        if(document.URL.indexOf("?") >= 0){
            var getParams = document.URL.split("?");
            // transforming the GET parameters into a dictionnary
            var params = Ext.urlDecode(getParams[getParams.length - 1]);
            var state = params.state;
            state = state.split('#');
            params.state = state[0];
            YSDebug.log('params', params);
        }
        
        UserHelper.getUserLoginStatus(this, this.loggedInCallback, this.loggedOutSmsCallback);
    },

    onSmsInvite : function(sms) {
        YSDebug.log('on sms');
        var params = {};
        var me = this;

        // separating the GET parameters from the current URL
        if(document.URL.indexOf("?") >= 0){
            var getParams = document.URL.split("?");
            // transforming the GET parameters into a dictionnary
            params = Ext.urlDecode(getParams[getParams.length - 1]);
            var state = params.state;
            state = state.split('#');
            params.state = state[0];
            YSDebug.log('params', params);
        }

        if(!Object.keys(params).length) {
            Ext.create('Ext.window.Window', {
                modal       : true,
                resizable   : false,
                layout      : 'fit',
                closable    : false,
                closeAction : 'destroy',
                draggable   : false,
                width       : 400,
                

                title       : 'Message',

                items       : [
                    {
                        xtype   : 'form',
                        layout  : 'form',
                        items   : [
                            {
                                xtype   : 'textareafield',
                                fieldLabel : 'Write message',
                                name    : 'custom_message',
                                allowBlank : false,
                                height  : 200
                            }
                        ],
                        buttons     : [
                            {
                                text    : 'Send',
                                handler : function(btn) {

                                    var form = btn.up('form').getForm();

                                    if(form.isValid()) {
                                        if(sms == 'fb') {
                                            form.submit({
                                                url     : YSConfig.url + '/application/facebook/fbInvite',
                                                waitMsg : 'Sending message...',
                                                method  : 'GET',
                                                params  : params,
                                                success : function(frm, action) {

                                                    window.location = action.result.loginUrl;

                                                },
                                                failure : function(frm, action) {
                                                    Ext.Msg.show({
                                                        title       : 'Invite friends',
                                                        msg         : action.result.errorMessage,
                                                        buttons     : Ext.MessageBox.OK,
                                                        fn          : function(btn) {
                                                            if(btn === 'ok') {
                                                                form.reset();
                                                            }
                                                        }, 
                                                        icon        : Ext.MessageBox.ERROR
                                                    });
                                                }
                                            });
                                        }
                                    }

                                    YSDebug.log('form', form);
                                    
                                }
                            }, {
                                text    : 'Cancel',
                                handler : function() {
                                    this.up('window').close();
                                }
                            }
                        ]
                    }
                ]
            }).show();
        } else {
            if(sms == 'fb') {
                Ext.Ajax.request({
                    url     : YSConfig.url + '/application/facebook/fbInvite',
                    method  : 'GET',
                    params  : params,
                    success : function(response) {
                        var rsp = Ext.JSON.decode(response.responseText);
                        console.log('response', rsp);
                        if(rsp.success) {
                            if(rsp.hasOwnProperty('loginUrl')) {
                                window.location = rsp.loginUrl;
                            }

                            if(rsp.hasOwnProperty('loggedIn')) {
                                
                            }
                        } else {
                            window.location = YSConfig.url + '#home';
                        }

                    },
                    failure : function(response) {

                    }
                });
            }
        }
    },

    */

});
