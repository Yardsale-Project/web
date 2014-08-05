'use strict';

Ext.define('YSCommon.helper.User', {
	singleton 			: true,
	alternateClassName  : ['UserHelper'],

	getUserLoginStatus : function( object, loggedInCallback, loggedOutCallback ) {

		var loggedOutCallback = loggedOutCallback || '';
		Ext.Ajax.request({
            url     : YSConfig.url + '/application/user/getUserSessionCode',
            method  : 'POST',
            success : function(response) {

                var rsp = Ext.JSON.decode(response.responseText);

                if(rsp.success)
                {
                    if( rsp.email != '') {
                        YSDebug.log('logged in');
                        YSConfig.loggedin = true;

                        loggedInCallback(object, rsp);
                    } else {

                    	if(!Ext.isEmpty(loggedOutCallback)) {
                            YSConfig.loggedin = false;
                    		loggedOutCallback(object, rsp);
                    	}
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
            }
        });
	}
});