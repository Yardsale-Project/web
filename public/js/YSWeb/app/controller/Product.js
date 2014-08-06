'use strict';

Ext.define('YSWeb.controller.Product', {
    extend: 'Ext.app.Controller',

    routes : {
    	'itm/:id'   : {
    		before 	: 'beforeShowProduct',
    		action 	: 'displayProduct',
    		conditions : {
    			':id' : '(ITM-[0-9]+_[0-9]+)'
    		}
    	}
    },

    init : function() {
    	this.action = null;
        this.ppEmail = '';
    },


    beforeShowProduct : function(id, action) {
    	this.action = action;
    	UserHelper.getUserLoginStatus(this, this.loggedInCallback, this.loggedOutCallback);
    },

    loggedInCallback : function(object,rsp) {
        var accountBtn  = Ext.ComponentQuery.query('#accountBtn')[0];
        var signInBtn   = Ext.ComponentQuery.query('#signInBtn')[0];
        var orTbText    = Ext.ComponentQuery.query('#orTbText')[0];
        var registerBtn = Ext.ComponentQuery.query('#registerBtn')[0];
        var logoutToken = Ext.ComponentQuery.query('#logoutToken')[0];
        var navigation = Ext.ComponentQuery.query('#navigation')[0];


        if(rsp.email.length > 0) {
            accountBtn.setText(rsp.email);

            accountBtn.show();
            navigation.show();

            signInBtn.hide();
            orTbText.hide();
            registerBtn.hide();

            object.requestCSRFToken(object, logoutToken);

            YSCommon.loggedin = true;
        }
        
        YSDebug.log('object', object.action);
        if(object.action) {
            object.action.resume();
        }
       
    },

    loggedOutCallback : function(object,rsp) {
        YSDebug.log('not logged in');

        if(object.action) {
            object.action.resume();
        }
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

    displayProduct : function(id) {
    	YSDebug.log('item', id);

    	var itm = id.split('_'),
            me  = this;

    	Ext.create('Ext.window.Window', {
	        modal       : true,
	        resizable   : false,
	        layout      : 'fit',
	        closeAction : 'destroy',
	        title       : itm[0],

	        items       : [
	            {
	                xtype   : 'app-clientproduct',
	                _itmId  : itm[1],
                    _itmCd  : itm[0]
	            }
	        ],

	        animateTarget : 'product_' + itm[1]
	    }).show();
    }
});
