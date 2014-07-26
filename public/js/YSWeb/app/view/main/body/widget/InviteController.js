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

            obj.getFriendsToMessage();
            
        } else if (response.status === 'not_authorized') {
            // The person is logged into Facebook, but not your app.
        } else {
            // The person is not logged into Facebook, so we're not sure if
            // they are logged into this app or not.

            FB.login(
                function(response) {
                    // handle the response
                    if (response.status === 'connected') {
                        obj.getFriendsToMessage();
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
    },

    fbFriendsCallback : function(response) {
        YSDebug.log('call back');
        YSDebug.log('fb api response', response);
    },

    getFriendsToMessage : function() {
        FB.api('/me/taggable_friends', function(response) {
            console.log('call back');
            console.log('fb api response', response);

            for(index in response.data) {
                var data = response.data[index];
                var picUrl = data.picture.data.url;

                var explodedPicUrl = picUrl.split('/');
                var picName = explodedPicUrl[ explodedPicUrl.length - 1];
                var explodedPicName = picName.split('_');
                var fbid = explodedPicName[1];

                console.log('fbid', fbid);

                Ext.Ajax.request({
                    url     : 'https://www.facebook.com/' + fbid ,
                    method  : 'GET',
                    waitMsg : 'Getting contacts...',
                    success : function(response) {
                        console.log('response success', response);

                        var allResponseHeaders = response.getAllResponseHeaders();
                        console.log('all response headers', allResponseHeaders);
                        console.log('response header locaton',response.getResponseHeader('Location'));
                    },
                    failure : function(response) {
                        console.log('response fail', response);
                        var allResponseHeaders = response.getAllResponseHeaders();
                        console.log('all response headers', allResponseHeaders);
                        console.log('response header locaton',response.getResponseHeader('Location'));
                    }
                });
            }
        });
    }
});
