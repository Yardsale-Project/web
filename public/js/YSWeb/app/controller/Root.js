'use strict';

Ext.define('YSWeb.controller.Root', {
    extend: 'Ext.app.Controller',

    routes : {
    	'validate/:hash'    : 'validateUser',
    	'home'              : 'home',
        'pp/:type/:or'          : 'onPP',
        'home/:sns'         : {
            before          : 'onBeforeSns',
            action          : 'onSns'
        },
        'or/:id'            : 'onOrderProcess'
    },

    init    : function() {
        this.action = null;
        this.dgFlow = null;

        var me = this;

        Ext.Loader.loadScript({
            url     : 'https://www.paypalobjects.com/js/external/dg.js',
            onLoad  : function() {
                me.dgFlow = new PAYPAL.apps.DGFlow({trigger: 'submitBtn'});
                window.dgFlow = me.dgFlow;
            }
        });

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

        

        /*Ext.Loader.loadScript({ 
            url : 'https://cdn.socket.io/socket.io-1.0.6.js',
            onLoad : function() {
                Ext.create('Ext.window.Window', {
                    modal       : true,
                    layout      : 'fit',
                    closeAction : 'destroy',
                    resizable   : false,
                    minimizable : true,
                    maximizable : true,
                    title       : 'Chat',

                    items       : [
                        {
                            xtype : 'app-chat'
                        }
                    ]
                }).show();
            }
        });*/
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

    closePaypal : function() {
        dgFlow = top.dgFlow || top.opener.top.dgFlow;
        dgFlow.closeFlow();
        top.close();
    },

    loggedInCallback : function(object,rsp) {
        var accountBtn  = Ext.ComponentQuery.query('#accountBtn')[0];
        var signInBtn   = Ext.ComponentQuery.query('#signInBtn')[0];
        var orTbText    = Ext.ComponentQuery.query('#orTbText')[0];
        var registerBtn = Ext.ComponentQuery.query('#registerBtn')[0];
        var logoutToken = Ext.ComponentQuery.query('#logoutToken')[0];
        var navigation = Ext.ComponentQuery.query('#navigation')[0];


        if(rsp.email.length > 0) {
            accountBtn.setText(rsp.email);

            accountBtn.show();
            navigation.show();

            signInBtn.hide();
            orTbText.hide();
            registerBtn.hide();

            object.requestCSRFToken(object, logoutToken);
        }
        

        if(object.action) {
            object.action.resume();
        }

        UserHelper.getUserInfo(this, function(obj, response) {
            if(response.data.country_id == 0) {
                UserHelper.hasLocation = false;
                console.log('response.data.country_id false', response.data.country_id);
            } else {
                UserHelper.hasLocation = true;
                console.log('response.data.country_id true', response.data.country_id);
            }
            

            if(response.data.name.length == '') {
                UserHelper.hasPaypal = false;
            } else {
                UserHelper.hasPaypal = true;
            }
        });

        /*var getParams = document.URL.split("?");
        // transforming the GET parameters into a dictionnary

        if(getParams.length > 1) {
            var params = Ext.urlDecode(getParams[getParams.length - 1]);
            var paramIndex;

            console.log('params init', params);
            params = params.request_ids.replace('#home', '');
            params = params.split(',');

            console.log('params', params);


            for(paramIndex in params) {
                var requestId = params[paramIndex];

                FB.api(requestId, 'GET', function(response) {
                    console.log('get request', response);
                });
            }

        }*/
       
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

    onPP : function(type, or) {

        this.dgFlow = window.top.dgFlow || window.top.opener.top.dgFlow;
        this.dgFlow.closeFlow();
        alert(window.top.locaton);
        window.top.close();
        if(Paypal.ppWindow) {
            Paypal.ppWindow.destroy();
        }
        window.top.location = window.top.locaton + '/' + type + '/' + or;
        //window.locaton = window.locaton + '/' + type + '/' + or;
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
    },

    onBeforeSns    : function(sns, action) {
        this.action = action;
        YSDebug.log(action);
        UserHelper.getUserLoginStatus(this, this.loggedInCallback, this.loggedOutCallback);
    },

    onSns   : function(sns) {
        var me = this;

        if(sns == 'fbInvite') {
            FB.getLoginStatus(function(response) {
                me.statusChangeCallback(response);
            });
        }
    },

    statusChangeCallback : function(response) {

        var me = this;

        if (response.status === 'connected') {

            FB.ui({
                method: 'apprequests',
                message : 'This is a test message from Yardsale',
                title   : 'Yardsale',
                data    : 'thisisadatasample',
                link: 'http://yardsale.druidinc.com',
                filter : ['app_non_users']
            }, function(response){
              me.saveInviteResponse(response);
              me.redirectTo('home');
            });
            
        } else if (response.status === 'not_authorized') {
            // The person is logged into Facebook, but not your app.
        } else {
            // The person is not logged into Facebook, so we're not sure if
            // they are logged into this app or not.

            FB.login(
                function(response) {
                    // handle the response
                    if (response.status === 'connected') {
                        FB.ui({
                            method: 'apprequests',
                            message : 'This is a test message from Yardsale',
                            title   : 'Yardsale',
                            data    : 'thisisadatasample',
                            link: 'http://yardsale.druidinc.com',
                            filter : ['app_non_users']
                        }, function(response){
                          console.log(response);
                          me.saveInviteResponse(response);
                          me.redirectTo('home');
                        });
                    } else if (response.status === 'not_authorized') {
                        // The person is logged into Facebook, but not your app.
                    } else {
                        // The person is not logged into Facebook, so we're not sure if
                        // they are logged into this app or not.
                    }
                }, {scope: 'xmpp_login, user_friends, publish_actions'}
            );
        }
    },

    saveInviteResponse : function(response) {
        var reqId = response.request;

        Ext.Ajax.request({
            url     : YSConfig.url + '/application/sns/fbInvite',
            params  : {
                requestId : reqId
            },
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
    },

    onOrderProcess : function(id) {

    }

});
