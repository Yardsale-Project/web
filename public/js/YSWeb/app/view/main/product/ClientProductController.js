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

        this.getProduct(this.view._itmId);
    },

    getProduct : function(id) {
        var me = this;
        Ext.Ajax.request({
            url     : YSConfig.url + '/application/product/getProduct',
            params  : {
                id : id
            },
            success : function(response) {
                var rsp = Ext.JSON.decode(response.responseText);

                if(rsp.success)
                {
                    YSDebug.log('success', rsp);

                    var prod = rsp.result;

                    var id              = me.lookupReference('id'),
                        title           = me.lookupReference('title'),
                        imguserpicture  = me.lookupReference('imguserpicture'),
                        thumbPrice      = me.lookupReference('thumbPrice'),
                        price           = me.lookupReference('price'),
                        quantity        = me.lookupReference('quantity');

                    id.setValue(prod.id);
                    title.setText(prod.productName);
                    imguserpicture.setSrc('http://local.main.yardsale:8181/img/product/' + prod.image);
                    thumbPrice.setText('Php ' + prod.currentPrice);
                    price.setValue(prod.currentPrice);

                }
            },
            failure : function(response) {

            }
        });
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
