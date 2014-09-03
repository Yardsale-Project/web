'use strict';

function onSubmit() {
    if(YSConfig.loggedin) {
        return Paypal.onSubmit();
    } else {
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
                            handler : 'onSubmitBtnPayClick'
                        }, {
                            text    : 'Cancel',
                            handler : 'onCancelBtnClick'
                        }
                    ]
                }
            ]
        }).show();
    }

    return false;
}

Ext.define('YSCommon.helper.Paypal', {
	singleton 			: true,
	alternateClassName  : ['Paypal'],
    ppWindow            : null,

    proceed             : false,

    onBeforeSubmit : function() {
        UserHelper.getUserLoginStatus(this, this.loggedInCallback, this.loggedOutCallback);
    },

	onSubmit : function() {

        this.ppWindow = Ext.create('Ext.Component', {
            width: 385,
            height: 550,
            floating: {shadow: false}, // make this panel an absolutely-positioned floating component
            header : false,
            border  : false,
            frame   : false,
            modal   : true,
            html: '<iframe name="PPDGFrame" frameborder="0" scrolling="no" width="100%" height="100%"></iframe>'
        }).show(); // render and show the floating panel

        window.ppWindow = this.ppWindow;

        window.updateOrder = this.updateOrder;
        
        return true;
    },

    updateOrder: function (order, status) {
        var me = this;

        var wait = Ext.Msg.wait('Updating order...');

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

                if(rsp.success == true) {
                    wait.hide();

                    Ext.Msg.show({
                        title       : 'Item Purchase',
                        msg         : rsp.message,
                        buttons     : Ext.MessageBox.OK,
                        icon        : Ext.MessageBox.INFO,
                        fn          : function(){
                            window.top.itemWin.destroy();
                        },
                        scope       : me
                    });
                } else {
                    wait.hide();
                    Ext.Msg.show({
                        title       : 'Item Purchase',
                        msg         : rsp.errorMessage,
                        buttons     : Ext.MessageBox.OK,
                        icon        : Ext.MessageBox.ERROR,
                        fn          : function(){
                            window.top.itemWin.destroy();
                        },
                        scope       : me
                    });
                }
            },
            failure : function(response) {
                var rsp = Ext.JSON.decode(response.responseText);
                console.log('fail', rsp);
                wait.hide();

                Ext.Msg.show({
                    title       : 'Item Purchase',
                    msg         : rsp.errorMessage + ' failed',
                    buttons     : Ext.MessageBox.OK,
                    icon        : Ext.MessageBox.ERROR,
                    fn          : function(){
                        window.top.itemWin.destroy();
                    },
                    scope       : me
                });
            }
        });
    },

    redirect : function() {
        alert('redirect');
        window.top.itemWin.destroy();
    },

    loggedInCallback : function() {
        YSDebug.log('login');
        obj.proceed = true;
    },

    loggedOutCallback : function(obj, resp) {
        YSDebug.log('log out');
        obj.proceed = false;
        /*Ext.create('Ext.window.Window', {
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
                            handler : 'onSubmitBtnClick'
                        }, {
                            text    : 'Cancel',
                            handler : this.onCancelBtnClick
                        }
                    ]
                }
            ]
        }).show();*/
    },

    onCancelBtnClick : function() {
        YSDebug.log('this cancel');
    },

    getPaypalAccount : function( object, withAccountCallback, noAccountCallback ) {

        var noAccountCallback = noAccountCallback || '';

        var itmId = object.view._itmId,
            price = object.lookupReference('price'),
            quantity = object.lookupReference('quantity');

        Ext.Ajax.request({
            url     : YSConfig.url + '/application/payment/getPaypalAccount',
            method  : 'POST',
            waitMsg : 'Getting paypal info...',
            params  : {
                itmId       : itmId,
                price       : price,
                quantity    : quantity
            },
            success : function(response) {

                var rsp = Ext.JSON.decode(response.responseText);

                if(rsp.success)
                {
                    if( rsp.email != '') {

                        withAccountCallback(object, rsp);
                    } else {

                        if(!Ext.isEmpty(noAccountCallback)) {
                            noAccountCallback(object, rsp);
                        }
                    }
                } else {
                    YSDebug.log('failed', rsp.success);

                    Ext.Msg.show({
                        title       : 'Paypal Account Info',
                        msg         : rsp.errorMessage,
                        buttons     : Ext.MessageBox.OK,
                        icon        : Ext.MessageBox.ERROR
                    });
                }
            }
        });
    }
});