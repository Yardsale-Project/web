'use strict';

Ext.define('YSWeb.view.main.header.AccountHeaderController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.accountheader',

    onClickRegisterBtn : function() {
        Ext.create('Ext.window.Window', {
            modal       : true,
            resizable   : false,
            layout      : 'fit',
            closeAction : 'destroy',
            width       : 400,

            title       : 'Register New User',

            items       : [
                {
                    xtype   : 'app-register'
                }
            ]
        }).show();
    }
});
