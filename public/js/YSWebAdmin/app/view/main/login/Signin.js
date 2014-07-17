'use strict';

Ext.define('YSWebAdmin.view.main.login.Signin', {
	extend  : 'YSCommon.view.main.login.Signin',
    xtype   : 'app-signin-admin',
    controller : 'signin-admin',

    buttons     : [
        {
            text    : 'Login',
            handler : 'onSubmitBtnClick'
        }
    ]
});