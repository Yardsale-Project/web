'use strict';

Ext.define('YSWeb.view.main.body.widget.InviteController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.invite',



    init : function () {
        this.control({
            'app-widget-invite #fbButton' : {
                beforerender : 'onFbBeforeRender'
            },
            'app-widget-invite #twButton' : {
                beforerender : 'onTwBeforeRender'
            }
        });
    },

    onFbBeforeRender : function() {
        Setting.getSetting(this, 'sns', 'facebook', this.fbSettingCallback);
    },

    fbSettingCallback : function(obj, rsp) {
        var fbBtn = obj.lookupReference('fbButton');

        if(rsp.result.active == 0) {
            fbBtn.destroy();
        }
    },

    onTwBeforeRender : function() {
        Setting.getSetting(this, 'sns', 'twitter', this.twSettingCallback);
    },

    twSettingCallback : function(obj, rsp) {
        var twBtn = obj.lookupReference('twButton');

        if(rsp.result.active == 0) {
            twBtn.destroy();
        }
    },

    onFbBtnClck : function() {
        console.log('type',this.view._type);
        UserHelper.getUserLoginStatus(this, this.loggedInCallback, this.loggedOutCallback);
    },

    loggedInCallback : function(obj, resp) {

        obj.redirectTo('home/fbInvite');
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
