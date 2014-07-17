/**
 * The main application controller. This is a good place to handle things like routes.
 */
Ext.define('YSWebAdmin.controller.Root', {
    extend: 'Ext.app.Controller',

    routes : {
    	'home'			: 'home'
    },

    home 	: function() {
    	YSDebug.log('home');

        var me = this,
        	header = Ext.ComponentQuery.query('#app-header')[0];

        YSDebug.log('header', header);

        Ext.Ajax.request({
            url     : YSConfig.url + '/application/user/getUserSessionCode',
            method  : 'POST',
            success : function(response) {

                var rsp = Ext.JSON.decode(response.responseText);
                var logoutToken = Ext.ComponentQuery.query('#logoutToken')[0];
                var accountBtn  = Ext.ComponentQuery.query('#accountBtn')[0];

                if(rsp.success)
                {
                    if( rsp.email != '') {
                        YSDebug.log('logged in');

                        accountBtn.setText(rsp.email);
                        me.requestCSRFToken(me, logoutToken);
                    } else {
                    	header.destroy();

                    	Ext.create('Ext.window.Window', {
				            modal       : true,
				            resizable   : false,
				            layout      : 'fit',
				            closable 	: false,
				            draggable 	: false,
				            width       : 400,

				            title       : 'Sign in',

				            items       : [
				                {
				                    xtype   : 'app-signin-admin'
				                }
				            ]
				        }).show();
                    }
                } else {
                    YSDebug.log('failed', rsp.success);

                    Ext.Msg.show({
                        title       : 'User Account Info',
                        msg         : rsp.errorMessage,
                        buttons     : Ext.MessageBox.OK,
                        icon        : Ext.MessageBox.ERROR
                    });
                }
            },
            failure : me.onFailure
        });
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
});
