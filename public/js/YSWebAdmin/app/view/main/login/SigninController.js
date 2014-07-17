'use strict';

Ext.define('YSWebAdmin.view.main.login.SigninController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.signin-admin',

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


    onSubmitBtnClick : function() {
        var me = this;
        var form = me.view.getForm();

        if( form.isValid()) {
            form.submit({
                url     : YSConfig.url + '/application/user/loginUser',
                waitMsg : 'Logging in...',
                success : function( frm, action ) {
                    
                    form.reset();
                    me.view.up('window').close();

                    YSDebug.log('url', window.location.href);
                    window.location.reload();
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
    }
});
