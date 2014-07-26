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
        //obj.redirectTo('home/fb');
        FB.api('/me/taggable_friends', 'GET', me.fbFriendsCallback);
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
