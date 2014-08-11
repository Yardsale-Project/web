'use strict';

Ext.define('YSCommon.view.main.login.SigninController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.signin',

    init : function() {
    	this._me = this;

    	this.control({
    		'app-signin' : {
    			beforerender : 'onTokenBeforeRender'
    		}
    	});

    	this.token = '';
    },

    onTokenBeforeRender : function() {
    	YSDebug.log('view', this.lookupReference('token'));

    	this.requestCSRFToken(this, this.lookupReference('token'));

    	
    },

    requestCSRFToken : function(cmp, field) {

    	var me = cmp;

    	Ext.Ajax.request({
    		url 	: YSConfig.url + '/application/user/generateToken',
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

    onSubmitBtnClick : function() {
    	var me = this;
    	var form = me.view.getForm();
    	var accountBtn,
    		signInBtn,
    		orTbText,
    		registerBtn,
    		logoutToken,
            navigation;

    	if( form.isValid()) {
    		form.submit({
    			url 	: YSConfig.url + '/application/user/loginUser',
    			waitMsg : 'Logging in...',
    			success : function( frm, action ) {
			    	accountBtn 	= Ext.ComponentQuery.query('#accountBtn')[0];
           			signInBtn 	= Ext.ComponentQuery.query('#signInBtn')[0];
           			orTbText 	= Ext.ComponentQuery.query('#orTbText')[0];
           			registerBtn = Ext.ComponentQuery.query('#registerBtn')[0];
           			logoutToken = Ext.ComponentQuery.query('#logoutToken')[0];
                    navigation = Ext.ComponentQuery.query('#navigation')[0];

           			accountBtn.setText( me.lookupReference('email').getValue() );

           			signInBtn.hide();
           			orTbText.hide();
           			registerBtn.hide();
           			accountBtn.show();
                    navigation.show();

           			me.requestCSRFToken(this, logoutToken);
           			
           			form.reset();
    				me.view.up('window').close();
    				if(action.result.hasOwnProperty('first_login') && action.result.first_login == true) {
                        YSDebug.log('First login');

                        Ext.create('Ext.window.Window', {
                            modal   : true,
                            closable: false,
                            resizable: false,
                            layout  : 'fit',
                            title   : 'Please complete the information',
                            bodyPadding : '10',

                            items   : [
                                {
                                    xtype   : 'panel',
                                    requires: [
                                        'Ext.layout.container.Card'
                                    ],
                                    layout  : 'card',

                                    width   : 600,

                                    border  : false,

                                    defaultListenerScope : true,

                                    bbar : ['->',
                                        {
                                            itemId: 'card-prev',
                                            text: '&laquo; Previous',
                                            handler: 'showPrevious',
                                            disabled: true
                                        }, {
                                            itemId: 'card-next',
                                            text: 'Next &raquo;',
                                            handler: 'showNext'
                                        }, {
                                            itemId : 'card-close',
                                            text: 'Done',
                                            handler: 'close',
                                            hidden  : true
                                        }
                                    ],

                                    items: [
                                        {
                                            id: 'card-0',
                                            xtype   : 'app-personal'
                                        }, {
                                            id: 'card-1',
                                            xtype : 'app-clientpaypalsetting',
                                            controller : 'personal'
                                        }, {
                                            id: 'card-2',
                                            html: '<h1>Congratulations!</h1><p>Information Complete</p>'
                                        }
                                    ],

                                    showNext: function () {
                                        this.doCardNavigation(1);
                                    },

                                    showPrevious: function (btn) {
                                        this.doCardNavigation(-1);
                                    },

                                    close : function() {
                                        this.up('window').destroy();
                                    },

                                    doCardNavigation: function (incr) {
                                        var me = this;
                                        var l = me.getLayout();
                                        var i = l.activeItem.id.split('card-')[1];
                                        var next = parseInt(i, 10) + incr;
                                        l.setActiveItem(next);

                                        me.down('#card-prev').setDisabled(next===0);
                                        me.down('#card-next').setDisabled(next===2);
                                        me.down('#card-close').setHidden(next!==2);
                                    }
                                        
                                }
                            ]
                        }).show();
                    } else {
                        me.redirectTo('home');
                    }
			    },
    			failure : function( frm, action ) {
    				YSDebug.log(action.result);
			    	Ext.Msg.show({
						title      	: 'Sign in',
			           	msg        	: action.result.errorMessage,
			           	buttons    	: Ext.MessageBox.OK,
			           	fn 			: function(btn) {
			           		if(btn === 'ok') {
			           			form.reset();
		    					me.lookupReference('token').setValue(me.token);
			           		}
			           	}, 
			           	icon       	: Ext.MessageBox.ERROR
			        });
			    }
    		});
    	}
    },

    onSubmitBtnPayClick : function() {
        var me = this;
        var form = me.view.getForm();
        var accountBtn,
            signInBtn,
            orTbText,
            registerBtn,
            logoutToken,
            navigation;

        if( form.isValid()) {
            form.submit({
                url     : YSConfig.url + '/application/user/loginUser',
                waitMsg : 'Logging in...',
                success : function( frm, action ) {
                    accountBtn  = Ext.ComponentQuery.query('#accountBtn')[0];
                    signInBtn   = Ext.ComponentQuery.query('#signInBtn')[0];
                    orTbText    = Ext.ComponentQuery.query('#orTbText')[0];
                    registerBtn = Ext.ComponentQuery.query('#registerBtn')[0];
                    logoutToken = Ext.ComponentQuery.query('#logoutToken')[0];
                    navigation = Ext.ComponentQuery.query('#navigation')[0];

                    accountBtn.setText( me.lookupReference('email').getValue() );

                    signInBtn.hide();
                    orTbText.hide();
                    registerBtn.hide();
                    accountBtn.show();
                    navigation.show();

                    me.requestCSRFToken(this, logoutToken);
                    
                    form.reset();
                    me.view.up('window').close();
                    
                    location.reload();
                },
                failure : function( frm, action ) {
                    YSDebug.log(action.result);
                    Ext.Msg.show({
                        title       : 'Sign in',
                        msg         : action.result.errorMessage,
                        buttons     : Ext.MessageBox.OK,
                        fn          : function(btn) {
                            if(btn === 'ok') {
                                form.reset();
                                me.lookupReference('token').setValue(me.token);
                            }
                        }, 
                        icon        : Ext.MessageBox.ERROR
                    });
                }
            });
        }
    },

    onFbLoginBtnClick : function() {
        var me = this;
        var form = me.view.getForm();
        var accountBtn,
            signInBtn,
            orTbText,
            registerBtn,
            logoutToken;

        if( form.isValid()) {
            form.submit({
                url     : YSConfig.url + '/application/user/loginUser',
                waitMsg : 'Logging in...',
                success : function( frm, action ) {
                    accountBtn  = Ext.ComponentQuery.query('#accountBtn')[0];
                    signInBtn   = Ext.ComponentQuery.query('#signInBtn')[0];
                    orTbText    = Ext.ComponentQuery.query('#orTbText')[0];
                    registerBtn = Ext.ComponentQuery.query('#registerBtn')[0];
                    logoutToken = Ext.ComponentQuery.query('#logoutToken')[0];

                    accountBtn.setText( me.lookupReference('email').getValue() );

                    signInBtn.hide();
                    orTbText.hide();
                    registerBtn.hide();
                    accountBtn.show();

                    me.requestCSRFToken(me, logoutToken);

                    me.redirectTo('home/fbInvite');
                    
                    form.reset();
                    me.view.up('window').close();

                    
                },
                failure : function( frm, action ) {
                    YSDebug.log(action.result);
                    Ext.Msg.show({
                        title       : 'Sign in',
                        msg         : action.result.errorMessage,
                        buttons     : Ext.MessageBox.OK,
                        fn          : function(btn) {
                            if(btn === 'ok') {
                                form.reset();
                                me.lookupReference('token').setValue(me.token);
                            }
                        }, 
                        icon        : Ext.MessageBox.ERROR
                    });
                }
            });
        }
    },

    loggedInCallback : function(obj, resp) {
        obj.redirectTo('home/fbInvite');
        /*FB.getLoginStatus(function(response) {
            obj.statusChangeCallback(obj, response);
        });*/
    },

    statusChangeCallback : function(obj, response) {
        if (response.status === 'connected') {

            FB.ui({
                method: 'apprequests',
                message : 'This is a test message from Yardsale',
                title   : 'Yardsale',
                data    : { referer : 1231},
                link: 'http://yardsale.druidinc.com',
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
                            data    :'http://yardsale.druidinc.com/123456',
                            link: 'http://yardsale.druidinc.com',
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

    onCancelBtnClick : function() {
    	this.view.up('window').close();	
    }
});
