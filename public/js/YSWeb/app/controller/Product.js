'use strict';

Ext.define('YSWeb.controller.Product', {
    extend: 'Ext.app.Controller',

    routes : {
        'itm/:id'   : {
            before  : 'beforeShowProduct',
            action  : 'displayProduct',
            conditions : {
                ':id' : '(ITM-[0-9]+_[0-9]+)'
            }
        },
    	'itm/:id/:type/:or'   : {
    		before 	: 'beforeShowProductOrder',
    		action 	: 'displayProductOrder',
    		conditions : {
    			':id' : '(ITM-[0-9]+_[0-9]+)'
    		}
    	}
    },

    init : function() {
    	this.action = null;
        this.ppEmail = '';
        this.itemWin = null;
    },


    beforeShowProduct : function(id, action) {
    	this.action = action;
    	UserHelper.getUserLoginStatus(this, this.loggedInCallback, this.loggedOutCallback);
    },

    beforeShowProductOrder : function(id, type, or, action) {
        console.log('argas', arguments);
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

        if(this.itemWin) {
            this.itemWin.destroy();
        }
    	this.itemWin = Ext.create('Ext.window.Window', {
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
    },

    displayProductOrder : function(id, type, or) {
        YSDebug.log('displayProductOrder', id);
        YSDebug.log('type', type);
        YSDebug.log('or', or);

        var itm = id.split('_'),
            me  = this,
            status;

        if(type == 'c') {
            status = 3;
        } else if( type == 's') {
            status = 2;
        }

        if(this.itemWin) {
            this.itemWin.destroy();
        }
        this.itemWin = Ext.create('Ext.window.Window', {
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

        var box = Ext.MessageBox.wait('Please wait while I do something or other', 'Performing Actions');

        this.updateOrder(box, or, status);
    },

    updateOrder: function (myMask, order, status) {
        var mask = myMask;
        var me = this;

        Ext.Ajax.request({
            url     : YSConfig.url + '/application/payment/updateOrder',
            method  : 'POST',
            params  : {
                order   : order,
                status  : status
            },
            success : function(response) {
                var rsp = Ext.JSON.decode(response.responseText);

                console.log('success', rsp);
                mask.hide();

                if(rsp.success == true) {
                    

                    Ext.Msg.show({
                        title       : 'Item Purchase',
                        msg         : rsp.message,
                        buttons     : Ext.MessageBox.OK,
                        icon        : Ext.MessageBox.INFO,
                        fn          : me.redirect
                    });
                } else {
                    Ext.Msg.show({
                        title       : 'Item Purchase',
                        msg         : rsp.errorMessage,
                        buttons     : Ext.MessageBox.OK,
                        icon        : Ext.MessageBox.ERROR,
                        fn          : me.redirect
                    });
                }
            },
            failure : function(response) {
                var rsp = Ext.JSON.decode(response.responseText);
                console.log('fail', rsp);
                mask.hide();

                Ext.Msg.show({
                    title       : 'Item Purchase',
                    msg         : rsp.errorMessage + ' failed',
                    buttons     : Ext.MessageBox.OK,
                    icon        : Ext.MessageBox.ERROR,
                    fn          : me.redirect
                });
            }
        });
    },

    redirect : function() {
        this.redirectTo('home');
    }
});
