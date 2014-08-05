'use strict';

Ext.define('YSWeb.view.main.product.ClientProductController', {
    extend: 'Ext.app.ViewController',
    alternateClassName  : ['YSClientProductController'],

    alias: 'controller.clientproduct',

    init : function () {
        this.control({
            'app-clientproduct' : {
                beforerender : 'onBeforeRender'
            },
            'app-clientproduct #payNowBtn' : {
                afterrender : 'onAfterRenderForm'
            }
        });

        this.reader = null;
    },

    onBeforeRender : function() {
        YSDebug.log('item id',this.view._itmId);
    },

    onAfterRenderForm: function() {
        if(YSConfig.loggedin) {
            var paykey = Ext.get('paykey');
            var submitBtn = Ext.get('submitBtn');

            paykey.dom.value = '1321324';
            YSDebug.log('paykey.value',paykey.dom.value);

            //submitBtn.dom.click();
        }
    },

    onPPBtnClick : function() {
        //check if there is paypal account set
        Paypal.getPaypalAccount(this, this.withAccountCallback, this.noAccountCallback);
    },

    withAccountCallback : function(obj, rsp) {

        obj.ppEmail = rsp.email;

        if(obj.action) {
            obj.action.resume();
        }
    },

    noAccountCallback : function(obj, rsp) {

        Ext.create('Ext.window.Window', {
            modal   : true,
            resizable: false,
            closeAction: 'destroy',
            layout  : 'fit',

            items   : [{
                xtype   : 'app-clientpaypalsetting',
                _obj    : obj
            }]
        }).show();
    }
});
