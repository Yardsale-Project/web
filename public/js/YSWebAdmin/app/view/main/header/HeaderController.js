'use strict';

Ext.define('YSWebAdmin.view.main.header.HeaderController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.header',


    onLogoutMenuClick : function() {
        var token = this.lookupReference('logoutToken').getValue();
        var me = this;

        Ext.Ajax.request({
            url     : YSConfig.url + '/application/user/logout',
            params  : {
                token : token
            },
            success : function(response) {
                var rsp = Ext.JSON.decode(response.responseText);

                if(rsp.success)
                {
                    me.lookupReference('accountBtn').hide();
                    me.lookupReference('signInBtn').show();
                    me.lookupReference('orTbText').show();
                    me.lookupReference('registerBtn').show();
                } else {
                    Ext.Msg.show({
                        title       : 'Logout',
                        msg         : rsp.errorMessage,
                        buttons     : Ext.MessageBox.OK,
                        icon        : Ext.MessageBox.ERROR
                    });
                }
            },
            failure : function(response) {

            }
        });
    }
});
