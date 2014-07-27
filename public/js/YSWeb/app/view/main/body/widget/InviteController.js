'use strict';

Ext.define('YSWeb.view.main.body.widget.InviteController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.invite',



    init : function () {
        this.control({
        });
    },

    onFbBtnClck : function() {
        UserHelper.getUserLoginStatus(this, this.loggedInCallback, this.loggedOutCallback);
    },

    loggedInCallback : function(obj, resp) {
        FB.getLoginStatus(function(response) {
            obj.statusChangeCallback(obj, response);
        });
    },

    statusChangeCallback : function(obj, response) {
        if (response.status === 'connected') {

            FB.ui({
                method: 'apprequests',
                message : 'This is a test message from Yardsale',
                title   : 'Yardsale',
                data    : 'http://yardsale.druidinc.com',
                link: 'http://yardsale.druidinc.com',
                filter : ['app_non_users']
            }, function(response){
              console.log(response);
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
                            data    : 'http://yardsale.druidinc.com',
                            link: 'http://yardsale.druidinc.com',
                            filter : ['app_non_users']
                        }, function(response){
                          console.log(response);
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

    loggedOutCallback : function(obj, resp) {

        var me = this;

        Ext.create('Ext.window.Window', {
            modal       : true,
            resizable   : false,
            layout      : 'fit',
            closable    : false,
            closeAction : 'destroy',
            draggable   : false,
            width       : 400,
            

            title       : 'Sign in',

            items       : [
                {
                    xtype   : 'app-signin',
                    buttons     : [
                        {
                            text    : 'Login',
                            handler : 'onFbLoginBtnClick'
                        }, {
                            text    : 'Cancel',
                            handler : 'onCancelBtnClick'
                        }
                    ]
                }
            ]
        }).show();
    }
});
